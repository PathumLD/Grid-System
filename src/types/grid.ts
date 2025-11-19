export interface Box {
  id: number
  col: number
  row: number
  width: number
  height: number
}

export interface AbsoluteBox extends Box {
  left: number
  top: number
}

export interface DragState {
  startX: number
  startY: number
  startLeft: number
  startTop: number
}

export interface ResizeState {
  startX: number
  startY: number
  startLeft: number
  startTop: number
  startWidth: number
  startHeight: number
  direction: string
}

export const GRID_CONFIG = {
  COLS: 10,
  CELL_SIZE: 80,
  GAP: 8,
}