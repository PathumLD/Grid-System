import React from 'react'

interface GridBackgroundProps {
  maxRow: number
  gridConfig: { COLS: number, CELL_SIZE: number, GAP: number }
}

const GridBackground: React.FC<GridBackgroundProps> = ({ maxRow, gridConfig }) => {
  const { CELL_SIZE, GAP } = gridConfig
  
  return (
    <div 
      className="absolute inset-0 pointer-events-none rounded-lg"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(100, 116, 139, 0.2) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(100, 116, 139, 0.2) 1px, transparent 1px)
        `,
        backgroundSize: `${CELL_SIZE + GAP}px ${CELL_SIZE + GAP}px`,
        backgroundPosition: `${GAP/2}px ${GAP/2}px`,
        width: '100%',
        height: `${maxRow * (CELL_SIZE + GAP) + GAP}px`,
      }}
    />
  )
}

export default GridBackground