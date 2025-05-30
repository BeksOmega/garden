/**
 * @license
 * Copyright 2025 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import { Segment } from "../segments/segment";
import { Producer } from "./producer";
import { Linear } from "../functions/linear";
import { Clamp } from "../functions/clamp";
import { Product } from "../functions/product";
import { Constant as C } from "../mods/constant";
import { Clamped as Cl } from "../mods/clamped";
import { Random } from "../utils/randomness";
import { Piece, Piecewise, Range } from "../functions/piecewise";
import { Point } from "../turtle/turtle";

export interface Segment202505291659 extends Segment {
  length: number;
  width: number;
  // spline: Point[];
  age: number;
}

export interface Segment202505291659Constructor<S extends Segment202505291659> {
  new (length: number, width: number, spline: Point[], age: number): S;
}

export class Producer202505291659<
  S extends Segment202505291659,
> extends Producer<S> {
  private readonly modifyAge = new Clamp(
    new C(0),
    new C(1),
    new Linear(new Cl(1, 1, 2), new Cl(0.1, 0.01, 0.5))
  );
  private readonly modifyLength = new Linear(
    new Cl(80, 0, 100),
    new C(0),
    new Clamp(new C(0), new C(1))
  );
  private readonly modifyWidth = new Linear(
    new Cl(20, 10, 30),
    new C(0),
    new Clamp(new C(0), new C(1))
  );

  // private readonly spline = [
  //   { x: 0.2, y: 0 },
  //   { x: 1, y: 0.25 },
  //   { x: 0.5, y: 0.5 },
  //   { x: 1, y: 0.75 },
  //   { x: 0, y: 0.1 },
  // ];

  constructor(
    public readonly segmentConstructor: Segment202505291659Constructor<S>
  ) {
    super();
  }

  produce(segment: S, rand?: Random): S {
    const newSegment = segment.duplicate();
    newSegment.age = this.modifyAge.eval(segment.age);
    // newSegment.length =
    //   this.modifyLength.eval(segment.age) * (1 - segment.stage);
    newSegment.length = this.modifyLength.eval(segment.age);
    newSegment.width = this.modifyWidth.eval(segment.age);

    return newSegment;
  }

  mutate(random: Random): void {
    this.modifyAge.mutate(random);
    this.modifyLength.mutate(random);
    this.modifyWidth.mutate(random);
  }

  save(): Record<string, any> {
    return {
      modifyAge: this.modifyAge.save(),
      modifyLength: this.modifyLength.save(),
      modifyWidth: this.modifyWidth.save(),
    };
  }

  load(data: Record<string, any>) {
    this.modifyAge.load(data.modifyAge);
    this.modifyLength.load(data.modifyLength);
    this.modifyWidth.load(data.modifyWidth);
  }
}
