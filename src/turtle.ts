/**
 * @license
 * Copyright 2022 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import * as p5 from "p5";

let x = 10;
let y = 410;
let heading = 0;

const rules = new Map();
const step = 20;
const angle = 90;

export function interpret(commands: string, p: p5) {
  x = 10;
  y = 410;
  heading = 0;

  for (const char of commands) {
    if (rules.get(char)) {
      rules.get(char)(p);
    }
  }
}

rules.set('F', (p: p5) => {
  const x1 = x + step * p.cos(p.radians(heading));
  const y1 = y + step * p.sin(p.radians(heading));
  p.line(x, y, x1, y1);
  x = x1;
  y = y1;
})

rules.set('+', () => { heading += angle; })

rules.set('-', () => { heading -= angle; })