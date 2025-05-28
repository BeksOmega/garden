/**
 * @license
 * Copyright 2025 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import { Mod } from "./mod";
import { Random } from "../utils/randomness";

export class Clamped implements Mod {
  constructor(
    private value: number,
    public readonly min: number,
    public readonly max: number,
    private readonly mutationRange: number = 0.1
  ) {}

  val(): number {
    return this.value;
  }

  setVal(val: number): void {
    this.value = Math.min(Math.max(val, this.min), this.max);
  }

  mutate(random: Random): void {
    this.value += random.float(-this.mutationRange, this.mutationRange);
    this.value = Math.min(Math.max(this.value, this.min), this.max);
  }

  save(): Record<string, any> {
    return {
      value: this.value,
    };
  }

  load(data: Record<string, any>): void {
    this.value = data.value;
  }
}
