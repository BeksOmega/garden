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

const NUM_SKETCHES = 10;
const systems: Segment[] = [];
const producers: Producer<Segment>[] = [];
const randoms: Random[] = [];

function loadSeed(seed: string, sketchIndex: number) {
  if (sketchIndex < 0 || sketchIndex >= NUM_SKETCHES) {
    console.error(`Invalid sketchIndex: ${sketchIndex}`);
    return;
  }
  systems[sketchIndex] = new Segment(20, 0, 0, 0, 0);
  producers[sketchIndex] = new Producer(Segment);
  randoms[sketchIndex] = new Random(seed);
  if (sketchIndex > 0) {
    producers[sketchIndex].mutate(new Random(seed));
  }

  const procDefTextArea = document.getElementById(
    `procedure-def-${sketchIndex}`
  ) as HTMLTextAreaElement;
  if (procDefTextArea) {
    procDefTextArea.value = producers[sketchIndex].saveString();
  }

  const seedInput = document.getElementById(
    `seed-${sketchIndex}`
  ) as HTMLInputElement;
  if (seedInput && seedInput.value !== seed) {
    seedInput.value = seed;
  }
}

const createSketch = (sketchIndex: number) => (p: p5) => {
  const width = 350;
  const height = 200;
  let turtle: Turtle;
  let interpreter: Interpreter;

  p.setup = function () {
    p.createCanvas(width, height);
    turtle = new Turtle(p);
    interpreter = new Interpreter(turtle);
    turtle.setPosition(width / 2, height);
    turtle.left(90);
    p.frameRate(30);
  };

  p.draw = function () {
    const producer = producers[sketchIndex];

    p.background(0);
    p.fill(0, 255, 0);
    p.stroke(0, 255, 0);
    systems[sketchIndex] = producer.produce(
      systems[sketchIndex],
      randoms[sketchIndex]
    );
    interpreter.interpret(systems[sketchIndex]);
  };
};

for (let i = 0; i < NUM_SKETCHES; i++) {
  const initialSeed = (1234567891 + i).toString();

  systems[i] = new Segment(20, 0, 0, 0, 0);
  producers[i] = new Producer(Segment);
  loadSeed(initialSeed, i);

  const sketchInstance = document.getElementById(`p5-canvas-${i}`);
  if (sketchInstance) {
    new p5(createSketch(i), sketchInstance);
  }

  const btn1 = document.getElementById(`btn1-${i}`);
  if (btn1) {
    btn1.addEventListener("click", () => {
      const newSeed = Math.floor(Math.random() * 1000000000).toString();
      loadSeed(newSeed, i);
    });
  }

  const btn2 = document.getElementById(`btn2-${i}`);
  if (btn2) {
    btn2.addEventListener("click", () => {
      const seedInput = document.getElementById(
        `seed-${i}`
      ) as HTMLInputElement;
      if (seedInput) {
        loadSeed(seedInput.value, i);
      }
    });
  }

  const btn3 = document.getElementById(`btn3-${i}`);
  if (btn3) {
    btn3.addEventListener("click", () => {
      const procDefTextArea = document.getElementById(
        `procedure-def-${i}`
      ) as HTMLTextAreaElement;
      if (procDefTextArea) {
        try {
          const struct = JSON.parse(procDefTextArea.value);
          systems[i] = new Segment(20, 0, 0, 0, 0);
          producers[i] = new Producer(Segment);
          producers[i].load(struct);
        } catch (e) {
          console.error(`Error parsing JSON for sketch ${i}:`, e);
          alert(
            `Error parsing JSON for sketch ${i}. Check console for details.`
          );
        }
      }
    });
  }
}
