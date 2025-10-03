/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { run } from '@kbn/dev-cli-runner';
import { getPackages } from '@kbn/repo-packages';
import { REPO_ROOT } from '@kbn/repo-info';
import { TS_PROJECTS, TsProject } from '@kbn/ts-projects';
import { PackageLintTarget } from '@kbn/repo-linter';

function writePackageSummary(allTargets: PackageLintTarget[]) {
  // step 1) initialize the dependencies map
  const dependencies = new Map<string, string[]>();
  const packages = new Map<string, PackageLintTarget>();
  for (const target of allTargets) {
    dependencies.set(target.pkg.name, []);
    packages.set(target.pkg.name, target);
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

      const dependency = dependencies.get(reference);
      if (dependency != null) {
        dependency.push(tsProject.pkg!.name);
      }
    }
  }

  console.log(`name\t package or plugin\t group\t # dependents\t dependents`)
  for (const [packageName, dependents] of dependencies) {
    const pkg = packages.get(packageName);
    console.log(`${packageName}\t ${pkg?.pkg.isPlugin() ? 'plugin' : 'package'}\t ${pkg?.pkg.group!}\t ${dependents.length}\t ${dependents}`)
  }
}

run(
  async ({ log }) => {
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

    writePackageSummary(allTargets);

    log.success('Health check complete');
  },
  {
    usage: `node scripts/health_check`,
    description: 'Runs a health check.',
  }
);
