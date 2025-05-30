/**
 * @license
 * Copyright 2025 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import { Random } from "../utils/randomness";
import { Point } from "../turtle/turtle";
import { Pair } from "./pair";

export class Spline {
  constructor(public points: Pair[]) {}

  eval(x: number): Point[] {
    return this.points.map((pair) => ({
      x: pair.first.eval(x),
      y: pair.second.eval(x),
    }));
  }

  mutate(random: Random): void {
    this.points.forEach((pair) => {
      pair.first.mutate(random);
      pair.second.mutate(random);
    });
  }

  save(): Record<string, any> | undefined {
    return {
      points: this.points.map((pair) => ({
        first: pair.first.save(),
        second: pair.second.save(),
      })),
    };
  }

  load(data: Record<string, any> | undefined): void {
    if (!data) return;
    this.points = data.points.map((pairData: Record<string, any>) => ({
      first: new Pair(pairData.first, pairData.second),
    }));
  }
}
