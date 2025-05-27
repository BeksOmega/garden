/**
 * @license
 * Copyright 2025 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import { Segment } from "../segments/segment";
import { Producer } from "./producer";

export interface Segment202505271309 extends Segment {
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

export interface Segment202505271309Constructor<S extends Segment202505271309> {
  new (length: number, angle: number, stage: number, age: number): S;
}

export class Producer202505271309<
  S extends Segment202505271309,
> extends Producer<S> {
  constructor(
    public readonly segmentConstructor: Segment202505271309Constructor<S>
  ) {
    super();
  }

  produce(segment: S): S {
    const newSegment = segment.duplicate();
    newSegment.age = this.modifiedAge(segment);

    const newChildCount = this.newChildCount(segment);
    for (let i = 0; i < newChildCount; i++) {
      newSegment.children.push(
        new this.segmentConstructor(
          this.newChildLength(segment),
          this.newChildAngle(segment, i),
          this.newChildStage(segment),
          this.newChildAge(segment)
        )
      );
    }
    for (const child of segment.children) {
      newSegment.children.push(this.produce(child));
    }
    return newSegment;
  }

  private modifiedAge(segment: S): number {
    return 1;
  }

  private newChildCount(segment: S): number {
    return -3.5 * (segment.stage + segment.age) + 3;
  }

  private newChildLength(segment: S): number {
    return 20;
  }

  private newChildAngle(segment: S, index: number): number {
    return -20 + 20 * index;
  }

  private newChildStage(segment: S): number {
    return segment.stage + 0.2;
  }

  private newChildAge(segment: S): number {
    return 0;
  }
}
