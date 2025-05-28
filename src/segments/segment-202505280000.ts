/**
 * @license
 * Copyright 2025 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import { Segment } from "./segment";

export class Segment202505280000 extends Segment {
  children: Segment202505280000[] = [];

  /**
   * @param length The length of the segment in pixels.
   * @param angle The angle to turn left by before drawing the segment in degrees.
   *   @param stage The stage of the segment.
   * @param age The age of the segment.
   * @param offset The offset of this segment from the start of its parent.
   */
  constructor(
    public length: number,
    public angle: number,
    public readonly stage: number,
    public age: number,
    public offset: number,
  ) {
    super();
  }

  duplicate(): this {
    const result = new Segment202505280000(
      this.length,
      this.angle,
      this.stage,
      this.age,
      this.offset,
    );
    // Should children be duplicated here?
    // Based on Segment202505271310, children are not duplicated in `duplicate()`.
    // They are handled by the producer instead.
    return result as this;
  }
}
