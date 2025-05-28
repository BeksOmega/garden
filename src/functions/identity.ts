/**
 * @license
 * Copyright 2025 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import { Random } from "../utils/randomness";
import { Func } from "./function";

export class Identity implements Func {
  eval(x: number): number {
    return x;
  }

  mutate(_: Random): void {}

  save(): Record<string, any> {
    return undefined;
  }

  load(data: Record<string, any>): void {}
}
