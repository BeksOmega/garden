/**
 * @license
 * Copyright 2025 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import { Func } from "./function";
import { Identity } from "./identity";
import { Mod } from "../mods/mod";
import { Random } from "../utils/randomness";

export class Linear implements Func {
  /**
   * @param fn The function to apply the linear transformation to.
   * @param m The slope of the line.
   * @param b The y-intercept of the line
   */
  constructor(
    public m: Mod,
    public b: Mod,
    public readonly fn: Func = new Identity()
  ) {}

  eval(x: number): number {
    return this.m.val() * this.fn.eval(x) + this.b.val();
  }

  mutate(random: Random): void {
    this.m.mutate(random);
    this.b.mutate(random);
    this.fn.mutate(random);
  }

  save(): Record<string, any> | undefined {
    const mData = this.m.save();
    const bData = this.b.save();
    const fnData = this.fn.save();
    
    if (mData === undefined && bData === undefined && fnData === undefined) {
      return undefined;
    }
    return {
      m: mData,
      b: bData,
      fn: fnData,
    };
  }

  load(data: Record<string, any> | undefined): void {
    if (!data) return;
    this.m.load(data.m);
    this.b.load(data.b);
    this.fn.load(data.fn);
  }
}
