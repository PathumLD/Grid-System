import React, { useRef } from 'react'
import { Box, AbsoluteBox } from '../../types/grid'
import GridBackground from './GridBackground'
import GridBox from './GridBox'
import SelectedBox from './SelectedBox'

interface GridContainerProps {
  boxes: Box[]
  selectedBox: AbsoluteBox | null
  onDeselect: () => void
  onBoxClick: (e: React.MouseEvent, box: Box) => void
  onDragStart: (e: React.MouseEvent) => void
  onResizeStart: (e: React.MouseEvent, direction: string) => void
  onDeleteBox: (id: number) => void
  gridConfig: { COLS: number, CELL_SIZE: number, GAP: number }
}

// Main grid container: orchestrates background, boxes, and selected box rendering
const GridContainer: React.FC<GridContainerProps> = ({
  boxes,
  selectedBox,
  onDeselect,
  onBoxClick,
  onDragStart,
  onResizeStart,
  onDeleteBox,
  gridConfig,
}) => {
  const gridRef = useRef<HTMLDivElement>(null)
  const { COLS, CELL_SIZE, GAP } = gridConfig
  
  // Calculate grid height based on lowest box (minimum 5 rows)
  const maxRow = Math.max(...boxes.map(b => b.row + b.height), 5)

  return (
    <div className="w-full flex justify-center">
      <div 
        ref={gridRef}
        className="relative bg-slate-900 rounded-lg p-2 sm:p-3 md:p-4 shadow-2xl"
        style={{
          width: COLS * (CELL_SIZE + GAP) + GAP,        // Grid width based on columns
          minHeight: maxRow * (CELL_SIZE + GAP) + GAP,  // Dynamic height
          maxWidth: '100%',                              // Responsive on small screens
        }}
        onClick={onDeselect}  // Click outside boxes to deselect
      >
        {/* Visual grid lines */}
        <GridBackground maxRow={maxRow} gridConfig={gridConfig} />
        
        {/* Render all non-selected boxes */}
        {boxes
          .filter(b => !selectedBox || b.id !== selectedBox.id)
          .map(box => (
            <GridBox 
              key={box.id} 
              box={box} 
              onClick={onBoxClick}
              onDelete={onDeleteBox}
              gridConfig={gridConfig}
            />
          ))}
        
        {/* Render selected box with resize handles (higher z-index) */}
        {selectedBox && (
          <SelectedBox
            box={selectedBox}
            onDragStart={onDragStart}
            onResizeStart={onResizeStart}
            onDelete={onDeleteBox}
            gridConfig={gridConfig}
          />
        )}
      </div>
    </div>
  )
}

export default GridContainer