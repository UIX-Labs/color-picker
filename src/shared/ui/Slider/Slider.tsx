import React, { useRef, useEffect, useState } from 'react';

import { setupDragging } from '../../lib/dom';
import './Slider.css';

export interface SliderProps {
  /**
   * Current value
   */
  value: number;

  /**
   * Callback when value changes
   */
  onChange: (value: number) => void;

  /**
   * Minimum value
   */
  min?: number;

  /**
   * Maximum value
   */
  max?: number;

  /**
   * Step size
   */
  step?: number;

  /**
   * Slider orientation
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Additional class name
   */
  className?: string;

  /**
   * Track color
   */
  trackColor?: string;

  /**
   * Show value label
   */
  showLabel?: boolean;

  /**
   * Format function for the label
   */
  formatLabel?: (value: number) => string;

  /**
   * Disable the slider
   */
  disabled?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  orientation = 'horizontal',
  className,
  trackColor,
  showLabel = false,
  formatLabel = (val) => val.toString(),
  disabled = false,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Calculate the percentage position
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  // Calculate the new value based on position
  const calculateValue = (position: number, trackSize: number): number => {
    // Get the position as a percentage
    const newPercentage = Math.max(0, Math.min(100, (position / trackSize) * 100));

    // Convert percentage to value
    const rawValue = min + (newPercentage / 100) * (max - min);

    // Apply step
    const steppedValue = Math.round(rawValue / step) * step;

    return Math.max(min, Math.min(max, steppedValue));
  };

  // Set up dragging
  useEffect(() => {
    if (!trackRef.current) return undefined;

    const handleDrag = ({ x, y }: { x: number; y: number }) => {
      setIsDragging(true);

      if (!trackRef.current) return;

      const isHorizontal = orientation === 'horizontal';
      const trackSize = isHorizontal ? trackRef.current.clientWidth : trackRef.current.clientHeight;

      const position = isHorizontal ? x : trackSize - y;
      const newValue = calculateValue(position, trackSize);

      // Only update if the value has changed
      if (newValue !== value) {
        onChange(newValue);
      }
    };

    const handleDragEnd = () => {
      setIsDragging(false);
    };

    const cleanup = setupDragging(trackRef.current, handleDrag, handleDragEnd, thumbRef);

    return cleanup;
  }, [min, max, step, orientation, onChange, value]);

  return (
    <div
      className={`cp-slider cp-slider--${orientation} ${disabled ? 'cp-slider--disabled' : ''} ${className || ''}`}
    >
      <div
        ref={trackRef}
        className="cp-slider-track"
        style={{ backgroundColor: disabled ? undefined : trackColor }}
      >
        <div
          className="cp-slider-track-fill"
          style={{
            [orientation === 'horizontal' ? 'width' : 'height']: `${percentage}%`,
            backgroundColor: disabled ? undefined : trackColor,
          }}
        />
      </div>

      <div
        ref={thumbRef}
        className={`cp-slider-thumb ${isDragging ? 'cp-slider-thumb--dragging' : ''}`}
        style={{
          [orientation === 'horizontal' ? 'left' : 'bottom']: `${percentage}%`,
          backgroundColor: disabled ? undefined : trackColor,
          pointerEvents: 'auto',
        }}
      >
        {showLabel && <div className="cp-slider-label">{formatLabel(value)}</div>}
      </div>
    </div>
  );
};
