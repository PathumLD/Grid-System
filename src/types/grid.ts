// Box stored in grid coordinates (col/row) - used for final snapped positions
export interface Box {
  id: number
  col: number    // Grid column (0-based)
  row: number    // Grid row (0-based)
  width: number  // Width in grid cells
  height: number // Height in grid cells
}

// Box with pixel coordinates - used during drag/resize for smooth movement
export interface AbsoluteBox extends Box {
  left: number   // Pixels from left edge
  top: number    // Pixels from top edge
}

// Captures initial state when drag begins
export interface DragState {
  startX: number      // Initial mouse X position
  startY: number      // Initial mouse Y position
  startLeft: number   // Initial box left position
  startTop: number    // Initial box top position
}

// Captures initial state when resize begins
export interface ResizeState {
  startX: number        // Initial mouse X position
  startY: number        // Initial mouse Y position
  startLeft: number     // Initial box left position
  startTop: number      // Initial box top position
  startWidth: number    // Initial box width
  startHeight: number   // Initial box height
  direction: string     // Handle direction: n, ne, e, se, s, sw, w, nw
}

// Responsive grid configuration: adjusts columns and cell size based on screen width
export const getGridConfig = () => {
  if (typeof window === 'undefined') {
    // Server-side rendering fallback (Next.js)
    return { COLS: 10, CELL_SIZE: 100, GAP: 12 }
  }
  
  const width = window.innerWidth
  
  if (width < 640) {
    // Mobile: 4 columns, smaller cells
    return { COLS: 4, CELL_SIZE: 70, GAP: 8 }
  } else if (width < 1024) {
    // Tablet: 6 columns, medium cells
    return { COLS: 6, CELL_SIZE: 90, GAP: 10 }
  } else {
    // Desktop: 10 columns, larger cells
    return { COLS: 10, CELL_SIZE: 100, GAP: 12 }
  }
}

// Initial grid configuration (recalculated on window resize)
export const GRID_CONFIG = getGridConfig()