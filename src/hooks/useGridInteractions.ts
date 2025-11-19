import { useState, useEffect } from 'react'
import { AbsoluteBox, DragState, ResizeState } from '../types/grid'

export const useGridInteractions = (
  selectedBox: AbsoluteBox | null,
  setSelectedBox: React.Dispatch<React.SetStateAction<AbsoluteBox | null>>,
  gridConfig: { COLS: number, CELL_SIZE: number, GAP: number }
) => {
  const [dragState, setDragState] = useState<DragState | null>(null)
  const [resizeState, setResizeState] = useState<ResizeState | null>(null)

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragState) {
        const dx = e.clientX - dragState.startX
        const dy = e.clientY - dragState.startY
        
        setSelectedBox(prev => prev ? {
          ...prev,
          left: Math.max(0, dragState.startLeft + dx),
          top: Math.max(0, dragState.startTop + dy),
        } : null)
      }
      
      if (resizeState) {
        const dx = e.clientX - resizeState.startX
        const dy = e.clientY - resizeState.startY
        const dir = resizeState.direction
        
        let newLeft = resizeState.startLeft
        let newTop = resizeState.startTop
        let newWidth = resizeState.startWidth
        let newHeight = resizeState.startHeight
        
        const { CELL_SIZE } = gridConfig
        
        if (dir.includes('e')) {
          newWidth = Math.max(CELL_SIZE, resizeState.startWidth + dx)
        }
        if (dir.includes('w')) {
          const change = Math.min(dx, resizeState.startWidth - CELL_SIZE)
          newLeft = resizeState.startLeft + change
          newWidth = resizeState.startWidth - change
        }
        if (dir.includes('s')) {
          newHeight = Math.max(CELL_SIZE, resizeState.startHeight + dy)
        }
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

    const handleMouseUp = () => {
      setDragState(null)
      setResizeState(null)
    }

    if (dragState || resizeState) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
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