/**
 * @license
 * Copyright 2022 Beka Westberg
 * SPDX-License-Identifier: MIT
 */


interface CreateSigParams {
  minY?: number,
  maxY?: number,
  steepness?: number,
  midX?: number
}

export function createSig(
  {minY = 0, maxY = 1, steepness = 10, midX = .5}: CreateSigParams
) {
  return (x: number) =>
      maxY / (1 + Math.exp(-1 * steepness * (x - midX))) + minY;
}

export function sig(
  x: number,
  params: CreateSigParams
) {
  return createSig(params)(x);
}