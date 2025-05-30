/**
 * @license
 * Copyright 2025 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import { Random } from "../utils/randomness";
import { Point } from "../turtle/turtle";
import { Pair } from "./pair";
import { Mod } from "../mods/mod";

// Implementation of p5's curvePoint function using Catmull-Rom spline interpolation
function curvePoint(
  p0: number,
  p1: number,
  p2: number,
  p3: number,
  t: number
): number {
  // Catmull-Rom matrix coefficients
  const c0 = -0.5 * p0 + 1.5 * p1 - 1.5 * p2 + 0.5 * p3;
  const c1 = p0 - 2.5 * p1 + 2 * p2 - 0.5 * p3;
  const c2 = -0.5 * p0 + 0.5 * p2;
  const c3 = p1;

  // Calculate point using cubic polynomial
  const t2 = t * t;
  const t3 = t2 * t;
  return c0 * t3 + c1 * t2 + c2 * t + c3;
}

// Implementation of p5's lerp function
function lerp(start: number, stop: number, amt: number): number {
  return start + (stop - start) * amt;
}

export class GrowthPair {
  constructor(
    public width: Mod,
    public age: Mod
  ) {}
}

export class GrowthSpline {
  constructor(public pairs: GrowthPair[]) {}

  eval(age: number): Point[] {
    const spline: Point[] = [];
    let i = 0;
    let previousPair = this.pairs[0];
    let pair = this.pairs[0];
    while (pair && pair.age.val() <= age) {
      spline.push({
        x: pair.width.val(),
        y: pair.age.val(),
      });
      previousPair = pair;
      pair = this.pairs[i++];
    }
    if (!pair) {
      console.log("spline 1 ", spline);
      return spline;
    }
    // Always be interpolating the next pair beyond what we've _fully_
    // interpolated.
    let topAge = Math.max(age, this.getTopAge(spline));
    spline.push({
      x: lerp(
        0,
        pair.width.val(),
        (topAge - previousPair.age.val()) /
          (pair.age.val() - previousPair.age.val())
      ),
      y: topAge,
    });
    previousPair = pair;
    pair = this.pairs[i++];
    if (!pair) {
      console.log(
        "spline 2",
        spline,
        topAge,
        this.pairs[i - 3].age.val(),
        this.pairs[i - 2].age.val()
      );
      return spline;
    }

    // If the curve goes beyond the age where we would have fully interpolated
    // that pair, start interpolating the next pair after that as well.
    topAge = this.getTopAge(spline);
    console.log(age, topAge, previousPair.age.val());
    if (previousPair.age.val() < topAge) {
      spline.push({
        x: lerp(
          0,
          pair.width.val(),
          (topAge - previousPair.age.val()) /
            (pair.age.val() - previousPair.age.val())
        ),
        y: topAge,
      });
    }
    console.log("spline 3", spline);
    return spline;
  }

  private getTopAge(spline: Point[]): number {
    const last = spline.length - 1;
    return curvePoint(
      spline[last - 1].y,
      spline[last].y,
      spline[last].y,
      spline[last - 1].y,
      0.5
    );
  }

  mutate(random: Random): void {
    this.pairs.forEach((pair) => {
      pair.age.mutate(random);
      pair.width.mutate(random);
    });
  }

  save(): Record<string, any> | undefined {
    return {
      points: this.pairs.map((pair) => ({
        age: pair.age.save(),
        width: pair.width.save(),
      })),
    };
  }

  load(data: Record<string, any> | undefined): void {
    if (!data) return;
    this.pairs = data.points.map((pairData: Record<string, any>) => ({
      first: new Pair(pairData.first, pairData.second),
    }));
  }
}
