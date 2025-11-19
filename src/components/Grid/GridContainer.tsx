import React, { useRef } from 'react'
import { Box, AbsoluteBox } from '../../types/grid'
import { GRID_CONFIG } from '../../types/grid'
import GridBackground from './GridBackground'
import GridBox from './GridBox'
import SelectedBox from './SelectedBox'

const { COLS, CELL_SIZE, GAP } = GRID_CONFIG

interface GridContainerProps {
  boxes: Box[]
  selectedBox: AbsoluteBox | null
  onDeselect: () => void
  onBoxClick: (e: React.MouseEvent, box: Box) => void
  onDragStart: (e: React.MouseEvent) => void
  onResizeStart: (e: React.MouseEvent, direction: string) => void
  onDeleteBox: (id: number) => void
}

const GridContainer: React.FC<GridContainerProps> = ({
  boxes,
  selectedBox,
  onDeselect,
  onBoxClick,
  onDragStart,
  onResizeStart,
  onDeleteBox,
}) => {
  const gridRef = useRef<HTMLDivElement>(null)
  const maxRow = Math.max(...boxes.map(b => b.row + b.height), 5)

  return (
    <div 
      ref={gridRef}
      className="relative bg-gray-800 rounded-lg p-4"
      style={{
        width: COLS * (CELL_SIZE + GAP) + GAP,
        minHeight: maxRow * (CELL_SIZE + GAP) + GAP,
      }}
      onClick={onDeselect}
    >
      <GridBackground maxRow={maxRow} />
      
      {boxes
        .filter(b => !selectedBox || b.id !== selectedBox.id)
        .map(box => (
          <GridBox 
            key={box.id} 
            box={box} 
            onClick={onBoxClick}
            onDelete={onDeleteBox}
          />
        ))}
      
      {selectedBox && (
        <SelectedBox
          box={selectedBox}
          onDragStart={onDragStart}
          onResizeStart={onResizeStart}
          onDelete={onDeleteBox}
        />
      )}
    </div>
  )
}

export default GridContainer