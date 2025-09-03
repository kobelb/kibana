/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import Path from 'path';

import { run } from '@kbn/dev-cli-runner';
import { createFailError } from '@kbn/dev-cli-errors';
import { getRepoFiles } from '@kbn/get-repo-files';
import { PackageFileMap } from '@kbn/repo-file-maps';
import { updatePackageMap, getPackages } from '@kbn/repo-packages';
import { REPO_ROOT } from '@kbn/repo-info';
import { TS_PROJECTS, TsProject } from '@kbn/ts-projects';
import { makeMatcher } from '@kbn/picomatcher';
import { runLintRules, PackageLintTarget } from '@kbn/repo-linter';

import { RULES } from './rules';
import { migratePluginsToPackages } from './migrate_plugins_to_package';
import { ToolingLog } from '@kbn/tooling-log';

const legacyManifestMatcher = makeMatcher(['**/kibana.json', '!**/{__fixtures__,fixtures}/**']);

const kebabCase = (input: string) =>
  input
    .replace(/([a-z])([A-Z])/, '$1 $2')
    .split(/\W+/)
    .filter((f) => !!f)
    .join('-')
    .toLowerCase();

function getFilter(input: string) {
  const repoRel = Path.relative(REPO_ROOT, Path.resolve(input));
  return ({ pkg }: PackageLintTarget) =>
    pkg.name === input ||
    pkg.name === `@kbn/${input}` ||
    pkg.name === `@kbn/${kebabCase(input)}` ||
    pkg.normalizedRepoRelativeDir === input ||
    repoRel.startsWith(pkg.normalizedRepoRelativeDir + '/');
}

function findOrphans(allTargets: PackageLintTarget[], log: ToolingLog) {
  // step 1)  iterate over all targets. if they're a package (not a plugin)
  // we add them to a map which is used to track the number of dependents 
  const dependentPackageMap = new Map<string, string[]>();
  for (const target of allTargets) {
    
    // there are some TS projects that aren't real packages, and
    // we aren't concerned with those, so we'll skip them.
    if (target.pkg != null && !target.pkg.isPlugin()) {
      dependentPackageMap.set(target.pkg.name, []);
    }
  }

  // step 2) iterate over all targets and their dependencies. use this
  // to build the list of dependents of each package
  for (const target of allTargets) {
    const tsProject : TsProject = target.getTsProject();
    const references = tsProject?.config?.kbn_references;
    if (references === undefined) {
      continue;
    }

    for (const reference of references) {
      // kbn_references can use { path: 'some/path/tsconfig.json' }, but we
      // aren't concerned with this... this is super awkward anyway
      if (typeof reference !== 'string') {
        continue;
      }

      // we already added all packages, if it's not added, it's a plugin
      // that we can ignore
      const dependentPackage = dependentPackageMap.get(reference);
      if (dependentPackage == null) {
        continue;
      }

      dependentPackage!.push(tsProject.name);
    }
  }

  // step 3) error on orpans, warn on single dependents
  log.info(`${dependentPackageMap.size} total packages scanned for orphans`);
  let orphans = false;
  for (const [pkg, dependents] of dependentPackageMap) {
    if (dependents.length === 0) {
      log.error(`${pkg} is orphaned and has no dependents`);
      orphans = true;
    } else if (dependents.length === 1) {
      log.warning(`${pkg} only has a single dependent, this is dubious`);
    }
  }
  
  return orphans;
}

run(
  async ({ log, flagsReader }) => {
    const filter = flagsReader.getPositionals();
    let allRepoFiles = await getRepoFiles();

    const legacyPackageManifests = Array.from(allRepoFiles).filter((f) =>
      legacyManifestMatcher(f.repoRel)
    );

    if (legacyPackageManifests.length) {
      await migratePluginsToPackages(legacyPackageManifests);
      log.warning('Migrated legacy plugins to packages');
      allRepoFiles = await getRepoFiles();
    }

    const pkgManifestPaths = Array.from(allRepoFiles)
      .filter((f) => f.basename === 'kibana.jsonc')
      .map((f) => f.abs);
    if (await updatePackageMap(REPO_ROOT, pkgManifestPaths)) {
      log.warning('updated package map');
    }
    const packages = getPackages(REPO_ROOT);

    const allTargets = packages
      .map(
        (p) =>
          new PackageLintTarget(
            p,
            TS_PROJECTS.find((ts) => ts.repoRelDir === p.normalizedRepoRelativeDir)
          )
      )
      .sort((a, b) => b.repoRel.length - a.repoRel.length);

    const toLint = Array.from(
      new Set(
        !filter.length
          ? allTargets
          : filter.map((input) => {
              const pkg = allTargets.find(getFilter(input));

              if (!pkg) {
                throw createFailError(
                  `unable to find a package matching [${input}]. Supply either a package id/name or path to a package`
                );
              }

              return pkg;
            })
      )
    ).sort((a, b) => a.repoRel.localeCompare(b.repoRel));

    const orphans = findOrphans(allTargets, log);

    const fileMap = new PackageFileMap(packages, allRepoFiles);
    const { lintingErrorCount } = await runLintRules(log, toLint, RULES, {
      fix: flagsReader.boolean('fix'),
      getFiles: (target) => fileMap.getFiles(target.pkg),
    });

    if (!lintingErrorCount && !orphans) {
      log.success('All packages linted successfully');
    } else {
      throw createFailError('see above errors');
    }
  },
  {
    usage: `node scripts/lint_packages [...packages]`,
    flags: {
      boolean: ['fix'],
      alias: { f: 'fix' },
      help: `
        --fix              Automatically fix some issues in tsconfig.json files
      `,
    },
    description: 'Validate packages using a set of rules that evolve over time.',
  }
);
