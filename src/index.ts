/**
 * @license
 * Copyright 2022 Beka Westberg
 * SPDX-License-Identifier: MIT
 */


import * as p5 from 'p5'
import { run } from './l-system';
import { interpret } from './turtle';

const sketch = (p) => {
  let sys = '';

  p.setup = function() {
    sys = run(0, 6);
    console.log(sys);
    p.createCanvas(700, 410);
  }

  p.draw = function() {
    p.background(0);
    p.stroke(255);
    interpret(sys, p);
  };
};

new p5(sketch);
