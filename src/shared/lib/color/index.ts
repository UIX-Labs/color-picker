import { Cmyk, Hex, Hsl, Hsv, Rgb } from './classes';
import { rgbToHsl, rgbToHsv, rgbToHex, rgbToCmyk } from './convert';
import hslToRgb from './convert/hslToRgb';

interface ColorValue {
  hex: string;
  rgb: { r: number; g: number; b: number; a: number };
  hsl: { h: number; s: number; l: number };
  hsv: { h: number; s: number; v: number };
}

/**
 * Parses a color string (hex, rgb, rgba, hsl, hsla) and returns standardized color values
 */
export function parseColor(color: string): ColorValue {
  // Create a temporary element to use the browser's color parsing
  const tempElement = document.createElement('div');
  tempElement.style.color = color;
  document.body.appendChild(tempElement);

  // Get computed RGB values
  const computedColor = window.getComputedStyle(tempElement).color;
  document.body.removeChild(tempElement);

  // Parse RGB values from computed style
  const rgbMatch = computedColor.match(/rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)/);
  if (!rgbMatch) {
    throw new Error(`Could not parse color: ${color}`);
  }

  const r = parseInt(rgbMatch[1], 10);
  const g = parseInt(rgbMatch[2], 10);
  const b = parseInt(rgbMatch[3], 10);
  const a = parseFloat(rgbMatch[4] || '1');

  // Convert RGB to HSL
  const hsl = rgbToHsl(r, g, b);

  // Convert RGB to HSV
  const hsv = rgbToHsv(r, g, b);

  // Convert RGB to HEX
  const hex = rgbToHex(r, g, b);

  return {
    hex,
    rgb: { r, g, b, a },
    hsl: {
      h: Math.round(hsl.h),
      s: Math.round(hsl.s),
      l: Math.round(hsl.l),
    },
    hsv: {
      h: Math.round(hsv.h),
      s: Math.round(hsv.s),
      v: Math.round(hsv.v),
    },
  };
}

export function changeOpacity(color: string, opacity: number): string {
  const { rgb } = parseColor(color);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

/**
 * Changes the hue of a color while maintaining saturation and lightness
 */
export function changeHue(color: string, hue: number): string {
  const { hsl } = parseColor(color);
  const newHsl = { h: hue, s: hsl.s, l: hsl.l };
  const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);

  return rgbToString({ r: newRgb.r, g: newRgb.g, b: newRgb.b });
}

export function convert(
  value: string,
  to: 'rgb' | 'hsl' | 'hsv' | 'cmyk' | 'hex',
  opacity: number = 1,
): string {
  const parsed = parseColor(value);

  if (to === 'rgb') {
    return opacity !== 1
      ? `rgba(${parsed.rgb.r}, ${parsed.rgb.g}, ${parsed.rgb.b}, ${opacity})`
      : `rgb(${parsed.rgb.r}, ${parsed.rgb.g}, ${parsed.rgb.b})`;
  }

  if (to === 'hsl') {
    return opacity !== 1
      ? `hsla(${parsed.hsl.h}, ${parsed.hsl.s}%, ${parsed.hsl.l}%, ${opacity})`
      : `hsl(${parsed.hsl.h}, ${parsed.hsl.s}%, ${parsed.hsl.l}%)`;
  }

  if (to === 'hex') {
    // Standard hex doesn't support opacity
    return parsed.hex;
  }

  if (to === 'hsv') {
    return `hsv(${parsed.hsv.h}, ${parsed.hsv.s}%, ${parsed.hsv.v}%)`;
  }

  if (to === 'cmyk') {
    const cmyk = rgbToCmyk(parsed.rgb.r, parsed.rgb.g, parsed.rgb.b);

    return `cmyk(${Math.round(cmyk.c * 100)}%, ${Math.round(cmyk.m * 100)}%, ${Math.round(
      cmyk.y * 100,
    )}%, ${Math.round(cmyk.k * 100)}%)`;
  }

  return value;
}

/**
 * Formats HSL object as a CSS string
 */
export function hslToString(hsl: { h: number; s: number; l: number }): string {
  return new Hsl(hsl.h, hsl.s, hsl.l).toString();
}

/**
 * Formats RGB object as a CSS string
 */
export function rgbToString(rgb: { r: number; g: number; b: number }): string {
  return new Rgb(rgb.r, rgb.g, rgb.b).toString();
}

/**
 * Formats HSV object as a CSS string
 */
export function hsvToString(hsv: { h: number; s: number; v: number }): string {
  return new Hsv(hsv.h, hsv.s, hsv.v).toString();
}

/**
 * Formats CMYK object as a CSS string
 */
export function cmykToString(cmyk: { c: number; m: number; y: number; k: number }): string {
  return new Cmyk(cmyk.c, cmyk.m, cmyk.y, cmyk.k).toString();
}

/**
 * Formats HEX object as a CSS string
 */
export function hexToString(hex: string): string {
  return new Hex(hex).toString();
}
