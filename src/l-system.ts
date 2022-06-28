/**
 * @license
 * Copyright 2022 Beka Westberg
 * SPDX-License-Identifier: MIT
 */


const sys = ['A'];
const rules = new Map();
rules.set('A', [...'-BF+AFA+FB-']);
rules.set('B', [...'+AF-BFB-FA+']);

export function run(seed: number, iterations: number): string {
  let newSys = [...sys];
  for (let i = 0; i < iterations; i++) {
    newSys = newSys.flatMap((char) => rules.get(char) || char);
  }
  return newSys.reduce((acc, cur) => acc + cur);
}
