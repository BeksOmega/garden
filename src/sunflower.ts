/**
 * @license
 * Copyright 2022 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import * as p5 from 'p5';
import {createSig, sig} from './sigmoid';
import {bell} from './bell';
import {Turtle} from './turtle';


interface Segment {
  identifier: string;
  replace: () => Segment[];
  draw: (t: Turtle) => void;
}

export class Sunflower {
  private readonly maxAge = sig(
      Math.random(),{minY: 280, maxY: 100, steepness: 4, midX: .4} );

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
    this.turtle.setColour(0, 255, 0);
    this.sys.forEach(seg => seg.draw(this.turtle));
  }
}

class ApicalMeristem implements Segment {
  static identifier = 'ApicalMeristem';
  identifier = 'ApicalMeristem';

  private age = 0;
  private prevBirth = 0;
  private leafCount = 0;

  private readonly stemHeight;

  constructor(private readonly maxAge: number) {
    this.stemHeight = createSig(
        {maxY: maxAge, steepness: .015, midX: maxAge / 3 * 2}); 
  }

  replace(): Segment[] {
    //if (this.age > this.maxAge) return [new Sepal()];
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

class Stem implements Segment {
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

class Leaf implements Segment {
  static identifier = 'Leaf';
  identifier = 'Leaf';

  private age = 0;
  private readonly maxLen;

  constructor(public readonly number: number) {
    this.maxLen = bell(30, 9, 10, number/2) + (Math.random() - 1) * 8;
    // this.maxLen =
    //     sig(Math.random(), {minY: 15, maxY: 15, steepness: 6.5, midX: .5});
  }

  replace(): Segment[] {
    this.age++;
    return [this];
  }

  draw(t: Turtle) {
    t.pushState();
    if (this.number % 2 == 0) {
      t.left(45);
    } else {
      t.right(45);
    }
    t.forward(sig(this.age, {maxY: this.maxLen, steepness: .4, midX: 10}))
    t.popState();
  }
}

class Sepal implements Segment {
  identifier = "Sepal";

  private age = 0;

  replace(): Segment[] {
    if (this.age > 10) return [this];
    if (this.age === 5) {
      this.age++;
      return [this, new Petal(this.age - 1)];
    }
    this.age++;
    return [this];
  }

  draw(t: Turtle) {
    t.pushState();
    t.setPosition(t.x, t.y - this.radius(this.age) - 5);
    t.circle(this.radius(this.age));
    t.popState();
  }

  radius(x): number {
    return sig(this.age, {minY: -.3, maxY: 10.6, steepness: .7, midX: 5})
  }
}

class Petal implements Segment {
  identifier = "Petal";

  private age = 0;

  constructor(private sepalAge: number) {}

  replace(): Segment[] {
    if (this.age > 20) return [this];
    if (this.age === 10)  {
      this.age++;
      this.sepalAge++;
      return [this, new Seeds(this.age)];
    }
    this.age++;
    this.sepalAge++;
    return [this];
  }

  draw(t: Turtle) {
    t.pushState();
    t.setColour(255, 255, 0);
    t.setPosition(
        t.x,
        t.y - this.sepalRadius(this.sepalAge) - this.radius(this.age) - 5);
    t.circle(this.age);
    t.popState();
  }

  sepalRadius(x): number {
    return sig(x, {minY: -.3, maxY: 10.6, steepness: .7, midX: 5})
  }

  radius(x): number {
    return sig(x, {maxY: 20, steepness: .4, midX: 10})
  }
}

class Seeds implements Segment {
  identifier = "Petal";

  private age = 0;

  constructor(private petalAge: number) {}

  replace(): Segment[] {
    if (this.age > 10) return [this];
    this.age++;
    this.petalAge++;
    return [this];
  }

  draw(t: Turtle) {
    t.pushState();
    t.setColour(120, 90, 10);
    t.setPosition(
        t.x,
        t.y - this.petalRadius(this.petalAge) - this.radius(this.age) - 5);
    t.circle(this.age);
    t.popState();
  }

  petalRadius(x): number {
    return sig(x, {maxY: 20, steepness: .4, midX: 10})
  }

  radius(x): number {
    return sig(x, {minY: -.3, maxY: 10.6, steepness: .7, midX: 5})
  }
}