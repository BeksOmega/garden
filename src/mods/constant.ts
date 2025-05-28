/**
 * @license
 * Copyright 2025 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import { Mod } from "./mod";
import { Random } from "../utils/randomness";

export class Constant implements Mod {
  constructor(private value: number) {}

  val(): number {
    return this.value;
  }

  setVal(_: number): void {}

  mutate(_: Random): void {}

  save(): Record<string, any> | undefined {
    return undefined;
  }

  load(_: Record<string, any> | undefined): void {}
}
