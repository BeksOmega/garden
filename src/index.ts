/**
 * @license
 * Copyright 2022 Beka Westberg
 * SPDX-License-Identifier: MIT
 */


import * as p5 from 'p5'

const sketch = (p: p5) => {
  const width = 700;
  const height = 410;

  p.setup = function() {
    p.createCanvas(width, height);
  }

  p.draw = function() {
    p.background(0);
    p.fill(0, 255, 0);
    p.stroke(0, 255, 0);
    p.strokeWeight(4);
  };
};

new p5(sketch);
