/**
 * @license
 * Copyright 2022 Beka Westberg
 * SPDX-License-Identifier: MIT
 */


import * as p5 from 'p5'
import { Random } from './utils/randomness'

const sketch = (p: p5) => {
  const width = 700;
  const height = 410;

  p.setup = function() {
    p.createCanvas(width, height);
  }

  p.draw = function() {
    const seed = (document.getElementById('seed') as HTMLInputElement).value;
    const rand = new Random(seed);

    p.background(0);
    p.fill(0, 255, 0);
    for (let i = 0; i < 100; i++) {
      const x = rand.int(0, width);
      const y = rand.int(0, height);
      p.fill(...rand.color());
      p.ellipse(x, y, 20, 20);
    }
  };
};

new p5(sketch, document.getElementById('p5-canvas'));

document.getElementById('btn1')?.addEventListener('click', () => {
  (document.getElementById('seed') as HTMLInputElement).value = Math.floor(Math.random() * 1000000000).toString();
});