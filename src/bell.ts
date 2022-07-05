/**
 * @license
 * Copyright 2022 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

export function bell(h: number, c: number, w: number, x: number) {
  return h * Math.exp((-1 * (x - c) * (x - c)) / (2 * w * w));
}