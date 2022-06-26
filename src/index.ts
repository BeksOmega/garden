/**
 * @license
 * Copyright 2022 Beka Westberg
 * SPDX-License-Identifier: MIT
 */


import * as p5 from 'p5'

const sketch = (p) => {
  p.setup = function() {
    p.createCanvas(700, 410);
  }

  p.draw = function() {
    p.background(0);
    p.fill(0);
    p.rect(100, 100, 50, 50);
  };
};

new p5(sketch);