/**
 * @license
 * Copyright 2025 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import { Segment } from "../segments/segment";
import { Producer } from "./producer";
import { Linear } from "../functions/linear";
import { Power } from "../functions/power";
import { Clamp } from "../functions/clamp";
import { Constant as C } from "../mods/constant";
import { Clamped as Cl } from "../mods/clamped";
import { Random } from "../utils/randomness";

export interface Segment202505271720 extends Segment {
  /** The length of the segment. */
  length: number;

  /** The angle to turn left by in degrees. */
  angle: number;

  /** The stage of the segment. */
  stage: number;

  /** The age of the segment. */
  age: number;

  /** The children of the segment. */
  children: this[];
}

export interface Segment202505271720Constructor<S extends Segment202505271720> {
  new (length: number, angle: number, stage: number, age: number): S;
}

export class Producer202505271720<
  S extends Segment202505271720,
> extends Producer<S> {
  private readonly modifyAge = new Clamp(
    new C(0),
    new C(1),
    new Linear(new Cl(1, 1, 2), new Cl(0.2, 0.01, 0.5))
  );
  private readonly modifyLength = new Linear(
    new Cl(60, 0, 100),
    new C(0),
    new Clamp(new C(0), new C(1))
  );
  private readonly newChildCount = new Power(
    new Cl(-3.5, -10, -1),
    new Cl(0.4, 0, 1),
    new Cl(0.3, 0, 2),
    new Cl(3, 0, 10)
  );
  private readonly newChildStage = new Linear(
    new Cl(1, 1, 2),
    new Cl(0.2, 0.01, 0.5)
  );
  private readonly newChildAngle = new Linear(
    new Cl(-45, -90, 0),
    new Cl(45, 0, 90)
  );

  constructor(
    public readonly segmentConstructor: Segment202505271720Constructor<S>
  ) {
    super();
  }

  produce(segment: S): S {
    const newSegment = segment.duplicate();
    newSegment.age = this.modifyAge.eval(segment.age);
    newSegment.length = this.modifyLength.eval(segment.age - segment.stage);

    const newChildCount = this.newChildCount.eval(segment.stage + segment.age);
    for (let i = 0; i < newChildCount; i++) {
      newSegment.children.push(
        new this.segmentConstructor(
          0,
          this.newChildAngle.eval(i),
          this.newChildStage.eval(segment.stage),
          0
        )
      );
    }
    for (const child of segment.children) {
      newSegment.children.push(this.produce(child));
    }
    return newSegment;
  }

  mutate(random: Random): void {
    this.modifyAge.mutate(random);
    this.modifyLength.mutate(random);
    this.newChildCount.mutate(random);
    this.newChildStage.mutate(random);
    this.newChildAngle.mutate(random);
  }

  save(): Record<string, any> {
    return {
      modifyAge: this.modifyAge.save(),
      modifyLength: this.modifyLength.save(),
      newChildCount: this.newChildCount.save(),
      newChildStage: this.newChildStage.save(),
      newChildAngle: this.newChildAngle.save(),
    };
  }

  load(data: Record<string, any>) {
    this.modifyAge.load(data.modifyAge);
    this.modifyLength.load(data.modifyLength);
    this.newChildCount.load(data.newChildCount);
    this.newChildStage.load(data.newChildStage);
    this.newChildAngle.load(data.newChildAngle);
  }
}
