/**
 * @license
 * Copyright 2025 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import { Segment } from "./segment";

export class Segment202505271035 extends Segment {
  children: Segment202505271035[] = [];

  /**
   * @param length The length of the segment in pixels.
   * @param angle The angle to turn left by before drawing the segment in degrees.
   */
  constructor(
    public length: number,
    public angle: number
  ) {
    super();
  }

  duplicate(): this {
    const result = new Segment202505271035(this.length, this.angle);
    return result as this;
  }
}
