/**
 * @license
 * Copyright 2022 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import * as p5 from "p5";
import { Segment202505280000 as Segment } from "./segments/segment-202505280000";
import { Producer202505280000 as Producer } from "./producers/producer-202505280000";
import { Interpreter202505280000 as Interpreter } from "./interpreters/interpreter-202505280000";
import { Turtle } from "./turtle/turtle";
import { Random } from "./utils/randomness";

let system = new Segment(20, 0, 0, 0, 0); // Added offset 0
let producer = new Producer(Segment);

const sketch2 = (p: p5) => {
  const width = 700;
  const height = 410;
  const turtle = new Turtle(p);
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

  loadSeed((document.getElementById("seed") as HTMLInputElement).value);
});

document.getElementById("btn2")?.addEventListener("click", () => {
  loadSeed((document.getElementById("seed") as HTMLInputElement).value);
});

document.getElementById("btn3")?.addEventListener("click", () => {
  const struct = JSON.parse(
    (document.getElementById("procedure-def") as HTMLTextAreaElement).value
  );
  system = new Segment(0, 0, 0, 0, 0); // Added offset 0
  producer = new Producer(Segment);
  producer.load(struct);
});

function loadSeed(seed: string) {
  system = new Segment(0, 0, 0, 0, 0); // Added offset 0
  producer = new Producer(Segment);
  producer.mutate(new Random(seed));
  (document.getElementById("procedure-def") as HTMLTextAreaElement).value =
    producer.saveString();
}
