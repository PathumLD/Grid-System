import React from 'react'
import { Box } from '../../types/grid'
import { getAbsolutePosition } from '../../utils/gridCalculations'
import { GRID_CONFIG } from '../../types/grid'

const { GAP } = GRID_CONFIG

interface GridBoxProps {
  box: Box
  onClick: (e: React.MouseEvent, box: Box) => void
  onDelete?: (id: number) => void
}

const GridBox: React.FC<GridBoxProps> = ({ box, onClick, onDelete }) => {
  const pos = getAbsolutePosition(box)

  return (
    <div
      className="absolute bg-blue-500 hover:bg-blue-600 rounded-lg cursor-pointer transition-colors flex items-center justify-center text-white font-bold text-2xl border-2 border-blue-400 group"
      style={{
        left: pos.left + GAP/2,
        top: pos.top + GAP/2,
        width: pos.width,
        height: pos.height,
      }}
      onClick={(e) => onClick(e, box)}
    >
      <span>{box.id}</span>
      {onDelete && (
        <button
          className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(box.id)
          }}
        >
          ×
        </button>
      )}
    </div>
  )
}

export default GridBox