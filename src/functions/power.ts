/**
 * @license
 * Copyright 2025 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import { Func } from "./function";
import { Identity } from "./identity";

export class Power extends Func {
  /**
   * @param fn The function to apply the power transformation to.
   * @param a The scale of the power function.
   * @param b The x offset of the power function (0 value moved right).
   * @param c The exponent of the power function.
   * @param d The y offset of the power function (0 value moved up).
   */
  constructor(
    public a: number,
    public b: number,
    public c: number,
    public d: number,
    public readonly fn: Func = new Identity()
  ) {
    super();
  }

  eval(x: number): number {
    return this.a * Math.pow(this.fn.eval(x) - this.b, this.c) + this.d;
  }
}
