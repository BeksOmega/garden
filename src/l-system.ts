/**
 * @license
 * Copyright 2022 Beka Westberg
 * SPDX-License-Identifier: MIT
 */



export interface Segment {
  identifier: string;
}

type Production = (Segment) => Segment[];

export class LSystem {
  private sys: Segment[] = [];

  private productions: Map<string, Production> = new Map();

  constructor() {
    this.sys = [new ApicalMeristem()];
  }

  iterate(): Segment[] {
    return this.sys = this.sys.flatMap(
      seg => this.productions.get(seg.identifier) ?
          this.productions.get(seg.identifier)(seg) :
          [seg])
  }

}

export class ApicalMeristem implements Segment {
  static identifier = 'ApicalMeristem';
  identifier = 'ApicalMeristem';

  age = 0;
}

export class Stem implements Segment {
  identifier = 'Stem';

  age = 0;
}

export class Leaf implements Segment {
  identifier = 'Leaf';

  age = 0;
}
