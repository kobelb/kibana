/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import rimraf from 'rimraf';
import Rx from 'rxjs/Rx';
import cdp from 'chrome-remote-interface';
import { HeadlessChromiumDriver } from '../driver';
import { exitCodeSuggestion } from '../../exit_code_suggestion';

const compactWhitespace = (str) => {
  return str.replace(/\s+/, ' ');
};


export class HeadlessChromiumDriverFactory {
  constructor(spawnChromium$, logger, browserConfig) {
    this.spawnChromium$ = spawnChromium$;
    this.logger = logger.clone(['chromium-driver-factory']);
    this.browserConfig = browserConfig;
  }

  type = 'chromium';

  create({ bridgePort, viewport }) {
    const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chromium-'));

    this.logger.debug(`spawning chromium process`);

    const params = {
      userDataDir,
      bridgePort,
      viewport,
      disableSandbox: this.browserConfig.disableSandbox,
      proxyConfig: this.browserConfig.proxy
    };

    const chromium$ = this.spawnChromium$(params, () => {
      this.logger.debug(`deleting chromium user data directory at ${userDataDir}`);
      // the unsubscribe function isn't `async` so we're going to make our best effort at
      // deleting the userDataDir and if it fails log an error.
      rimraf(userDataDir, (err) => {
        if (err) {
          return this.logger.error(`error deleting user data directory at ${userDataDir}: ${err}`);
        }
      });
    });

    return chromium$.map(chromium => {
      const stderr$ = Rx.Observable.fromEvent(chromium.stderr, 'data').map(line => line.toString()).share();

      const [ consoleMessage$, message$ ] = stderr$.partition(msg => msg.match(/\[\d+\/\d+.\d+:\w+:CONSOLE\(\d+\)\]/));

      const driver$ = message$
        .first(line => line.indexOf(`DevTools listening on ws://127.0.0.1:${bridgePort}`) >= 0)
        .do(() => this.logger.debug('Connecting chrome remote inspector'))
        .mergeMap(() => cdp({ port: bridgePort, local: true }))
        .do(() => this.logger.debug('Initializing chromium driver'))
        .map(client => new HeadlessChromiumDriver(client, {
          maxScreenshotDimension: this.browserConfig.maxScreenshotDimension,
          logger: this.logger
        }));

      const processError$ = Rx.Observable.fromEvent(chromium, 'error')
        .mergeMap(() => Rx.Observable.throw(new Error(`Unable to spawn Chromium`)));

      const processExit$ = Rx.Observable.fromEvent(chromium, 'exit')
        .mergeMap(code => Rx.Observable.throw(new Error(`Chromium exited with code: ${code}. ${exitCodeSuggestion(code)}`)));

      const nssError$ = message$
        .filter(line => line.includes('error while loading shared libraries: libnss3.so'))
        .mergeMap(() => Rx.Observable.throw(new Error(`You must install nss for Reporting to work`)));

      const fontError$ = message$
        .filter(line => line.includes('Check failed: InitDefaultFont(). Could not find the default font'))
        .mergeMap(() => Rx.Observable.throw(new Error('You must install freetype and ttf-font for Reporting to work')));

      const noUsableSandbox$ = message$
        .filter(line => line.includes('No usable sandbox! Update your kernel'))
        .mergeMap(() => Rx.Observable.throw(new Error(compactWhitespace(`
          Unable to use Chromium sandbox. This can be disabled at your own risk with
          'xpack.reporting.capture.browser.chromium.disableSandbox'
        `))));

      const exit$ = Rx.Observable.merge(processError$, processExit$, nssError$, fontError$, noUsableSandbox$);

      return {
        driver$,
        consoleMessage$,
        message$,
        exit$
      };
    });
  }
}
