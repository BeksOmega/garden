/**
 * @license
 * Copyright 2025 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import { Func } from "./function";
import { Mod } from "../mods/mod";
import { Random } from "../utils/randomness";

export class Constant implements Func {
  /**
   * @param c The constant value.
   */
  constructor(public c: Mod) {}

  eval(x: number): number {
    return this.c.val();
  }

  mutate(random: Random): void {
    this.c.mutate(random);
  }

  save(): Record<string, any> | undefined {
    const cData = this.c.save();

    if (cData === undefined) {
      return undefined;
    }
    return {
      c: cData,
    };
  }

  load(data: Record<string, any> | undefined): void {
    if (!data) return;
    this.c.load(data.c);
  }
}
