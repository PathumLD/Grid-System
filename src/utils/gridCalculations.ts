import { Box } from '../types/grid'

// Converts grid coordinates (col, row) to absolute pixel positions
// Formula: position = cell_index * (cell_size + gap)
// Formula: dimension = cells * cell_size + (cells - 1) * gap
export const getAbsolutePosition = (box: Box, gridConfig: { COLS: number, CELL_SIZE: number, GAP: number }) => {
  const { CELL_SIZE, GAP } = gridConfig
  return {
    left: box.col * (CELL_SIZE + GAP),
    top: box.row * (CELL_SIZE + GAP),
    width: box.width * CELL_SIZE + (box.width - 1) * GAP,   // Account for gaps between cells
    height: box.height * CELL_SIZE + (box.height - 1) * GAP,
  }
}

// Converts absolute pixel positions back to grid coordinates (rounds to nearest cell)
// Used when user releases a box after dragging/resizing
export const snapToGrid = (
  left: number, 
  top: number, 
  width: number, 
  height: number,
  gridConfig: { COLS: number, CELL_SIZE: number, GAP: number }
) => {
  const { CELL_SIZE, GAP, COLS } = gridConfig
  
  // Round pixel position to nearest grid cell
  const col = Math.max(0, Math.min(COLS - 1, Math.round(left / (CELL_SIZE + GAP))))
  const row = Math.max(0, Math.round(top / (CELL_SIZE + GAP)))
  
  // Round pixel dimensions to nearest grid cell count (minimum 1 cell)
  const gridWidth = Math.max(1, Math.round(width / (CELL_SIZE + GAP)))
  const gridHeight = Math.max(1, Math.round(height / (CELL_SIZE + GAP)))
  
  return {
    col: Math.min(col, COLS - gridWidth), // Prevent box from extending beyond grid
    row,
    width: gridWidth,
    height: gridHeight,
  }
}