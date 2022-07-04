/**
 * @license
 * Copyright 2022 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import * as p5 from 'p5';
import {createSig, sig} from './sigmoid';
import {Turtle} from './turtle';


export interface Segment {
  identifier: string;
  replace: () => Segment[];
  draw: (t: Turtle) => void;
}

export class Sunflower {
  private readonly maxAge = sig(
      Math.random(),{minY: 300, maxY: 100, steepness: 4, midX: .4} );

  private sys: Segment[] = [new ApicalMeristem(this.maxAge)];

  private readonly turtle: Turtle;

  constructor(private readonly x: number, private readonly y: number, p: p5) {
    this.turtle = new Turtle(p);
  }

  iterate(): Segment[] {
    return this.sys = this.sys.flatMap(seg => seg.replace())
  }

  draw() {
    this.turtle.setPosition(this.x, this.y, 270);
    this.sys.forEach(seg => seg.draw(this.turtle));
  }
}

export class ApicalMeristem implements Segment {
  static identifier = 'ApicalMeristem';
  identifier = 'ApicalMeristem';

  private age = 0;
  private prevBirth = 0;
  private leafCount = 0;

  private readonly stemHeight;

  constructor(private readonly maxAge: number) {
    this.stemHeight = createSig({maxY: maxAge, steepness: .02, midX: 170}); 
  }

  replace(): Segment[] {
    if (this.age > this.maxAge) return [];
    if (Math.random() < this.leafProbability()) return this.createLeaves();
    this.age++;
    return [this];
  }

  draw(t: Turtle) {
    t.forward(this.length());
  }

  private createLeaves(): Segment[] {
    const stem = new Stem(this.length());
    this.prevBirth = this.age;
    this.age++;

    return [
      stem,
      new Leaf(++this.leafCount),
      new Leaf(++this.leafCount),
      this
    ];
  }

  private leafProbability(): number {
    return sig(
        (this.age - this.prevBirth) / 20,
        {minY: -.1, maxY: 1, steepness: 4, midX: 1.2});
  }

  private length(): number {
    return this.stemHeight(this.age) - this.stemHeight(this.prevBirth);
  }
}

export class Stem implements Segment {
  static identifier = 'Stem';
  identifier = 'Stem';

  constructor(private readonly length: number) {}

  replace(): Segment[] {
    return [this];
  }

  draw(t: Turtle) {
    t.forward(this.length);
  }
}

export class Leaf implements Segment {
  static identifier = 'Leaf';
  identifier = 'Leaf';

  private age = 0;
  private readonly maxLen;

  constructor(public readonly number: number) {
    this.maxLen =
        sig(Math.random(), {minY: 15, maxY: 15, steepness: 6.5, midX: .5});
  }

  replace(): Segment[] {
    this.age++;
    return [this];
  }

  draw(t: Turtle) {
    t.pushPosition();
    if (this.number % 2 == 0) {
      t.left(45);
    } else {
      t.right(45);
    }
    t.forward(sig(this.age, {maxY: this.maxLen, steepness: .4, midX: 10}))
    t.popPosition();
  }
}
