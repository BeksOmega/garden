/**
 * @license
 * Copyright 2022 Beka Westberg
 * SPDX-License-Identifier: MIT
 */

import * as p5 from "p5";

interface State {
  x: number;
  y: number;
  d: number;
  r: number;
  g: number;
  b: number;
}

export interface Point {
  x: number;
  y: number;
}

export class Turtle {
  x = 0;
  y = 0;
  d = 0;

  r = 0;
  g = 0;
  b = 0;

  stateStack: State[] = [];

  constructor(private readonly p: p5) {}

  forward(dist: number) {
    const x1 = this.x + dist * this.p.cos(this.p.radians(this.d));
    const y1 = this.y + dist * this.p.sin(this.p.radians(this.d));
    this.p.line(this.x, this.y, x1, y1);
    this.x = x1;
    this.y = y1;
  }

  /**
   * Move the turtle forward by the given distance without drawing.
   */
  jumpForward(dist: number) {
    this.x += dist * this.p.cos(this.p.radians(this.d));
    this.y += dist * this.p.sin(this.p.radians(this.d));
  }

  /** Turn left by the given angle in degrees. */
  left(angle: number) {
    this.d -= angle;
  }

  /** Turn right by the given angle in degrees. */
  right(angle: number) {
    this.d += angle;
  }

  setPosition(x = null, y = null, d = null) {
    if (x !== null) this.x = x;
    if (y !== null) this.y = y;
    if (d !== null) this.d = d;
  }

  pushState() {
    this.stateStack.push({
      x: this.x,
      y: this.y,
      d: this.d,
      r: this.r,
      g: this.g,
      b: this.b,
    });
  }

  popState() {
    const state = this.stateStack.pop();
    this.x = state.x;
    this.y = state.y;
    this.d = state.d;
    this.r = state.r;
    this.g = state.g;
    this.b = state.b;
  }

  setColour(r, g, b) {
    this.p.fill(r, g, b);
    this.p.stroke(r, g, b);
  }

  circle(r: number) {
    this.p.circle(this.x, this.y, r * 2);
  }

  /**
   * Draws a shape using spline points relative to the turtle's position and direction.
   * Points are specified in turtle-relative coordinates where:
   * -x is left of turtle, +x is right of turtle
   * -y is behind turtle, +y is in front of turtle
   * The shape will be mirrored and rotated according to turtle's direction
   */
  shape(points: Point[]) {
    if (!points || points.length === 0) return;

    // Convert turtle direction to radians
    const angleRad = (this.d * Math.PI) / 180;

    // const x1 = this.x + dist * this.p.cos(this.p.radians(this.d));
    // const y1 = this.y + dist * this.p.sin(this.p.radians(this.d));

    const topPoint = points[points.length - 1];
    points = [
      ...points.slice(0, points.length),
      // Duplicate the top point if it's not on the y-axis.
      ...(topPoint.x !== 0 ? [{ x: -topPoint.x, y: topPoint.y }] : []),
      // Mirror the shape.
      ...points
        .slice(0, points.length - 1)
        .reverse()
        .map((pnt) => ({ x: -pnt.x, y: pnt.y })),
    ].map((pnt) => ({
      x: this.x + (pnt.x * Math.sin(angleRad) + pnt.y * Math.cos(angleRad)),
      y: this.y + (-pnt.x * Math.cos(angleRad) + pnt.y * Math.sin(angleRad)),
    }));

    this.p.beginShape();
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    this.p.curveVertex(firstPoint.x, firstPoint.y); // Control point.
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      this.p.curveVertex(point.x, point.y);
    }
    this.p.curveVertex(lastPoint.x, lastPoint.y); // Control point.
    this.p.endShape();

    this.p.line(firstPoint.x, firstPoint.y, lastPoint.x, lastPoint.y);

    this.jumpForward(topPoint.y);
  }
}
