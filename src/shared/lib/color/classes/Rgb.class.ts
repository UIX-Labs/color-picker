export class Rgb {
  constructor(
    public r: number,
    public g: number,
    public b: number,
  ) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  toString() {
    return `rgb(${this.r}, ${this.g}, ${this.b})`;
  }

  toRgba(alpha: number = 1) {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${alpha})`;
  }
}
