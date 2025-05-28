/**
 * @license
 * Copyright 2025 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import { Segment } from "../segments/segment";
import { Turtle } from "../turtle/turtle";

export interface SegmentForInterpreter202505280000 extends Segment {
  length: number;
  angle: number;
  offset: number;
  children: this[];
}

export class Interpreter202505280000 {
  constructor(public readonly turtle: Turtle) {}

  /** Recursively interprets the segment. */
  interpret(segment: SegmentForInterpreter202505280000): void {
    this.turtle.pushState();
    this.turtle.left(segment.angle);
    this.turtle.forward(segment.length);

    for (const child of segment.children) {
      this.turtle.forward(-(segment.length - child.offset));
      this.interpret(child);
      this.turtle.forward(segment.length - child.offset);
    }
    this.turtle.popState();
  }
}
