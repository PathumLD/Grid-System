import { PixelPosition } from "../types/grid";

export const GRID_COLUMNS = 10;
export const GAP = 8;

// Calculate cell size based on container width
export const getCellSize = (containerWidth: number): number => {
  // Subtract padding and gaps, then divide by number of columns
  const totalGaps = (GRID_COLUMNS - 1) * GAP;
  const availableWidth = containerWidth - totalGaps;
  return Math.floor(availableWidth / GRID_COLUMNS);
};

export const gridToPixels = (
  col: number,
  row: number,
  width: number,
  height: number,
  cellSize: number
): PixelPosition => ({
  x: col * (cellSize + GAP),
  y: row * (cellSize + GAP),
  width: width * cellSize + (width - 1) * GAP,
  height: height * cellSize + (height - 1) * GAP,
});

export const pixelsToGrid = (
  x: number,
  y: number,
  width: number,
  height: number,
  cellSize: number
) => {
  const col = Math.max(0, Math.round(x / (cellSize + GAP)));
  const row = Math.max(0, Math.round(y / (cellSize + GAP)));
  const gridWidth = Math.max(1, Math.round(width / (cellSize + GAP)));
  const gridHeight = Math.max(1, Math.round(height / (cellSize + GAP)));
  
  return {
    col: Math.min(col, GRID_COLUMNS - gridWidth),
    row,
    width: gridWidth,
    height: gridHeight,
  };
};