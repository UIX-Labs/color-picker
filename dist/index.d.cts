import React, { PropsWithChildren } from 'react';

interface ColorBlockProps {
    classNames?: {
        container?: string;
        gradient?: string;
        marker?: string;
    };
}
declare const ColorBlock: React.FC<ColorBlockProps>;

interface ColorStripProps {
    classNames?: {
        container?: string;
        canvas?: string;
        marker?: string;
    };
}
declare const ColorStrip: React.FC<ColorStripProps>;

interface OpacitySliderProps {
    classNames?: {
        container?: string;
        marker?: string;
    };
}
declare const OpacitySlider: React.FC<OpacitySliderProps>;

interface ColorValue {
    hex: string;
    rgb: {
        r: number;
        g: number;
        b: number;
        a: number;
    };
    hsl: {
        h: number;
        s: number;
        l: number;
    };
    hsv: {
        h: number;
        s: number;
        v: number;
    };
}
/**
 * Parses a color string (hex, rgb, rgba, hsl, hsla) and returns standardized color values
 */
declare function parseColor(color: string): ColorValue;
declare function changeOpacity(color: string, opacity: number): string;
/**
 * Changes the hue of a color while maintaining saturation and lightness
 */
declare function changeHue(color: string, hue: number): string;
declare function convert(value: string, to: 'rgb' | 'hsl' | 'hsv' | 'cmyk' | 'hex', opacity?: number): string;
/**
 * Formats HSL object as a CSS string
 */
declare function hslToString(hsl: {
    h: number;
    s: number;
    l: number;
}): string;
/**
 * Formats RGB object as a CSS string
 */
declare function rgbToString(rgb: {
    r: number;
    g: number;
    b: number;
}): string;
/**
 * Formats HSV object as a CSS string
 */
declare function hsvToString(hsv: {
    h: number;
    s: number;
    v: number;
}): string;
/**
 * Formats CMYK object as a CSS string
 */
declare function cmykToString(cmyk: {
    c: number;
    m: number;
    y: number;
    k: number;
}): string;
/**
 * Formats HEX object as a CSS string
 */
declare function hexToString(hex: string): string;

interface ColorPickerProps {
  defaultColor: string;
  onChange: (color: string, opacity: number, hue: number) => void;
}

interface ColorPickerComponent extends React.FC<PropsWithChildren<ColorPickerProps>> {
    Block: React.FC<Pick<ColorBlockProps, 'classNames'>>;
    Strip: React.FC<Pick<ColorStripProps, 'classNames'>>;
    Opacity: React.FC<Pick<OpacitySliderProps, 'classNames'>>;
}
declare const ColorPicker: ColorPickerComponent;

interface ColorPickerContextType {
    hue: number;
    color: string;
    opacity: number;
    setHue: React.Dispatch<number>;
    setColor: React.Dispatch<string>;
    setOpacity: React.Dispatch<number>;
}
declare const ColorPickerContext: React.Context<ColorPickerContextType | undefined>;
declare const useColorPicker: () => ColorPickerContextType;

export { ColorBlock, type ColorBlockProps, ColorPicker, ColorPickerContext, ColorStrip, type ColorStripProps, OpacitySlider, type OpacitySliderProps, changeHue, changeOpacity, cmykToString, convert, hexToString, hslToString, hsvToString, parseColor, rgbToString, useColorPicker };
