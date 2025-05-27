/**
 * @license
 * Copyright 2025 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import { Segment } from "../segments/segment";
import { Producer } from "./producer";

export interface Segment202505271048 extends Segment {
  /** The length of the segment. */
  length: number;

  /** The angle to turn left by in degrees. */
  angle: number;

  /** The children of the segment. */
  children: this[];
}

export interface Segment202505271048Constructor<S extends Segment202505271048> {
  new (length: number, angle: number): S;
}

export class Producer202505271048<
  S extends Segment202505271048,
> extends Producer<S> {
  constructor(
    public readonly segmentConstructor: Segment202505271048Constructor<S>
  ) {
    super();
  }

  produce(segment: S): S {
    const newSegment = segment.duplicate();
    newSegment.children.push(new this.segmentConstructor(20, 20));
    newSegment.children.push(new this.segmentConstructor(20, -20));
    for (const child of segment.children) {
      newSegment.children.push(this.produce(child));
    }
    return newSegment;
  }
}
