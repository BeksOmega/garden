/**
 * @license
 * Copyright 2025 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import { Func } from "./function";
import { Identity } from "./identity";
import { Mod } from "../mods/mod";
import { Random } from "../utils/randomness";

export class Clamp implements Func {
  /**
   * @param fn The function to apply the clamp transformation to.
   * @param min The minimum value of the function.
   * @param max The maximum value of the function.
   */
  constructor(
    public min: Mod,
    public max: Mod,
    public readonly fn: Func = new Identity()
  ) {}

  eval(x: number): number {
    return Math.min(Math.max(this.fn.eval(x), this.min.val()), this.max.val());
  }

  mutate(random: Random): void {
    this.min.mutate(random);
    this.max.mutate(random);
    this.fn.mutate(random);
  }

  save(): Record<string, any> | undefined {
    const minData = this.min.save();
    const maxData = this.max.save();
    const fnData = this.fn.save();
    
    if (minData === undefined && maxData === undefined && fnData === undefined) {
      return undefined;
    }
    
    return {
      min: minData,
      max: maxData,
      fn: fnData,
    };
  }

  load(data: Record<string, any> | undefined): void {
    if (!data) return;
    this.min.load(data.min);
    this.max.load(data.max);
    this.fn.load(data.fn);
  }
}
