import { Box } from '../types/grid'

export const getAbsolutePosition = (box: Box, gridConfig: { COLS: number, CELL_SIZE: number, GAP: number }) => {
  const { CELL_SIZE, GAP } = gridConfig
  return {
    left: box.col * (CELL_SIZE + GAP),
    top: box.row * (CELL_SIZE + GAP),
    width: box.width * CELL_SIZE + (box.width - 1) * GAP,
    height: box.height * CELL_SIZE + (box.height - 1) * GAP,
  }
}

export const snapToGrid = (
  left: number, 
  top: number, 
  width: number, 
  height: number,
  gridConfig: { COLS: number, CELL_SIZE: number, GAP: number }
) => {
  const { CELL_SIZE, GAP, COLS } = gridConfig
  const col = Math.max(0, Math.min(COLS - 1, Math.round(left / (CELL_SIZE + GAP))))
  const row = Math.max(0, Math.round(top / (CELL_SIZE + GAP)))
  const gridWidth = Math.max(1, Math.round(width / (CELL_SIZE + GAP)))
  const gridHeight = Math.max(1, Math.round(height / (CELL_SIZE + GAP)))
  
  return {
    col: Math.min(col, COLS - gridWidth),
    row,
    width: gridWidth,
    height: gridHeight,
  }
}