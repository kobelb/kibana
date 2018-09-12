/* tslint:disable */
// Type definitions for mocha 5.2
// Project: http://mochajs.org/
// Definitions by: Kazi Manzur Rashid <https://github.com/kazimanzurrashid>
//                 otiai10 <https://github.com/otiai10>
//                 jt000 <https://github.com/jt000>
//                 Vadim Macagon <https://github.com/enlight>
//                 Andrew Bradley <https://github.com/cspotcode>
//                 Dmitrii Sorin <https://github.com/1999>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.1

declare namespace Mocha {


  // #region Test interface augmentations

  interface HookFunction {
    /**
     * [bdd, qunit, tdd] Describe a "hook" to execute the given callback `fn`. The name of the
     * function is used as the name of the hook.
     *
     * - _Only available when invoked via the mocha CLI._
     */
    (fn: any): void;

    /**
     * [bdd, qunit, tdd] Describe a "hook" to execute the given callback `fn`. The name of the
     * function is used as the name of the hook.
     *
     * - _Only available when invoked via the mocha CLI._
     */
    (fn: any): void;

    /**
     * [bdd, qunit, tdd] Describe a "hook" to execute the given `title` and callback `fn`.
     *
     * - _Only available when invoked via the mocha CLI._
     */
    (name: string, fn?: any): void;

    /**
     * [bdd, qunit, tdd] Describe a "hook" to execute the given `title` and callback `fn`.
     *
     * - _Only available when invoked via the mocha CLI._
     */
    (name: string, fn?: any): void;
  }

  /**
   * Execute after running tests.
   *
   * - _Only available when invoked via the mocha CLI._
   *
   * @see https://mochajs.org/api/global.html#after
   */
  let after: HookFunction;


  /**
   * Execute before running tests.
   *
   * - _Only available when invoked via the mocha CLI._
   *
   * @see https://mochajs.org/api/global.html#before
   */
  let before: HookFunction;
}

declare module "mocha" {
  export = Mocha;
}

declare const before: Mocha.HookFunction;
declare const after: Mocha.HookFunction;