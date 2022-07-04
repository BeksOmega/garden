/**
 * @license
 * Copyright 2022 Beka Westberg
 * SPDX-License-Identifier: MIT
 */


import * as p5 from 'p5'
import { LSystem } from './l-system';
import { createSig } from './sigmoid';
import { Turtle } from './turtle';

const sketch = (p) => {

  const heightCalc = createSig({minY: 300, maxY: 100, steepness: 4, midX: .4});
  const maxes = [
    heightCalc(Math.random()),
    heightCalc(Math.random()),
    heightCalc(Math.random())
  ];
  const flowers = [
    new LSystem(maxes[0]),
    new LSystem(maxes[1]),
    new LSystem(maxes[2])
  ];
  const positions = [
    {x: 250, y: 410, d: 270},
    {x: 350, y: 410, d: 270},
    {x: 450, y: 410, d: 270}
  ]
  const turtles = [
    new Turtle(p, maxes[0]),
    new Turtle(p, maxes[1]),
    new Turtle(p, maxes[2]),
  ];

  p.setup = function() {
    p.createCanvas(700, 410);
  }

  p.draw = function() {
    p.background(0);
    p.stroke(0, 255, 0);
    p.strokeWeight(4);
    for (let i = 0; i < flowers.length; i++) {
      turtles[i].draw(flowers[i].iterate(), positions[i]);
    }
  };
};

new p5(sketch);
