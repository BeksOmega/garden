/**
 * @license
 * Copyright 2025 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import { Func } from "./function";
import { Identity } from "./identity";
import { Mod } from "../mods/mod";
import { Random } from "../utils/randomness";

export class Power implements Func {
  /**
   * @param fn The function to apply the power transformation to.
   * @param a The scale of the power function.
   * @param b The x offset of the power function (0 value moved right).
   * @param c The exponent of the power function.
   * @param d The y offset of the power function (0 value moved up).
   */
  constructor(
    public a: Mod,
    public b: Mod,
    public c: Mod,
    public d: Mod,
    public readonly fn: Func = new Identity()
  ) {}

  eval(x: number): number {
    return (
      this.a.val() * Math.pow(this.fn.eval(x) - this.b.val(), this.c.val()) +
      this.d.val()
    );
  }

  mutate(random: Random): void {
    this.a.mutate(random);
    this.b.mutate(random);
    this.c.mutate(random);
    this.d.mutate(random);
    this.fn.mutate(random);
  }

  save(): Record<string, any> | undefined {
    const aData = this.a.save();
    const bData = this.b.save();
    const cData = this.c.save();
    const dData = this.d.save();
    const fnData = this.fn.save();
    
    if (aData === undefined && bData === undefined && cData === undefined && dData === undefined && fnData === undefined) {
      return undefined;
    }
    
    return {
      a: aData,
      b: bData,
      c: cData,
      d: dData,
      fn: fnData,
    };
  }

  load(data: Record<string, any> | undefined): void {
    if (!data) return;
    this.a.load(data.a);
    this.b.load(data.b);
    this.c.load(data.c);
    this.d.load(data.d);
    this.fn.load(data.fn);
  }
}
