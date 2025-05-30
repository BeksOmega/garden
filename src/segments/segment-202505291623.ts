/**
 * @license
 * Copyright 2025 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import { Point } from "../turtle/turtle";
import { Segment } from "./segment";

export class Segment202505291623 extends Segment {
  children: Segment202505291623[] = [];

  /**
   * @param length The length of the segment in pixels.
   * @param angle The angle to turn left by before drawing the segment in degrees.
   *   @param stage The stage of the segment.
   * @param age The age of the segment.
   * @param offset The offset of this segment from the start of its parent.
   */
  constructor(
    public length: number,
    public width: number,
    public spline: Point[],
    public age: number
  ) {
    super();
  }

  duplicate(): this {
    const result = new Segment202505291623(
      this.length,
      this.width,
      this.spline.map((p) => ({ x: p.x, y: p.y })),
      this.age
    );
    return result as this;
  }
}
