import React from 'react'
import { GRID_CONFIG } from '../../types/grid'

const { CELL_SIZE, GAP } = GRID_CONFIG

interface GridBackgroundProps {
  maxRow: number
}

const GridBackground: React.FC<GridBackgroundProps> = ({ maxRow }) => {
  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(75, 85, 99, 0.3) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(75, 85, 99, 0.3) 1px, transparent 1px)
        `,
        backgroundSize: `${CELL_SIZE + GAP}px ${CELL_SIZE + GAP}px`,
        backgroundPosition: `${GAP/2}px ${GAP/2}px`,
      }}
    />
  )
}

export default GridBackground