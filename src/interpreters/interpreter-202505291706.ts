/**
 * @license
 * Copyright 2025 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import { Segment } from "../segments/segment";
import { Point, Turtle } from "../turtle/turtle";

export interface SegmentForInterpreter202505291706 extends Segment {
  length: number;
  width: number;
  spline: Point[];
}

export class Interpreter202505291706 {
  constructor(public readonly turtle: Turtle) {}

  interpret(segment: SegmentForInterpreter202505291706): void {
    this.turtle.pushState();
    const spline = segment.spline.map((p) => ({
      x: p.x * segment.width,
      y: p.y * segment.length,
    }));
    this.turtle.shape(spline);
    this.turtle.popState();
  }
}
