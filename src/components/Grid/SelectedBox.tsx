import React from 'react'
import { AbsoluteBox } from '../../types/grid'
import ResizeHandles from './ResizeHandles'

interface SelectedBoxProps {
  box: AbsoluteBox
  onDragStart: (e: React.MouseEvent) => void
  onResizeStart: (e: React.MouseEvent, direction: string) => void
  onDelete: (id: number) => void
  gridConfig: { COLS: number, CELL_SIZE: number, GAP: number }
}

// Renders the selected box with distinct styling, resize handles, and drag capability
const SelectedBox: React.FC<SelectedBoxProps> = ({ 
  box, 
  onDragStart, 
  onResizeStart,
  onDelete,
  gridConfig
}) => {
  const { GAP } = gridConfig
  
  return (
    <div
      className="absolute bg-blue-300 rounded-md sm:rounded-lg cursor-move flex items-center justify-center text-white font-bold text-xl sm:text-2xl border-2 sm:border-4 border-blue-700 shadow-2xl"
      style={{
        left: box.left + GAP/2,   // Uses absolute pixel position (not snapped)
        top: box.top + GAP/2,
        width: box.width,
        height: box.height,
        zIndex: 1000,             // Always render above other boxes
      }}
      onMouseDown={onDragStart}   // Clicking anywhere on box starts drag
    >
      <span>{box.id}</span>
      {/* Always visible delete button for selected box */}
      <button
        className="absolute top-1 right-1 sm:top-2 sm:right-2 w-6 h-6 sm:w-7 sm:h-7 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-sm font-bold shadow-lg"
        onClick={(e) => {
          e.stopPropagation()  // Prevent drag from starting
          onDelete(box.id)
        }}
      >
        ×
      </button>
      {/* 8 resize handles at corners and edges */}
      <ResizeHandles onResizeStart={onResizeStart} />
    </div>
  )
}

export default SelectedBox