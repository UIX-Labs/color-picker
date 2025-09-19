export class Hsv {
  constructor(
    public h: number,
    public s: number,
    public v: number,
  ) {
    this.h = h;
    this.s = s;
    this.v = v;
  }

  toString() {
    return `hsv(${this.h}, ${this.s}%, ${this.v}%)`;
  }
}
