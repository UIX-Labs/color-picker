import React, { useRef, useEffect, useState, useCallback } from 'react';

import { createHueGradient, findColorPosition, getColorAtPosition } from '@/shared/lib/canvas';
import { changeHue, parseColor } from '@/shared/lib/color';
import { Rgb } from '@/shared/lib/color/classes';
import { setupDragging } from '@/shared/lib/dom';
import { cx } from '@/utils/cx';

import './ColorBlock.css';
import { useColorPicker } from '@/shared/hooks/ColorPickerContext';

export interface ColorBlockProps {
  classNames?: {
    container?: string;
    gradient?: string;
    marker?: string;
  };
}

export const ColorBlock: React.FC<ColorBlockProps> = ({ classNames = {} }) => {
  const { hue, color, setColor } = useColorPicker();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const markerRef = useRef<HTMLDivElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);

  const isMounted = useRef(false);

  useEffect(() => {
    if (canvasRef.current && containerRef.current) {
      canvasRef.current.width = containerRef.current.clientWidth ?? 0;
      canvasRef.current.height = containerRef.current.clientHeight ?? 0;

      createHueGradient(canvasRef.current, hue);
      changeHueOfColor(hue);
    }
  }, [hue]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const cleanup = setupDragging(containerRef.current, handleDrag, handleDragEnd, markerRef);

    return cleanup;
  }, []);

  useEffect(() => {
    changeColor(color);
  }, []);

  const changeColor = useCallback((newColor: string) => {
    if (!canvasRef.current || !markerRef.current || isMounted.current) {
      return;
    }

    isMounted.current = true;

    const { rgb } = parseColor(newColor);
    const rgbString = new Rgb(rgb.r, rgb.g, rgb.b);
    const colorPosition = findColorPosition(canvasRef.current, rgbString.toString());

    if (colorPosition) {
      markerRef.current.style.transform = `translate(${colorPosition.x}px, ${colorPosition.y}px) translate(-50%, -50%)`;
    }

    setColor(newColor);
  }, []);

  const handleDrag = useCallback(({ x, y }: { x: number; y: number }) => {
    if (!containerRef.current || !markerRef.current) {
      return;
    }

    const normalizedX = Math.max(0, Math.min(x, containerRef.current.clientWidth - 1));
    const normalizedY = Math.max(0, Math.min(y, containerRef.current.clientHeight - 1));

    markerRef.current.style.transform = `translate(${normalizedX}px, ${normalizedY}px) translate(-50%, -50%)`;

    isDragging.current = true;

    if (!canvasRef.current) {
      return;
    }

    const newColor = getColorAtPosition(canvasRef.current, normalizedX, normalizedY);

    if (newColor) {
      setColor(newColor);
    }
  }, []);

  const changeHueOfColor = useCallback(
    (newHue: number) => {
      const newColor = changeHue(color, newHue);

      setColor(newColor);
    },
    [color],
  );

  const handleDragEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleMarkerMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div className={cx('cp-color-block', classNames.container)} ref={containerRef}>
      <canvas ref={canvasRef} className={cx('cp-color-block__canvas', classNames.gradient)} />

      <div
        ref={markerRef}
        className={cx(classNames.marker, 'cp-color-block__marker')}
        style={{ backgroundColor: color }}
        onMouseDown={handleMarkerMouseDown}
        onTouchStart={(e) => e.stopPropagation()}
      />
    </div>
  );
};
