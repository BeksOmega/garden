/**
 * @license
 * Copyright 2022 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import * as p5 from 'p5';
import {Segment, ApicalMeristem} from './l-system';


type Drawer = (Segment) => void;

export class Turtle {
  x = 0;

  y = 0;

  d = 0;

  step = 20;

  productions: Map<string, Drawer> = new Map();

  constructor(private readonly p: p5) {
    this.productions.set(ApicalMeristem.identifier, (s: Segment) => {
      const x1 = this.x + this.step * this.p.cos(this.p.radians(this.d));
      const y1 = this.y + this.step * this.p.sin(this.p.radians(this.d));
      this.p.line(this.x, this.y, x1, y1);
      this.x = x1;
      this.y = y1;
    });
  }

  draw(segs: Segment[]) {
    this.reset();

    segs.forEach(seg => {
      if (this.productions.get(seg.identifier)) {
        this.productions.get(seg.identifier)(seg);
      }
    })
  }

  reset() {
    this.y = this.p.height - 1;
    this.x = this.p.width / 2;
    this.d = 270;
  }
}