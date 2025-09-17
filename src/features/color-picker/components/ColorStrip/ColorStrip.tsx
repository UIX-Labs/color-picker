import React, { useRef, useEffect, useCallback, useState } from 'react';

import { createHueStrip, getHueAtPosition, findHuePosition } from '@/shared/lib/canvas';
import { setupDragging } from '@/shared/lib/dom';
import { cx } from '@/utils/cx';

import './ColorStrip.css';
import { useColorPicker } from '@/shared/hooks/ColorPickerContext';
import { changeHue } from '@/shared/lib/color';

export interface ColorStripProps {
  classNames?: {
    container?: string;
    canvas?: string;
    marker?: string;
  };
}

export const ColorStrip: React.FC<ColorStripProps> = ({ classNames }) => {
  const { hue, setHue, setColor, color } = useColorPicker();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const markerRef = useRef<HTMLDivElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const isDragging = useRef(false);

  const isMounted = useRef(false);

  useEffect(() => {
    if (canvasRef.current && containerRef.current) {
      canvasRef.current.width = containerRef.current.clientWidth ?? 0;
      canvasRef.current.height = containerRef.current.clientHeight ?? 0;

      createHueStrip(canvasRef.current);
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !markerRef.current || isMounted.current) {
      return;
    }

    isMounted.current = true;

    const x = findHuePosition(canvasRef.current, hue);

    if (typeof x === 'number') {
      markerRef.current.style.transform = `translateX(${x}px) translate(-50%, -50%)`;
    }
  }, []);

  const handleDrag = useCallback(({ x }: { x: number; y: number }) => {
    if (!containerRef.current || !markerRef.current) return;
    const normalizedX = x;

    markerRef.current.style.transform = `translateX(${normalizedX}px) translate(-50%, -50%)`;

    isDragging.current = true;

    if (!canvasRef.current) return;

    const newHue = getHueAtPosition(canvasRef.current, normalizedX);

    if (typeof newHue === 'number') {
      setHue(newHue);
    }
  }, []);

  const handleDragEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    if (!containerRef.current || !markerRef.current) return;
    const cleanup = setupDragging(containerRef.current, handleDrag, handleDragEnd, markerRef);

    return cleanup;
  }, [handleDrag, handleDragEnd]);

  const handleMarkerMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className={cx('cp-color-strip', classNames?.container)} ref={containerRef}>
      <canvas ref={canvasRef} className={cx('cp-color-strip__canvas', classNames?.canvas)} />

      <div
        ref={markerRef}
        className={cx('cp-color-strip__marker', classNames?.marker)}
        style={{
          backgroundColor: `hsla(${hue}, 100%, 50%, 1)`,
        }}
        onMouseDown={handleMarkerMouseDown}
      />
    </div>
  );
};
