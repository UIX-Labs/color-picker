# Color Picker Component Library

A lightweight, customizable color picker component library for React applications.

## Features

- Composable components for custom interfaces
- Multiple color format support (RGB, HSL, HSV, CMYK, HEX)
- Alpha channel support
- Touch device support

## Installation

```bash
npm install color-picker.js
# or
yarn add color-picker.js
# or
pnpm add color-picker.js
```

## Usage

### Composable Components (Recommended)

For maximum flexibility, you can use the individual components to build your own custom color picker:

```jsx
import React, { useState } from 'react';
import { ColorBlock, ColorStrip, OpacitySlider, changeOpacity } from 'color-picker.js';

function MyColorPicker() {
  const [hue, setHue] = useState(180);
  const [color, setColor] = useState('rgba(0, 255, 255, 1)');
  const [opacity, setOpacity] = useState(1);

  const handleColorChange = (newColor) => {
    setColor(newColor);
  };

  const handleHueChange = (newHue) => {
    setHue(newHue);
  };

  const handleOpacityChange = (newOpacity) => {
    setOpacity(newOpacity);
  };

  const colorWithOpacity = useMemo(() => {
    return changeOpacity(color, opacity);
  }, [color, opacity]);

  return (
    <div className="my-color-picker">
      <ColorBlock hue={hue} color={color} onChange={handleColorChange} />
      <ColorStrip defaultHue={hue} onChange={handleHueChange} />
      <OpacitySlider
        defaultValue={opacity}
        colorWithOpacity={colorWithOpacity}
        onChange={handleOpacityChange}
      />
    </div>
  );
}
```

### All-in-One Component (Less Customizable)

For simpler use cases, you can use the `ColorPicker` component:

```jsx
import React, { useState } from 'react';
import { ColorPicker } from 'color-picker.js';

function MyComponent() {
  const [color, setColor] = useState('rgba(255, 0, 0, 1)');

  return <ColorPicker color={color} onChange={setColor} showOpacity={true} theme="light" />;
}
```

## Components API

### ColorBlock

The main color selection area with saturation/brightness.

| Prop     | Type     | Required | Description                  |
| -------- | -------- | -------- | ---------------------------- |
| hue      | number   | Yes      | Current hue value (0-360)    |
| color    | string   | Yes      | Current color in RGBA format |
| onChange | function | Yes      | Callback when color changes  |
| style    | object   | No       | Additional styles to apply   |

### ColorStrip

The horizontal hue selection strip.

| Prop     | Type     | Required | Description                |
| -------- | -------- | -------- | -------------------------- |
| hue      | number   | Yes      | Current hue value (0-360)  |
| onChange | function | Yes      | Callback when hue changes  |
| style    | object   | No       | Additional styles to apply |

### OpacitySlider

The slider for adjusting opacity/alpha.

| Prop     | Type     | Required | Description                              |
| -------- | -------- | -------- | ---------------------------------------- |
| value    | number   | Yes      | Current opacity value (0-1)              |
| color    | string   | Yes      | Current color to display in the gradient |
| onChange | function | Yes      | Callback when opacity changes            |
| style    | object   | No       | Additional styles to apply               |

### ColorPicker

The all-in-one color picker component.

| Prop         | Type              | Required | Description                                     |
| ------------ | ----------------- | -------- | ----------------------------------------------- |
| color        | string            | Yes      | Current color in any supported format           |
| onChange     | function          | Yes      | Callback when color changes                     |
| showOpacity  | boolean           | No       | Whether to show opacity slider (default: false) |
| presetColors | string[]          | No       | Array of preset colors to display               |
| theme        | 'light' \| 'dark' | No       | Theme for the color picker (default: 'light')   |
| style        | object            | No       | Additional styles to apply                      |

## Color Formats and Conversion Utilities

The library supports multiple color formats (RGB, HSL, HSV, CMYK, HEX) and provides utilities to convert between them:

```jsx
import { parseColor, convert, changeHue, changeOpacity } from 'color-picker.js';

// Parse any color format into standardized values
const colorValues = parseColor('#FF5733');
console.log(colorValues);
// Output:
// {
//   hex: "#FF5733",
//   rgb: { r: 255, g: 87, b: 51 },
//   hsl: { h: 14, s: 100, l: 60 },
//   hsv: { h: 14, s: 80, v: 100 }
// }

// Convert between color formats
const hslColor = convert('#FF5733', 'hsl');
console.log(hslColor); // "hsl(14, 100%, 60%)"

const rgbColor = convert('#FF5733', 'rgb');
console.log(rgbColor); // "rgb(255, 87, 51)"

const cmykColor = convert('#FF5733', 'cmyk');
console.log(cmykColor); // "cmyk(0%, 66%, 80%, 0%)"

// Change opacity while preserving the color
const transparentRed = changeOpacity('#FF0000', 0.5);
console.log(transparentRed); // "rgba(255, 0, 0, 0.5)"

// Change just the hue while keeping saturation and lightness
const blueVersion = changeHue('#FF0000', 240);
console.log(blueVersion); // "rgb(0, 0, 255)"
```

The library handles color conversion using mathematical formulas that preserve color appearance across different formats. This makes it easy to work with colors in whichever format is most convenient for your application.

## Architecture

```
src/
├── features/
│   └── color-picker/
│       ├── components/
│       │   ├── ColorBlock/
│       │   ├── ColorStrip/
│       │   ├── OpacitySlider/
│       │   └── ColorPicker/
│       └── index.ts
├── shared/
│   ├── lib/
│   │   ├── canvas.ts
│   │   ├── dom.ts
│   │   └── color/
│   │       ├── classes/
│   │       │   ├── Rgb.class.ts
│   │       │   ├── Hsl.class.ts
│   │       │   ├── Hsv.class.ts
│   │       │   ├── Cmyk.class.ts
│   │       │   └── Hex.class.ts
│   │       ├── convert/
│   │       │   ├── rgbToHsl.ts
│   │       │   ├── rgbToHsv.ts
│   │       │   ├── rgbToHex.ts
│   │       │   ├── rgbToCmyk.ts
│   │       │   ├── hslToRgb.ts
│   │       │   └── index.ts
│   │       └── index.ts
└── index.ts
```

## How the Color Picker Works

Our color picker uses a canvas to create an interactive gradient surface where:

1. X-position determines the hue (color type)
2. Y-position determines saturation and brightness

When you click or drag on this surface, we:

1. Capture the exact coordinates of your cursor
2. Get the RGB color value at that exact pixel using `context.getImageData()`
3. Convert this RGB value to other formats as needed (HSL, HSV, HEX, CMYK)
4. Update the UI to show your selected color

This gives you a smooth, intuitive way to select exactly the color you want!

## License

MIT
