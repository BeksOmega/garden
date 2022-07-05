/**
 * @license
 * Copyright 2022 Beka Westberg
 * SPDX-License-Identifier: MIT
 */


import * as p5 from 'p5'
import {Sunflower} from './sunflower';

const sketch = (p) => {
  const width = 700;
  const height = 410;
  const flowers = []

  p.setup = function() {
    p.createCanvas(width, height);
    createFlowers(7)
  }

  p.draw = function() {
    p.background(0);
    p.fill(0, 255, 0);
    p.stroke(0, 255, 0);
    p.strokeWeight(4);
    for (const flower of flowers) {
      flower.iterate();
      flower.draw();
    }
  };

  function createFlowers(c: number) {
    const delta = width / (c + 1);
    for (let i = 0; i < c; i++) {
      flowers.push(new Sunflower(
        delta * (i + 1) + (Math.random() - 1) * delta / 3,
        height,
        p));
    }
  }
};

new p5(sketch);
