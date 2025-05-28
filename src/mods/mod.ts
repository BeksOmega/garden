/**
 * @license
 * Copyright 2025 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import { Random } from "../utils/randomness";

export interface Mod {
  /** Returns the current value of the mod. */
  val(): number;

  /** Sets the value of the mod. */
  setVal(val: number): void;

  /** Mutates the value of the mod. */
  mutate(random: Random): void;

  save(): Record<string, any> | undefined;

  load(data: Record<string, any> | undefined): void;
}
