/**
 * @license
 * Copyright 2022 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import * as p5 from "p5";
import { Segment202505271310 as Segment } from "./segments/segment-202505271310";
import { Producer202505271720 as Producer } from "./producers/producer-202505271720";
import { Interpreter202505271211 as Interpreter } from "./interpreters/interpreter-202505271211";
import { Turtle } from "./turtle/turtle";

const sketch2 = (p: p5) => {
  const width = 700;
  const height = 410;
  const turtle = new Turtle(p);
  let system = new Segment(20, 0, 0, 0);
  const producer = new Producer(Segment);
  const interpreter = new Interpreter(turtle);

  p.setup = function () {
    p.createCanvas(width, height);
    turtle.setPosition(width / 2, height);
    turtle.left(90);
  };

  p.draw = function () {
    p.background(0);
    p.fill(0, 255, 0);
    p.stroke(0, 255, 0);
    system = producer.produce(system);
    interpreter.interpret(system);
  };

  p.frameRate(30);
};

new p5(sketch2, document.getElementById("p5-canvas"));

document.getElementById("btn1")?.addEventListener("click", () => {
  (document.getElementById("seed") as HTMLInputElement).value = Math.floor(
    Math.random() * 1000000000
  ).toString();
});
