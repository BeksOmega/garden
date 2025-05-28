/**
 * @license
 * Copyright 2025 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import { Func } from "./function";
import { Identity } from "./identity";

export class Clamp extends Func {
  /**
   * @param fn The function to apply the clamp transformation to.
   * @param min The minimum value of the function.
   * @param max The maximum value of the function.
   */
  constructor(
    public min: number,
    public max: number,
    public readonly fn: Func = new Identity()
  ) {
    super();
  }

  eval(x: number): number {
    return Math.min(Math.max(this.fn.eval(x), this.min), this.max);
  }
}
