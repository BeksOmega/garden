/**
 * @license
 * Copyright 2025 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import { Segment } from "../segments/segment";
import { Producer } from "./producer";
import { Linear } from "../functions/linear";
import { Power } from "../functions/power";
import { Clamp } from "../functions/clamp";
import { Constant as C } from "../mods/constant";
import { Clamped as Cl } from "../mods/clamped";
import { Random } from "../utils/randomness";

export interface Segment202505280000 extends Segment {
  length: number;
  angle: number;
  stage: number;
  age: number;
  offset: number;
  children: this[];
}

export interface Segment202505280000Constructor<S extends Segment202505280000> {
  new (
    length: number,
    angle: number,
    stage: number,
    age: number,
    offset: number
  ): S;
}

export class Producer202505280000<
  S extends Segment202505280000,
> extends Producer<S> {
  private readonly modifyAge = new Clamp(
    new C(0),
    new C(1),
    new Linear(new Cl(1, 1, 2), new Cl(0.25, 0.01, 0.5))
  );
  private readonly modifyLength = new Linear(
    new Cl(80, 0, 100),
    new C(0),
    new Clamp(new C(0), new C(1))
  );
  private readonly newChildCount = new Power(
    new Cl(-4.6, -10, -1),
    new Cl(0.75, 0, 1),
    new Cl(0.3, 0, 2),
    new Cl(3, 0, 10),
    new Clamp(new C(0), new C(1))
  );
  private readonly newChildStage = new Linear(
    new Cl(1, 1, 2),
    new Cl(0.2, 0.01, 0.5)
  );
  private readonly newChildAngle = new Linear(
    new Cl(-45, -90, 0),
    new Cl(45, 0, 90)
  );

  constructor(
    public readonly segmentConstructor: Segment202505280000Constructor<S>
  ) {
    super();
  }

  produce(segment: S, rand?: Random): S {
    const newSegment = segment.duplicate();
    newSegment.age = this.modifyAge.eval(segment.age);
    newSegment.length =
      this.modifyLength.eval(segment.age) * (1 - segment.stage);

    const newChildCount = Math.floor(
      this.newChildCount.eval(segment.age) * (1 - segment.stage)
    );
    for (let i = 0; i < newChildCount; i++) {
      newSegment.children.push(
        new this.segmentConstructor(
          0, // Length
          this.newChildAngle.eval(i) + (rand?.int(-20, 20) ?? 0),
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

  mutate(random: Random): void {
    this.modifyAge.mutate(random);
    this.modifyLength.mutate(random);
    this.newChildCount.mutate(random);
    this.newChildStage.mutate(random);
    this.newChildAngle.mutate(random);
  }

  save(): Record<string, any> {
    return {
      modifyAge: this.modifyAge.save(),
      modifyLength: this.modifyLength.save(),
      newChildCount: this.newChildCount.save(),
      newChildStage: this.newChildStage.save(),
      newChildAngle: this.newChildAngle.save(),
    };
  }

  load(data: Record<string, any>) {
    this.modifyAge.load(data.modifyAge);
    this.modifyLength.load(data.modifyLength);
    this.newChildCount.load(data.newChildCount);
    this.newChildStage.load(data.newChildStage);
    this.newChildAngle.load(data.newChildAngle);
  }
}
