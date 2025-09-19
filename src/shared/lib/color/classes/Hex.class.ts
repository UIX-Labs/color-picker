export class Hex {
  constructor(public value: string) {
    // Remove # if present and ensure it's a valid hex color
    this.value = value.replace('#', '');
    if (!/^[0-9A-Fa-f]{6}$/.test(this.value)) {
      throw new Error('Invalid hex color value');
    }
  }

  toString() {
    return `#${this.value}`;
  }
}
