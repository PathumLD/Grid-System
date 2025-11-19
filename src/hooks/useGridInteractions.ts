import { useState, useEffect } from 'react'
import { AbsoluteBox, DragState, ResizeState } from '../types/grid'

// Custom hook that handles all mouse-based drag and resize interactions
export const useGridInteractions = (
  selectedBox: AbsoluteBox | null,
  setSelectedBox: React.Dispatch<React.SetStateAction<AbsoluteBox | null>>,
  gridConfig: { COLS: number, CELL_SIZE: number, GAP: number }
) => {
  // Tracks initial mouse position and box position when drag starts
  const [dragState, setDragState] = useState<DragState | null>(null)
  // Tracks initial mouse position, box position/size, and resize direction
  const [resizeState, setResizeState] = useState<ResizeState | null>(null)

  // Capture initial mouse and box position when user starts dragging
  const handleDragStart = (e: React.MouseEvent) => {
    if (!selectedBox) return
    e.stopPropagation()
    
    setDragState({
      startX: e.clientX,
      startY: e.clientY,
      startLeft: selectedBox.left,
      startTop: selectedBox.top,
    })
  }

  // Capture initial state when user grabs a resize handle (n, ne, e, se, s, sw, w, nw)
  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation()
    if (!selectedBox) return
    
    setResizeState({
      startX: e.clientX,
      startY: e.clientY,
      startLeft: selectedBox.left,
      startTop: selectedBox.top,
      startWidth: selectedBox.width,
      startHeight: selectedBox.height,
      direction,
    })
  }

  // Listen for mouse movements and release during active drag/resize operations
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // DRAG: Calculate mouse delta and update box position
      if (dragState) {
        const dx = e.clientX - dragState.startX
        const dy = e.clientY - dragState.startY
        
        setSelectedBox(prev => prev ? {
          ...prev,
          left: Math.max(0, dragState.startLeft + dx),
          top: Math.max(0, dragState.startTop + dy),
        } : null)
      }
      
      // RESIZE: Calculate new dimensions based on handle direction
      if (resizeState) {
        const dx = e.clientX - resizeState.startX
        const dy = e.clientY - resizeState.startY
        const dir = resizeState.direction
        
        let newLeft = resizeState.startLeft
        let newTop = resizeState.startTop
        let newWidth = resizeState.startWidth
        let newHeight = resizeState.startHeight
        
        const { CELL_SIZE } = gridConfig
        
        // East: expand/shrink right edge
        if (dir.includes('e')) {
          newWidth = Math.max(CELL_SIZE, resizeState.startWidth + dx)
        }
        // West: move left edge (adjusts both position and width)
        if (dir.includes('w')) {
          const change = Math.min(dx, resizeState.startWidth - CELL_SIZE)
          newLeft = resizeState.startLeft + change
          newWidth = resizeState.startWidth - change
        }
        // South: expand/shrink bottom edge
        if (dir.includes('s')) {
          newHeight = Math.max(CELL_SIZE, resizeState.startHeight + dy)
        }
        // North: move top edge (adjusts both position and height)
        if (dir.includes('n')) {
          const change = Math.min(dy, resizeState.startHeight - CELL_SIZE)
          newTop = resizeState.startTop + change
          newHeight = resizeState.startHeight - change
        }
        
        setSelectedBox(prev => prev ? {
          ...prev,
          left: Math.max(0, newLeft),
          top: Math.max(0, newTop),
          width: newWidth,
          height: newHeight,
        } : null)
      }
    }

    // End drag/resize operation when mouse is released
    const handleMouseUp = () => {
      setDragState(null)
      setResizeState(null)
    }

    // Attach global listeners only when drag/resize is active
    if (dragState || resizeState) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      // Cleanup listeners when operation ends
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [dragState, resizeState, setSelectedBox, gridConfig])

  return {
    handleDragStart,
    handleResizeStart,
  }
}