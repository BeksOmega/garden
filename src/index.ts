/**
 * @license
 * Copyright 2022 Beka Westberg
 * SPDX-License-Identifier: MIT
 */


import * as p5 from 'p5'
import { LSystem } from './l-system';
import { Turtle } from './turtle';

const sketch = (p) => {
  let sys = '';
  
  const lSystem = new LSystem();

  const turtle = new Turtle(p);

  p.setup = function() {
    p.createCanvas(700, 410);
  }

  p.draw = function() {
    p.background(0);
    p.stroke(0, 255, 0);
    p.strokeWeight(4);
    const sys = lSystem.iterate();
    turtle.draw(sys);
  };
};

new p5(sketch);
