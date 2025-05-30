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
import { Constant as Const } from "../functions/constant";
import { Random } from "../utils/randomness";
import { Point } from "../turtle/turtle";
import { Spline } from "../functions/spline";
import { Pair } from "../functions/pair";
import { Scale } from "../functions/scale";

export interface Segment202505301035 extends Segment {
  length: number;
  width: number;
  spline: Point[];
  age: number;
}

export interface Segment202505301035Constructor<S extends Segment202505301035> {
  new (length: number, width: number, spline: Point[], age: number): S;
}

export class Producer202505301035<
  S extends Segment202505301035,
> extends Producer<S> {
  private readonly modifyAge = new Clamp(
    new C(0),
    new C(1),
    new Linear(new Cl(1, 1, 2), new Cl(0.1, 0.01, 0.5))
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
  private readonly modifySpline = new Spline([
    new Pair(
      new Scale(
        new C(0.5),
        new Clamp(new C(0), new C(1), new Linear(new C(3), new C(0)))
      ),
      new Const(new C(0))
    ),
    new Pair(
      new Scale(
        new C(0.75),
        new Clamp(new C(0), new C(1), new Linear(new C(2), new C(0)))
      ),
      new Const(new C(0.3))
    ),
    new Pair(
      new Scale(
        new C(1),
        new Clamp(new C(0), new C(1), new Linear(new C(2), new C(0)))
      ),
      new Const(new C(0.8))
    ),
    new Pair(new Const(new C(0)), new Const(new C(1))),
  ]);

  constructor(
    public readonly segmentConstructor: Segment202505301035Constructor<S>
  ) {
    super();
  }

  produce(segment: S, rand?: Random): S {
    const newSegment = segment.duplicate();
    newSegment.age = this.modifyAge.eval(segment.age);
    newSegment.length = this.modifyLength.eval(newSegment.age);
    // newSegment.width = this.modifyWidth.eval(newSegment.age);
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
