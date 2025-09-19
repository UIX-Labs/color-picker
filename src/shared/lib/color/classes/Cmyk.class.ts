export class Cmyk {
  constructor(
    public c: number,
    public m: number,
    public y: number,
    public k: number,
  ) {
    this.c = c;
    this.m = m;
    this.y = y;
    this.k = k;
  }

  toString() {
    return `cmyk(${this.c * 100}%, ${this.m * 100}%, ${this.y * 100}%, ${this.k * 100}%)`;
  }
}
