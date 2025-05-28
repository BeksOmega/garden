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

export interface Segment202505281127 extends Segment {
  length: number;
  angle: number;
  stage: number;
  age: number;
  offset: number;
  children: this[];
}

export interface Segment202505281127Constructor<S extends Segment202505281127> {
  new (
    length: number,
    angle: number,
    stage: number,
    age: number,
    offset: number
  ): S;
}

export class Producer202505281127<
  S extends Segment202505281127,
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
  private readonly newChildCount = new Product([
    // For age.
    new Piecewise([
      new Piece(new Range(0, 0.8), new Linear(new C(0), new C(0))),
      new Piece(new Range(0.8, 0.99), new Linear(new C(0), new C(3))),
      new Piece(new Range(0.99, 1), new Linear(new C(0), new C(0))),
    ]),
    // For stage.
    new Linear(new C(-1), new C(1)),
    // For random factor.
    new Piecewise([
      new Piece(new Range(0, 0.3), new Linear(new C(0), new C(0))),
      new Piece(
        new Range(0.3, 1),
        new Clamp(new C(0), new C(1), new Linear(new C(1), new C(0)))
      ),
    ]),
  ]);
  private readonly newChildStage = new Linear(
    new Cl(1, 1, 2),
    new Cl(0.1, 0.01, 0.5)
  );
  private readonly minAngle = new Cl(-45, -90, 0, 0.5);
  private readonly maxAngle = new Cl(45, 0, 90, 0.5);

  constructor(
    public readonly segmentConstructor: Segment202505281127Constructor<S>
  ) {
    super();
  }

  produce(segment: S, rand?: Random): S {
    const newSegment = segment.duplicate();
    newSegment.age = this.modifyAge.eval(segment.age);
    newSegment.length =
      this.modifyLength.eval(segment.age) * (1 - segment.stage);

    const newChildCount = Math.floor(
      this.newChildCount.eval([segment.age, segment.stage, rand?.float() ?? 0])
    );
    for (let i = 0; i < newChildCount; i++) {
      newSegment.children.push(
        new this.segmentConstructor(
          0, // Length
          this.getChildAngle(segment, i, newChildCount, rand),
          this.newChildStage.eval(segment.stage),
          0, // Age
          newSegment.length // Offset
        )
      );
    }
    const existingChildren = segment.children.map((child) =>
      this.produce(child, rand)
    );
    newSegment.children.push(...existingChildren);

    return newSegment;
  }

  private getChildAngle(
    segment: S,
    i: number,
    childCount: number,
    rand?: Random
  ): number {
    const range = this.maxAngle.val() - this.minAngle.val();
    const angle = this.minAngle.val() + (range / (childCount + 1)) * (i + 1);
    return angle + (rand?.int(-10, 10) ?? 0);
  }

  mutate(random: Random): void {
    this.modifyAge.mutate(random);
    this.modifyLength.mutate(random);
    this.newChildCount.mutate(random);
    this.newChildStage.mutate(random);
    this.minAngle.mutate(random);
    this.maxAngle.mutate(random);
  }

  save(): Record<string, any> {
    return {
      modifyAge: this.modifyAge.save(),
      modifyLength: this.modifyLength.save(),
      newChildCount: this.newChildCount.save(),
      newChildStage: this.newChildStage.save(),
      minAngle: this.minAngle.save(),
      maxAngle: this.maxAngle.save(),
    };
  }

  load(data: Record<string, any>) {
    this.modifyAge.load(data.modifyAge);
    this.modifyLength.load(data.modifyLength);
    this.newChildCount.load(data.newChildCount);
    this.newChildStage.load(data.newChildStage);
    this.minAngle.load(data.minAngle);
    this.maxAngle.load(data.maxAngle);
  }
}
