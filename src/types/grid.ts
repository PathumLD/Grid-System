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

// Responsive grid configuration
export const getGridConfig = () => {
  if (typeof window === 'undefined') {
    return { COLS: 10, CELL_SIZE: 100, GAP: 12 }
  }
  
  const width = window.innerWidth
  
  if (width < 640) {
    // Mobile
    return { COLS: 4, CELL_SIZE: 70, GAP: 8 }
  } else if (width < 1024) {
    // Tablet
    return { COLS: 6, CELL_SIZE: 90, GAP: 10 }
  } else {
    // Desktop
    return { COLS: 10, CELL_SIZE: 100, GAP: 12 }
  }
}

export const GRID_CONFIG = getGridConfig()