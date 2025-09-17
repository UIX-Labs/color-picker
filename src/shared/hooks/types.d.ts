export interface ColorPickerProps {
  defaultColor: string;
  onChange: (color: string, opacity: number, hue: number) => void;
}
