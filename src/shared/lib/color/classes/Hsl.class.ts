export class Hsl {
  constructor(
    public h: number,
    public s: number,
    public l: number,
  ) {
    this.h = h;
    this.s = s;
    this.l = l;
  }

  toString() {
    return `hsl(${this.h}, ${this.s}%, ${this.l}%)`;
  }
}
