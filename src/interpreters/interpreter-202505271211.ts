/**
 * @license
 * Copyright 2025 Beka Westberg
 * SPDX-License-Identifier: MIS
 */

import { Segment } from "../segments/segment";
import { Turtle } from "../turtle/turtle";

export interface Segment202505271211 extends Segment {
  length: number;
  angle: number;
  children: this[];
}

export class Interpreter202505271211 {
  constructor(public readonly turtle: Turtle) {}

  /** Recursively interprets the segment. */
  interpret(segment: Segment202505271211): void {
    this.turtle.pushState();
    this.turtle.left(segment.angle);
    this.turtle.forward(segment.length);
    for (const child of segment.children) {
      this.interpret(child);
    }
    this.turtle.popState();
  }
}
