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

    this.productions.set(ApicalMeristem.identifier, (s: Segment) => {
      const a = s as ApicalMeristem;
      if (a.age > 0 && a.age % 20 == 0) {
        const stem = new Stem(a.prevBirth, a.age + 1);
        const leaf = new Leaf(a.age / 20);

        a.prevBirth = a.age;
        a.age++;

        return [stem, leaf, a];
      } else {
        a.age++;
        return [a];
      }
    });

    this.productions.set(Leaf.identifier, (s: Segment) => {
      const l = s as Leaf;
      l.age++;
      return [l];
    })
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
  prevBirth = 0;
}

export class Stem implements Segment {
  static identifier = 'Stem';
  identifier = 'Stem';

  constructor(public readonly birth: number, public readonly death: number) {}
}

export class Leaf implements Segment {
  static identifier = 'Leaf';
  identifier = 'Leaf';

  age = 0;

  constructor(public readonly number: number) {}
}
