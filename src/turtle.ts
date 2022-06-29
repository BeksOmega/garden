/**
 * @license
 * Copyright 2022 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import * as p5 from 'p5';
import {Segment, Stem, Leaf, ApicalMeristem} from './l-system';


type Drawer = (Segment) => void;

interface Position {
  x: number;
  y: number;
  d: number;
}

export class Turtle {
  x = 0;

  y = 0;

  d = 0;

  step = 20;

  productions: Map<string, Drawer> = new Map();

  positionStack: Position[] = [];

  constructor(private readonly p: p5) {
    const stemHeight = createSig(380, .02, 170);

    this.productions.set(ApicalMeristem.identifier, (s: Segment) => {
      const a = s as ApicalMeristem;
      const length = stemHeight(a.age) - stemHeight(a.prevBirth);
      const x1 = this.x + length * this.p.cos(this.p.radians(this.d));
      const y1 = this.y + length * this.p.sin(this.p.radians(this.d));
      this.p.line(this.x, this.y, x1, y1);
      this.x = x1;
      this.y = y1;
    })

    this.productions.set(Stem.identifier, (s: Segment) => {
      const stem = s as Stem;
      const length = stemHeight(stem.death) - stemHeight(stem.birth);
      const x1 = this.x + length * this.p.cos(this.p.radians(this.d));
      const y1 = this.y + length * this.p.sin(this.p.radians(this.d));
      this.p.line(this.x, this.y, x1, y1);
      this.x = x1;
      this.y = y1;
    })

    this.productions.set(Leaf.identifier, (s: Segment) => {
      const l = s as Leaf;
      this.pushPosition();
      if (l.number % 2 == 0) {
        this.d += 45;
      } else {
        this.d -= 45;
      }
      const length = sig(20, .4, 10, l.age);
      const x1 = this.x + length * this.p.cos(this.p.radians(this.d));
      const y1 = this.y + length * this.p.sin(this.p.radians(this.d));
      this.p.line(this.x, this.y, x1, y1);
      this.x = x1;
      this.y = y1;
      this.popPosition();
    })
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

function createSig(maxY: number, steepness: number, midX: number) {
  return (x: number) => maxY / (1 + Math.exp(-1 * steepness * (x - midX)));
}

function sig(maxY: number, steepness: number, midX: number, x: number) {
  return createSig(maxY, steepness, midX)(x);
}