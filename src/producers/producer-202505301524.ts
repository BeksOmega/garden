/**
 * @license
 * Copyright 2025 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import { Segment } from "../segments/segment";
import { Producer } from "./producer";
import { Linear } from "../functions/linear";
import { Clamp } from "../functions/clamp";
import { Constant as C } from "../mods/constant";
import { Clamped as Cl } from "../mods/clamped";
import { Random } from "../utils/randomness";
import { Point } from "../turtle/turtle";
import { GrowthSpline, GrowthPair } from "../functions/growth-spline";

export interface Segment202505301524 extends Segment {
  length: number;
  width: number;
  spline: Point[];
  age: number;
}

export interface Segment202505301524Constructor<S extends Segment202505301524> {
  new (length: number, width: number, spline: Point[], age: number): S;
}

export class Producer202505301524<
  S extends Segment202505301524,
> extends Producer<S> {
  private readonly modifyAge = new Clamp(
    new C(0),
    new C(1),
    new Linear(new Cl(1, 1, 2), new Cl(0.01, 0.01, 0.5))
  );
  private readonly modifyLength = new Linear(
    new Cl(80, 0, 100),
    new C(0),
    new Clamp(new C(0), new C(1))
  );
  private readonly modifyWidth = new Linear(
    new Cl(20, 10, 30),
    new C(0),
    new Clamp(new C(0), new C(1))
  );
  private readonly modifySpline = new GrowthSpline([
    new GrowthPair(new C(0.5), new C(0)),
    // new GrowthPair(new C(0.75), new C(0.3)),
    new GrowthPair(new C(1), new C(0.7)),
    new GrowthPair(new C(0), new C(1)),
  ]);

  constructor(
    public readonly segmentConstructor: Segment202505301524Constructor<S>
  ) {
    super();
  }

  produce(segment: S, rand?: Random): S {
    const newSegment = segment.duplicate();
    newSegment.age = this.modifyAge.eval(segment.age);
    // newSegment.length = this.modifyLength.eval(newSegment.age);
    // newSegment.width = this.modifyWidth.eval(newSegment.age);
    newSegment.length = 80;
    newSegment.width = 20;
    newSegment.spline = this.modifySpline.eval(newSegment.age);

    return newSegment;
  }

  mutate(random: Random): void {
    this.modifyAge.mutate(random);
    this.modifyLength.mutate(random);
    this.modifyWidth.mutate(random);
  }

  save(): Record<string, any> {
    return {
      modifyAge: this.modifyAge.save(),
      modifyLength: this.modifyLength.save(),
      modifyWidth: this.modifyWidth.save(),
    };
  }

  load(data: Record<string, any>) {
    this.modifyAge.load(data.modifyAge);
    this.modifyLength.load(data.modifyLength);
    this.modifyWidth.load(data.modifyWidth);
  }
}
