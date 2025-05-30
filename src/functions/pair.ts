/**
 * @license
 * Copyright 2025 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import { Func } from "./function";
import { Random } from "../utils/randomness";

export class Pair {
  constructor(
    public first: Func,
    public second: Func
  ) {}

  eval(n: number): number[] {
    return [this.first.eval(n), this.second.eval(n)];
  }

  mutate(random: Random): void {
    this.first.mutate(random);
    this.second.mutate(random);
  }

  save(): Record<string, any> | undefined {
    const firstData = this.first.save();
    const secondData = this.second.save();

    if (firstData === undefined && secondData === undefined) {
      return undefined;
    }
    return {
      first: firstData,
      second: secondData,
    };
  }

  load(data: Record<string, any> | undefined): void {
    if (!data) return;
    this.first.load(data.first);
    this.second.load(data.second);
  }
}
