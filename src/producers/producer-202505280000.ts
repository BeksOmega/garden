/**
 * @license
 * Copyright 2025 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import { Segment as BaseSegment } from "../segments/segment";
import { Segment202505280000 as ActualSegmentClass } from '../segments/segment-202505280000';
import { Producer } from "./producer";
import { Linear } from "../functions/linear";
import { Power } from "../functions/power";
import { Clamp } from "../functions/clamp";
import { Constant as C } from "../mods/constant";
import { Clamped as Cl } from "../mods/clamped";
import { Random } from "../utils/randomness";

// This interface is for type consistency with how other producers are written,
// even if ActualSegmentClass could be used directly in some places.
export interface Segment202505280000 extends BaseSegment {
  length: number;
  angle: number;
  stage: number;
  age: number;
  offset: number; // Added offset
  children: this[];
}

export interface Segment202505280000Constructor<S extends Segment202505280000> {
  new (length: number, angle: number, stage: number, age: number, offset: number): S; // Added offset
}

export class Producer202505280000<
  S extends Segment202505280000,
> extends Producer<S> {
  // All these functions remain the same as Producer202505271720
  private readonly modifyAge = new Clamp(
    new C(0),
    new C(1),
    new Linear(new Cl(1, 1, 2), new Cl(0.2, 0.01, 0.5))
  );
  private readonly modifyLength = new Linear(
    new Cl(60, 0, 100),
    new C(0),
    new Clamp(new C(0), new C(1))
  );
  private readonly newChildCount = new Power(
    new Cl(-3.5, -10, -1),
    new Cl(0.4, 0, 1),
    new Cl(0.3, 0, 2),
    new Cl(3, 0, 10)
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
    // Use ActualSegmentClass for the constructor parameter type for clarity
    public readonly segmentConstructor: Segment202505280000Constructor<S & ActualSegmentClass>
  ) {
    super();
  }

  produce(segment: S): S {
    const newSegment = segment.duplicate() as S; // Ensure newSegment is of type S
    newSegment.age = this.modifyAge.eval(segment.age);
    newSegment.length = this.modifyLength.eval(segment.age - segment.stage);

    const newChildCount = this.newChildCount.eval(segment.stage + segment.age);
    for (let i = 0; i < newChildCount; i++) {
      newSegment.children.push(
        new this.segmentConstructor(
          0, // Initial length for new children
          this.newChildAngle.eval(i),
          this.newChildStage.eval(segment.stage),
          0, // Initial age for new children
          segment.length // *** Offset is parent's current length ***
        )
      );
    }
    // Recursively produce for existing children. Their offsets are preserved by their own duplicate() methods.
    const existingChildren = segment.children.map(child => this.produce(child as S));
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
