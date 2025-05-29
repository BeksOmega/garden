/**
 * @license
 * Copyright 2022 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import "./styles.css";
import * as p5 from "p5";
import { Segment202505280000 as Segment } from "./segments/segment-202505280000";
import { Producer202505281127 as Producer } from "./producers/producer-202505281127";
import { Interpreter202505280000 as Interpreter } from "./interpreters/interpreter-202505280000";
import { Turtle } from "./turtle/turtle";
import { Random } from "./utils/randomness";

const NUM_ROWS = 5;
const NUM_COLS = 5;
const systems: Segment[][] = [];
const producers: Producer<Segment>[][] = [];
const randoms: Random[][] = []; // For production drawing
const productionCounts: number[][] = [];
const MAX_PRODUCTIONS = 100;

function generateRandomSeed(): string {
  return Math.floor(Math.random() * 10000).toString();
}

function updateRow(rowIndex: number, mutationSeed: string) {
  if (!productionCounts[rowIndex]) productionCounts[rowIndex] = [];
  for (let c = 0; c < NUM_COLS; c++) {
    productionCounts[rowIndex][c] = 0;
    loadSketch(
      rowIndex,
      c,
      mutationSeed,
      (document.getElementById(`production-seed-col-${c}`) as HTMLInputElement)
        .value
    );
  }
}

function updateColumn(colIndex: number, productionSeed: string) {
  for (let r = 0; r < NUM_ROWS; r++) {
    if (!productionCounts[r]) productionCounts[r] = [];
    productionCounts[r][colIndex] = 0;
    loadSketch(
      r,
      colIndex,
      (document.getElementById(`mutation-seed-row-${r}`) as HTMLInputElement)
        .value,
      productionSeed
    );
  }
}

function handleRefreshClick(targetId: string) {
  const input = document.getElementById(targetId) as HTMLInputElement;
  if (!input) return;

  const newSeed = generateRandomSeed();
  input.value = newSeed;

  // Determine if this is a row or column seed
  if (targetId.startsWith("mutation-seed-row-")) {
    const rowIndex = parseInt(targetId.split("-").pop() || "0");
    updateRow(rowIndex, newSeed);
  } else if (targetId.startsWith("production-seed-col-")) {
    console.log("production-seed-col-", targetId);
    const colIndex = parseInt(targetId.split("-").pop() || "0");
    updateColumn(colIndex, newSeed);
  }
}

function loadSketch(
  rowIndex: number,
  colIndex: number,
  mutationSeedForRow: string,
  productionSeedForColumn: string
) {
  if (!producers[rowIndex]) producers[rowIndex] = [];
  if (!randoms[rowIndex]) randoms[rowIndex] = [];
  if (!systems[rowIndex]) systems[rowIndex] = [];
  if (!productionCounts[rowIndex]) productionCounts[rowIndex] = [];

  producers[rowIndex][colIndex] = new Producer(Segment);
  producers[rowIndex][colIndex].mutate(new Random(mutationSeedForRow));
  randoms[rowIndex][colIndex] = new Random(productionSeedForColumn);
  systems[rowIndex][colIndex] = new Segment(20, 0, 0, 0, 0); // Default segment
  productionCounts[rowIndex][colIndex] = 0;

  const procDefTextArea = document.getElementById(
    `procedure-def-${rowIndex}-${colIndex}`
  ) as HTMLTextAreaElement;
  if (procDefTextArea) {
    procDefTextArea.value = producers[rowIndex][colIndex].saveString();
  }
}

function initializeOrUpdateAllSketches() {
  const mutationSeeds: string[] = [];
  for (let i = 0; i < NUM_ROWS; i++) {
    const seedInput = document.getElementById(
      `mutation-seed-row-${i}`
    ) as HTMLInputElement;
    mutationSeeds.push(seedInput?.value || (1000 + i).toString());
  }

  const productionSeeds: string[] = [];
  for (let i = 0; i < NUM_COLS; i++) {
    const seedInput = document.getElementById(
      `production-seed-col-${i}`
    ) as HTMLInputElement;
    productionSeeds.push(seedInput?.value || (2000 + i).toString());
  }

  if (systems.length === 0) {
    for (let r = 0; r < NUM_ROWS; r++) {
      systems[r] = [];
      producers[r] = [];
      randoms[r] = [];
      productionCounts[r] = [];
    }
  }

  for (let r = 0; r < NUM_ROWS; r++) {
    for (let c = 0; c < NUM_COLS; c++) {
      loadSketch(r, c, mutationSeeds[r], productionSeeds[c]);
    }
  }
}

const createSketch = (rowIndex: number, colIndex: number) => (p: p5) => {
  const width = 150; // Adjusted for smaller grid cells
  const height = 150; // Adjusted for smaller grid cells
  let turtle: Turtle;
  let interpreter: Interpreter;

  p.setup = function () {
    p.createCanvas(width, height);
    turtle = new Turtle(p);
    interpreter = new Interpreter(turtle);
    turtle.setPosition(width / 2, height); // Or adjust as needed
    turtle.left(90);
    p.frameRate(10); // Adjusted frame rate
  };

  p.draw = function () {
    if (
      !producers[rowIndex] ||
      !producers[rowIndex][colIndex] ||
      !systems[rowIndex] ||
      !systems[rowIndex][colIndex] ||
      !randoms[rowIndex] ||
      !randoms[rowIndex][colIndex]
    ) {
      // Data not yet loaded
      p.background(100); // Placeholder background
      return;
    }
    const producer = producers[rowIndex][colIndex];
    let system = systems[rowIndex][colIndex];
    const rgen = randoms[rowIndex][colIndex];

    p.background(0);
    p.fill(0, 255, 0);
    p.stroke(0, 255, 0);

    if (productionCounts[rowIndex][colIndex] < MAX_PRODUCTIONS) {
      system = producer.produce(system, rgen);
      systems[rowIndex][colIndex] = system; // Update the system in the global array
      productionCounts[rowIndex][colIndex]++;
    }
    interpreter.interpret(system);
    if (rowIndex === 0 && colIndex === 1) {
      // console.log(system); // Example logging
    }
  };
};

// Initialize and create p5 instances for the grid
for (let r = 0; r < NUM_ROWS; r++) {
  // Initialize inner arrays if not already done by initializeOrUpdateAllSketches
  if (!systems[r]) systems[r] = [];
  if (!producers[r]) producers[r] = [];
  if (!randoms[r]) randoms[r] = [];
  if (!productionCounts[r]) productionCounts[r] = [];

  for (let c = 0; c < NUM_COLS; c++) {
    const sketchInstance = document.getElementById(`p5-canvas-${r}-${c}`);
    if (sketchInstance) {
      new p5(createSketch(r, c), sketchInstance);
    }
  }
}

// Add click handlers for refresh buttons
document.querySelectorAll(".refresh-btn").forEach((button) => {
  button.addEventListener("click", (e) => {
    const targetId = (e.currentTarget as HTMLElement).getAttribute(
      "data-target"
    );
    if (targetId) {
      handleRefreshClick(targetId);
    }
  });
});

const generateAllBtn = document.getElementById("generate-all-sketches");
if (generateAllBtn) {
  generateAllBtn.addEventListener("click", initializeOrUpdateAllSketches);
}

// Initial setup of all sketches
initializeOrUpdateAllSketches();
