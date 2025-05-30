/**
 * @license
 * Copyright 2025 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import { Func } from "./function";
import { Identity } from "./identity";
import { Mod } from "../mods/mod";
import { Random } from "../utils/randomness";

export class Scale implements Func {
  /**
   * @param fn The function to apply the linear transformation to.
   * @param m The scale factor.
   */
  constructor(
    public m: Mod,
    public readonly fn: Func = new Identity()
  ) {}

  eval(x: number): number {
    return this.m.val() * this.fn.eval(x);
  }

  mutate(random: Random): void {
    this.m.mutate(random);
    this.fn.mutate(random);
  }

  save(): Record<string, any> | undefined {
    const mData = this.m.save();
    const fnData = this.fn.save();
    
    if (mData === undefined && fnData === undefined) {
      return undefined;
    }
    return {
      m: mData,
      fn: fnData,
    };
  }

  load(data: Record<string, any> | undefined): void {
    if (!data) return;
    this.m.load(data.m);
    this.fn.load(data.fn);
  }
}
