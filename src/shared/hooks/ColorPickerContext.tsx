import React, { createContext, useContext } from 'react';

interface ColorPickerContextType {
  hue: number;
  color: string;
  opacity: number;

  setHue: React.Dispatch<number>;
  setColor: React.Dispatch<string>;
  setOpacity: React.Dispatch<number>;
}

export const ColorPickerContext = createContext<ColorPickerContextType | undefined>(undefined);

export const useColorPicker = () => {
  const context = useContext(ColorPickerContext);
  if (context === undefined) {
    throw new Error('usePageBuilder must be used within a PageBuilderProvider');
  }
  return context;
};
