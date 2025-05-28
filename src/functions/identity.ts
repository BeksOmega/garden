/**
 * @license
 * Copyright 2025 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import { Func } from "./function";

export class Identity extends Func {
  eval(x: number): number {
    return x;
  }
}
