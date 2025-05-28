/**
 * @license
 * Copyright 2025 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import { Func } from "./function";
import { Identity } from "./identity";

export class Linear extends Func {
  /**
   * @param fn The function to apply the linear transformation to.
   * @param m The slope of the line.
   * @param b The y-intercept of the line
   */
  constructor(
    public m: number,
    public b: number,
    public readonly fn: Func = new Identity()
  ) {
    super();
  }

  eval(x: number): number {
    return this.m * this.fn.eval(x) + this.b;
  }
}
