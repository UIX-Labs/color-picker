/**
 * Creates a hue gradient on a canvas
 * Generates the main color selection area with white-to-black vertical gradient
 * and transparent-to-color horizontal gradient
 */
export const createHueGradient = (canvas: HTMLCanvasElement | null, hue: number): void => {
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  // Create vertical gradient (white to black) for brightness/value
  const gradB = ctx.createLinearGradient(1, 1, 1, height - 1);
  gradB.addColorStop(0, 'white');
  gradB.addColorStop(1, 'black');

  // Create horizontal gradient (transparent to full color) for saturation
  const gradC = ctx.createLinearGradient(1, 0, width - 1, 0);
  gradC.addColorStop(0, `hsla(${hue},100%,50%,0)`);
  gradC.addColorStop(1, `hsla(${hue},100%,50%,1)`);

  // Apply the white-to-black gradient
  ctx.fillStyle = gradB;
  ctx.fillRect(0, 0, width, height);

  // Apply the transparent-to-color gradient using multiply blend mode
  ctx.fillStyle = gradC;
  ctx.globalCompositeOperation = 'multiply';

  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'source-over';
};

/**
 * Creates a linear gradient of all hues on a canvas
 * Used for the hue selection strip
 */
export const createHueStrip = (canvas: HTMLCanvasElement | null): void => {
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  // Create horizontal gradient with all hues (0-360 degrees)
  const gradient = ctx.createLinearGradient(0, 0, width, 0);

  // Add color stops for every 10 degrees of hue (36 total stops)
  for (let i = 0; i <= 36; i++) {
    gradient.addColorStop(i / 36, `hsla(${i * 10}, 100%, 50%, 1)`);
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
};

/**
 * Calculates the coordinates for a specific hue value in the hue strip
 */
export const getHueCoordinates = (
  canvas: HTMLCanvasElement | null,
  hue: number,
): { x: number; y: number } => {
  if (!canvas || hue === null || hue === undefined) {
    return { x: 0, y: 0 };
  }

  const x = (canvas.width * hue) / 360;
  const y = canvas.height / 2;

  return { x, y };
};

/**
 * Gets the hue value at a specific x position in the strip
 */
export const getHueAtPosition = (canvas: HTMLCanvasElement | null, x: number): number | null => {
  if (!canvas) return null;

  // Calculate hue based on x position (0-360)
  const newHue = (x / canvas.width) * 360;
  return Math.max(0, Math.min(360, newHue));
};

/**
 * Finds the x position for a given hue in the strip
 */
export const findHuePosition = (canvas: HTMLCanvasElement | null, hue: number): number | null => {
  if (!canvas || hue === null || hue === undefined) {
    return null;
  }

  return (canvas.width * hue) / 360;
};

/**
 * Get the color at a specific position in the canvas
 */
export const getColorAtPosition = (
  canvas: HTMLCanvasElement,
  x: number,
  y: number,
): string | null => {
  if (!canvas) return null;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  try {
    const imageData = ctx.getImageData(x, y, 1, 1).data;
    return `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;
  } catch (error) {
    console.error('Error getting color at position:', error);
    return null;
  }
};

/**
 * Find the closest matching color position in a canvas
 */
export const findColorPosition = (
  canvas: HTMLCanvasElement | null,
  targetColor: string,
): { x: number; y: number } | null => {
  if (!canvas || !targetColor) return null;

  const ctx = canvas?.getContext('2d');
  if (!ctx) return null;

  // Use a simple approach first - just scan the canvas for the closest color
  // This is simplified and could be improved for performance
  const width = canvas.width;
  const height = canvas.height;

  try {
    const imageData = ctx.getImageData(0, 0, width, height).data;
    let bestMatch = { x: 0, y: 0, difference: Number.MAX_VALUE };

    // Extract target RGB values
    const targetMatch = targetColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!targetMatch) return null;

    const targetR = parseInt(targetMatch[1], 10);
    const targetG = parseInt(targetMatch[2], 10);
    const targetB = parseInt(targetMatch[3], 10);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const r = imageData[index];
        const g = imageData[index + 1];
        const b = imageData[index + 2];

        // Calculate color difference (using a simple Euclidean distance)
        const difference = Math.sqrt(
          Math.pow((r - targetR) * 0.299, 2) +
            Math.pow((g - targetG) * 0.587, 2) +
            Math.pow((b - targetB) * 0.114, 2),
        );

        if (difference < bestMatch.difference) {
          bestMatch = { x, y, difference };
        }
      }
    }

    return { x: bestMatch.x, y: bestMatch.y };
  } catch (error) {
    console.error('Error finding color position:', error);
    return null;
  }
};
