/**
 * DOM and event handling utilities
 */

/**
 * Gets cursor position relative to an element
 */
export const getCursorPosition = (
  event: MouseEvent | TouchEvent,
  element: HTMLElement,
): { x: number; y: number } => {
  const rect = element.getBoundingClientRect();

  let clientX = 0;
  let clientY = 0;

  // Handle both mouse and touch events
  if ('touches' in event) {
    // For touch events
    if (event.touches.length > 0) {
      // Use active touches if available
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if (event.changedTouches && event.changedTouches.length > 0) {
      // Fall back to changedTouches (for touchend)
      clientX = event.changedTouches[0].clientX;
      clientY = event.changedTouches[0].clientY;
    }
  } else {
    // For mouse events
    clientX = event.clientX;
    clientY = event.clientY;
  }

  // Calculate position relative to element and bound it within the element
  const x = Math.min(Math.max(0, Math.round(clientX - rect.left)), element.clientWidth);

  const y = Math.min(Math.max(0, Math.round(clientY - rect.top)), element.clientHeight);

  return { x, y };
};

/**
 * Set up dragging behavior with bounds checking
 */
export const setupDragging = (
  element: HTMLElement,
  onDrag: (position: { x: number; y: number }) => void,
  onEnd?: () => void,
  markerRef?: React.RefObject<HTMLElement>,
): (() => void) => {
  if (!element) return () => {};

  let isDragging = false;
  let pointerId: number | null = null;

  const handlePointerMove = (e: PointerEvent) => {
    if (!isDragging || e.pointerId !== pointerId) {
      return;
    }
    e.preventDefault();

    const position = getCursorPosition(e, element);

    requestAnimationFrame(() => {
      onDrag(position);
    });
  };

  const handlePointerUp = (e: PointerEvent) => {
    if (!isDragging || e.pointerId !== pointerId) {
      return;
    }
    isDragging = false;

    element.releasePointerCapture(e.pointerId);
    pointerId = null;
    element.removeEventListener('pointermove', handlePointerMove);
    element.removeEventListener('pointerup', handlePointerUp);
    if (onEnd) {
      onEnd();
    }
  };

  const handlePointerDown = (e: PointerEvent) => {
    if (isDragging) {
      return;
    }

    isDragging = true;

    pointerId = e.pointerId;
    element.setPointerCapture(e.pointerId);

    e.preventDefault();
    e.stopPropagation();

    element.addEventListener('pointermove', handlePointerMove);
    element.addEventListener('pointerup', handlePointerUp);
    const position = getCursorPosition(e, element);
    onDrag(position);
  };

  // Attach pointerdown to element and marker if provided
  element.addEventListener('pointerdown', handlePointerDown);

  if (markerRef?.current) {
    markerRef.current.addEventListener('pointerdown', handlePointerDown);
  }

  // Cleanup function
  return () => {
    element.removeEventListener('pointerdown', handlePointerDown);
    if (markerRef?.current) {
      markerRef.current.removeEventListener('pointerdown', handlePointerDown);
    }
    if (isDragging && pointerId !== null) {
      element.removeEventListener('pointermove', handlePointerMove);
      element.removeEventListener('pointerup', handlePointerUp);
      element.releasePointerCapture(pointerId);
    }
  };
};

/**
 * Detect if device supports touch events
 */
export const isTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};
