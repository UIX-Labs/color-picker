import React, { PropsWithChildren, useEffect, useState } from 'react';

import { ColorPickerContext } from './ColorPickerContext';
import {
  ColorBlock,
  ColorBlockProps,
  ColorStrip,
  ColorStripProps,
  OpacitySlider,
  OpacitySliderProps,
} from '@/features/color-picker';
import { ColorPickerProps } from './types';
import { parseColor } from '../lib/color';

interface ColorPickerComponent extends React.FC<PropsWithChildren<ColorPickerProps>> {
  Block: React.FC<Pick<ColorBlockProps, 'classNames'>>;
  Strip: React.FC<Pick<ColorStripProps, 'classNames'>>;
  Opacity: React.FC<Pick<OpacitySliderProps, 'classNames'>>;
}

const ColorPicker: ColorPickerComponent = ({
  children,
  onChange,
  defaultColor = 'rgb(255,255,255)',
}) => {
  const [hue, setHue] = useState<number>(255);
  const [color, setColor] = useState<string>(defaultColor);
  const [opacity, setOpacity] = useState(1);
  const [parsing, setParsing] = useState(true);

  useEffect(() => {
    onChange(color, opacity, hue);
  }, [color, opacity, hue]);

  useEffect(() => {
    const {
      rgb: { r, g, b, a },
      hsl: { h },
    } = parseColor(defaultColor);

    setHue(h);
    setColor(`rgb(${r}, ${g}, ${b})`);
    setOpacity(a ?? 1);

    setParsing(false);
  }, []);

  return (
    <ColorPickerContext.Provider
      value={{
        hue,
        opacity,
        color,

        setColor,
        setHue,
        setOpacity,
      }}
    >
      {!parsing && children}
    </ColorPickerContext.Provider>
  );
};

ColorPicker.displayName = 'ColorPicker';

ColorPicker.Block = () => {
  return <ColorBlock />;
};

ColorPicker.Block.displayName = 'ColorPicker.Block';

ColorPicker.Strip = () => {
  return <ColorStrip />;
};

ColorPicker.Strip.displayName = 'ColorPicker.Strip';

ColorPicker.Opacity = () => {
  return <OpacitySlider />;
};

export { ColorPicker };
