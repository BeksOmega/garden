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
const producers: Producer[] = [];

// Modified loadSeed function to handle specific sketch instances
function loadSeed(seed: string, sketchIndex: number) {
  if (sketchIndex < 0 || sketchIndex >= NUM_SKETCHES) {
    console.error(`Invalid sketchIndex: ${sketchIndex}`);
    return;
  }
  systems[sketchIndex] = new Segment(20, 0, 0, 0, 0); // Initial segment for this sketch
  producers[sketchIndex] = new Producer(Segment);
  producers[sketchIndex].mutate(new Random(seed));

  const procDefTextArea = document.getElementById(`procedure-def-${sketchIndex}`) as HTMLTextAreaElement;
  if (procDefTextArea) {
    procDefTextArea.value = producers[sketchIndex].saveString();
  }

  const seedInput = document.getElementById(`seed-${sketchIndex}`) as HTMLInputElement;
  if (seedInput && seedInput.value !== seed) {
    seedInput.value = seed;
  }
}

// Function factory to create sketch functions for each p5 instance
const createSketch = (sketchIndex: number) => (p: p5) => {
  const width = 350; // Adjusted for grid display
  const height = 200; // Adjusted for grid display
  let turtle: Turtle;
  let interpreter: Interpreter;

  p.setup = function () {
    p.createCanvas(width, height);
    turtle = new Turtle(p);
    interpreter = new Interpreter(turtle);
    turtle.setPosition(width / 2, height); // Set initial turtle position
    turtle.left(90);
    p.frameRate(30);
  };

  p.draw = function () {
    if (!systems[sketchIndex] || !producers[sketchIndex] || !interpreter) {
      // Ensure instances are initialized, especially after a "Load struct"
      if (producers[sketchIndex] && !systems[sketchIndex]) {
         systems[sketchIndex] = new Segment(20,0,0,0,0);
      } else {
        // If producer is also missing, it might be an error or during initial setup
        // For now, we just skip draw if critical components are missing.
        // loadSeed should have initialized these.
        return;
      }
    }

    const currentSystem = systems[sketchIndex];
    const currentProducer = producers[sketchIndex];
    const currentInterpreter = interpreter; // Using local constant for consistency

    p.background(0);
    p.fill(0, 255, 0);
    p.stroke(0, 255, 0);
    systems[sketchIndex] = currentProducer.produce(currentSystem);
    currentInterpreter.interpret(systems[sketchIndex]);
  };
};

// Initialize and set up each sketch
for (let i = 0; i < NUM_SKETCHES; i++) {
  // Initialize system and producer for the sketch
  // Default seed for each sketch, can be made unique
  const initialSeed = (1234567891 + i).toString();
  
  // Initialize systems and producers arrays before calling loadSeed
  systems[i] = new Segment(20, 0, 0, 0, 0);
  producers[i] = new Producer(Segment);
  loadSeed(initialSeed, i); // This will also populate the seed input and proc def

  // Create and assign the p5 sketch instance
  const sketchInstance = document.getElementById(`p5-canvas-${i}`);
  if (sketchInstance) {
    new p5(createSketch(i), sketchInstance);
  }

  // Event Listeners for each sketch
  const btn1 = document.getElementById(`btn1-${i}`);
  if (btn1) {
    btn1.addEventListener("click", () => {
      const newSeed = Math.floor(Math.random() * 1000000000).toString();
      // The seed input will be updated by loadSeed
      loadSeed(newSeed, i);
    });
  }

  const btn2 = document.getElementById(`btn2-${i}`);
  if (btn2) {
    btn2.addEventListener("click", () => {
      const seedInput = document.getElementById(`seed-${i}`) as HTMLInputElement;
      if (seedInput) {
        loadSeed(seedInput.value, i);
      }
    });
  }

  const btn3 = document.getElementById(`btn3-${i}`);
  if (btn3) {
    btn3.addEventListener("click", () => {
      const procDefTextArea = document.getElementById(`procedure-def-${i}`) as HTMLTextAreaElement;
      if (procDefTextArea) {
        try {
          const struct = JSON.parse(procDefTextArea.value);
          systems[i] = new Segment(20, 0, 0, 0, 0); // Reset system
          producers[i] = new Producer(Segment); // Reset producer
          producers[i].load(struct);
        } catch (e) {
          console.error(`Error parsing JSON for sketch ${i}:`, e);
          alert(`Error parsing JSON for sketch ${i}. Check console for details.`);
        }
      }
    });
  }
}
