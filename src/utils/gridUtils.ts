import { PixelPosition } from "../types/grid";

export const GRID_COLUMNS = 10;
export const CELL_SIZE = 150;
export const GAP = 5;

export const gridToPixels = (
  col: number,
  row: number,
  width: number,
  height: number
): PixelPosition => ({
  x: col * (CELL_SIZE + GAP),
  y: row * (CELL_SIZE + GAP),
  width: width * CELL_SIZE + (width - 1) * GAP,
  height: height * CELL_SIZE + (height - 1) * GAP,
});

export const pixelsToGrid = (
  x: number,
  y: number,
  width: number,
  height: number
) => {
  const col = Math.max(0, Math.round(x / (CELL_SIZE + GAP)));
  const row = Math.max(0, Math.round(y / (CELL_SIZE + GAP)));
  const gridWidth = Math.max(1, Math.round(width / (CELL_SIZE + GAP)));
  const gridHeight = Math.max(1, Math.round(height / (CELL_SIZE + GAP)));
  
  return {
    col: Math.min(col, GRID_COLUMNS - gridWidth),
    row,
    width: gridWidth,
    height: gridHeight,
  };
};