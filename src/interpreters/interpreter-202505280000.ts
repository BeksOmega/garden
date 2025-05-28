/**
 * @license
 * Copyright 2025 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import { Segment as BaseSegment } from "../segments/segment";
// Using ActualSegmentClass for clarity on what segment structure is expected.
import { Segment202505280000 as ActualSegmentClass } from '../segments/segment-202505280000';
import { Turtle } from "../turtle/turtle";

// This interface defines the structure of segments that this interpreter can handle.
export interface SegmentForInterpreter202505280000 extends BaseSegment {
  length: number;
  angle: number;
  offset: number; // Crucial for this interpreter
  children: this[]; // Children should also conform to this interface
}

export class Interpreter202505280000 {
  constructor(public readonly turtle: Turtle) {}

  /** Recursively interprets the segment. */
  interpret(segment: SegmentForInterpreter202505280000): void {
    this.turtle.pushState();
    this.turtle.left(segment.angle);
    this.turtle.forward(segment.length); // Draw the current segment

    // Children are drawn relative to the start of the current segment, using their offset
    for (const child of segment.children) {
      // Cast child to the correct type if necessary, assuming children are of the same compatible type
      // The interface SegmentForInterpreter202505280000 already defines the necessary properties.
      const childSegment = child as SegmentForInterpreter202505280000;

      // 1. Move from parent's end to child's start point (relative to parent's start)
      // Parent's length is segment.length. Child's offset is childSegment.offset.
      // The distance from parent's end back to child's start is segment.length - childSegment.offset.
      // So, move turtle backward by this amount.
      this.turtle.forward(-(segment.length - childSegment.offset));

      // 2. Interpret the child segment.
      // This will involve its own angle turn and forward movement for its length.
      this.interpret(childSegment);

      // 3. Return turtle to the end of the parent segment.
      // After child.interpret() finishes, turtle is at the end of the child.
      // We need to move it back to where it was before drawing this specific child,
      // which is the end of the parent segment.
      // This is the reverse of the movement in step 1.
      this.turtle.forward(segment.length - childSegment.offset);
    }
    this.turtle.popState();
  }
}
