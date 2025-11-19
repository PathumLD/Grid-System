import React from 'react'
import { AbsoluteBox } from '../../types/grid'
import { GRID_CONFIG } from '../../types/grid'
import ResizeHandles from './ResizeHandles'

const { GAP } = GRID_CONFIG

interface SelectedBoxProps {
  box: AbsoluteBox
  onDragStart: (e: React.MouseEvent) => void
  onResizeStart: (e: React.MouseEvent, direction: string) => void
  onDelete: (id: number) => void
}

const SelectedBox: React.FC<SelectedBoxProps> = ({ 
  box, 
  onDragStart, 
  onResizeStart,
  onDelete 
}) => {
  return (
    <div
      className="absolute bg-green-500 rounded-lg cursor-move flex items-center justify-center text-white font-bold text-2xl border-4 border-green-300 shadow-2xl"
      style={{
        left: box.left + GAP/2,
        top: box.top + GAP/2,
        width: box.width,
        height: box.height,
        zIndex: 1000,
      }}
      onMouseDown={onDragStart}
    >
      <span>{box.id}</span>
      <button
        className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-sm font-bold"
        onClick={(e) => {
          e.stopPropagation()
          onDelete(box.id)
        }}
      >
        ×
      </button>
      <ResizeHandles onResizeStart={onResizeStart} />
    </div>
  )
}

export default SelectedBox