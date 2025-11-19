import React from 'react'
import { Box } from '../../types/grid'
import { getAbsolutePosition } from '../../utils/gridCalculations'

interface GridBoxProps {
  box: Box
  onClick: (e: React.MouseEvent, box: Box) => void
  onDelete?: (id: number) => void
  gridConfig: { COLS: number, CELL_SIZE: number, GAP: number }
}

const GridBox: React.FC<GridBoxProps> = ({ box, onClick, onDelete, gridConfig }) => {
  const pos = getAbsolutePosition(box, gridConfig)
  const { GAP } = gridConfig

  return (
    <div
      className="absolute bg-blue-500 hover:bg-blue-600 rounded-md sm:rounded-lg cursor-pointer transition-colors flex items-center justify-center text-white font-bold text-xl sm:text-2xl border-2 border-blue-400 group"
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
          className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs sm:text-sm"
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