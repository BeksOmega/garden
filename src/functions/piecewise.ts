/**
 * @license
 * Copyright 2025 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import { Func } from "./function";
import { Random } from "../utils/randomness";
import { Linear } from "./linear";
import { Constant as C } from "../mods/constant";

export class Range {
  constructor(
    public readonly min: number,
    public readonly max: number
  ) {}

  has(x: number): boolean {
    return x >= this.min && x <= this.max;
  }
}

export class Piece {
  constructor(
    public readonly range: Range,
    public readonly fn: Func
  ) {}
}

export class Piecewise implements Func {
  // We use a linear for the default to make sure that we don't get stuck
  // looping on a value.
  constructor(
    public readonly pieces: Piece[],
    public readonly defaultFn: Func = new Linear(new C(1), new C(0.01))
  ) {}

  eval(x: number): number {
    const piece = this.pieces.find((piece) => piece.range.has(x));
    if (!piece) {
      return x;
    }
    return piece.fn.eval(x);
  }

  mutate(random: Random): void {
    this.pieces.forEach((piece) => piece.fn.mutate(random));
    this.defaultFn.mutate(random);
  }

  save(): Record<string, any> | undefined {
    const piecesData = this.pieces.map((piece) => ({
      range: piece.range,
      fn: piece.fn.save(),
    }));
    const defaultFnData = this.defaultFn.save();

    if (
      piecesData.every((piece) => piece.fn === undefined) &&
      defaultFnData === undefined
    ) {
      return undefined;
    }
    return {
      pieces: piecesData,
      defaultFn: defaultFnData,
    };
  }

  load(data: Record<string, any> | undefined): void {
    if (!data) return;
    this.pieces.forEach((piece, i) => piece.fn.load(data.pieces[i].fn));
    this.defaultFn.load(data.defaultFn);
  }
}
