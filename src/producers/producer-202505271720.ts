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
  private readonly modifyAge = new Clamp(0, 1, new Linear(1, 0.2));
  private readonly modifyLength = new Linear(60, 0, new Clamp(0, 1));
  private readonly newChildCount = new Power(-3.5, 0.4, 0.3, 3);
  private readonly newChildStage = new Linear(1, 0.2);
  private readonly newChildAngle = new Linear(45, -45);

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
}
