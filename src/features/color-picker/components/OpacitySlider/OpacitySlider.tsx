import React, { useRef, useEffect, useCallback, useState } from 'react';

import { changeOpacity } from '@/shared/lib/color';
import { setupDragging } from '@/shared/lib/dom';
import { cx } from '@/utils/cx';

import './OpacitySlider.css';
import { useColorPicker } from '@/shared/hooks/ColorPickerContext';

export interface OpacitySliderProps {
  classNames?: {
    container?: string;
    marker?: string;
  };
}

export const OpacitySlider: React.FC<OpacitySliderProps> = ({ classNames }) => {
  const { color, opacity, setOpacity, setColor } = useColorPicker();

  const containerRef = useRef<HTMLDivElement>(null);

  const markerRef = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);

  const isMounted = useRef(false);

  useEffect(() => {
    const newColor = changeOpacity(color, opacity);

    setColor(newColor);
  }, [opacity]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const cleanup = setupDragging(containerRef.current, handleDrag, handleDragEnd, markerRef);

    return cleanup;
  }, []);

  useEffect(() => {
    if (!containerRef.current || !markerRef.current || isMounted.current) {
      return;
    }

    isMounted.current = true;

    const width = containerRef.current.offsetWidth;

    const x = width * opacity;

    markerRef.current.style.transform = `translateX(${x}px) translate(-50%, -50%)`;
  }, []);

  const handleDrag = useCallback(({ x }: { x: number; y: number }) => {
    if (!containerRef.current || !markerRef.current) {
      return;
    }

    const width = containerRef.current.offsetWidth;

    const boundedX = Math.max(0, Math.min(width, x));

    markerRef.current.style.transform = `translateX(${boundedX}px) translate(-50%, -50%)`;
    isDragging.current = true;

    const newValue = boundedX / width;
    setOpacity(newValue);
  }, []);

  const handleDragEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleMarkerMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className={cx('cp-opacity-slider', classNames?.container)}
      style={{
        background: `linear-gradient(to right, rgba(0,0,0,0), ${changeOpacity(color, 1)})`,
      }}
      ref={containerRef}
    >
      <div
        ref={markerRef}
        className={cx('cp-opacity-slider__marker', classNames?.marker)}
        onMouseDown={handleMarkerMouseDown}
        onTouchStart={(e) => e.stopPropagation()}
        style={{ backgroundColor: color }}
      />
    </div>
  );
};
