/**
 * @license
 * Copyright 2025 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import { Func, Func2 } from "./function";
import { Random } from "../utils/randomness";

export class Product implements Func2 {
  constructor(public readonly fns: Func[]) {}

  eval(xs: number[]): number {
    return this.fns.reduce((acc, fn, i) => acc * fn.eval(xs[i]), 1);
  }

  mutate(random: Random): void {
    this.fns.forEach((fn) => fn.mutate(random));
  }

  save(): Record<string, any> | undefined {
    const fnsData = this.fns.map((fn) => fn.save());

    if (fnsData.every((fn) => fn === undefined)) {
      return undefined;
    }
    return {
      fns: fnsData,
    };
  }

  load(data: Record<string, any> | undefined): void {
    if (!data) return;
    this.fns.forEach((fn, i) => fn.load(data.fns[i]));
  }
}
