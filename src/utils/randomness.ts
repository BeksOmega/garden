import Rand, { PRNG } from 'rand-seed';

export class Random {
  private rand: Rand;

  constructor(seed: string | number) {
    this.rand = new Rand(seed.toString(), PRNG.xoshiro128ss);
  }

  /**
   * Generates a random integer between min (inclusive) and max (inclusive)
   * If no parameters are provided, returns 0 or 1
   * If only min is provided, returns an integer between min and 1
   */
  int(min = 0, max = 100): number {
    return Math.floor(this.rand.next() * (max - min + 1)) + min;
  }

  /**
   * Generates a random float between min (inclusive) and max (exclusive)
   * If no parameters are provided, returns a float between 0 and 1
   * If only min is provided, returns a float between min and 1
   */
  float(min = 0, max = 1): number {
    if (min === 0 && max === 1) {
      return this.rand.next();
    }
    return this.rand.next() * (max - min) + min;
  }

  /**
   * Generates an array of random integers between min and max
   * If no min/max are provided, generates array of 0s and 1s
   * If only min is provided, generates array of integers between min and 1
   */
  intArray(length: number, min = 0, max = 100): number[] {
    return Array.from({ length }, () => this.int(min, max));
  }

  /**
   * Generates an array of random floats between min and max
   * If no min/max are provided, generates array of floats between 0 and 1
   * If only min is provided, generates array of floats between min and 1
   */
  floatArray(length: number, min = 0, max = 1): number[] {
    return Array.from({ length }, () => this.float(min, max));
  }

  /**
   * Returns a random element from an array
   */
  choice<T>(array: T[]): T {
    return array[Math.floor(this.rand.next() * array.length)];
  }

  /**
   * Shuffles an array using Fisher-Yates algorithm
   */
  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(this.rand.next() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  /**
   * Generates a random boolean with given probability (0-1)
   */
  boolean(probability: number = 0.5): boolean {
    return this.rand.next() < probability;
  }

  /**
   * Generates a random color in RGB format
   */
  color(): [number, number, number] {
    return [
      Math.floor(this.rand.next() * 256),
      Math.floor(this.rand.next() * 256),
      Math.floor(this.rand.next() * 256)
    ];
  }
}
