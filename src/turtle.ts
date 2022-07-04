/**
 * @license
 * Copyright 2022 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import * as p5 from 'p5';

interface Position {
  x: number;
  y: number;
  d: number;
}

export class Turtle {
  x = 0;

  y = 0;

  d = 0;

  positionStack: Position[] = [];

  constructor(private readonly p: p5) {}

  forward(dist: number) {
    const x1 = this.x + dist * this.p.cos(this.p.radians(this.d));
    const y1 = this.y + dist * this.p.sin(this.p.radians(this.d));
    this.p.line(this.x, this.y, x1, y1);
    this.x = x1;
    this.y = y1;
  }

  left(angle: number) {
    this.d -= angle;
  }

  right(angle: number) {
    this.d += angle;
  }

  setPosition(x = 0, y = 0, d = 0) {
    this.x = x;
    this.y = y;
    this.d = d;
  }

  pushPosition() {
    this.positionStack.push({x: this.x, y: this.y, d: this.d});
  }

  popPosition() {
    const pos = this.positionStack.pop();
    this.x = pos.x;
    this.y = pos.y;
    this.d = pos.d;
  }
}
