'use client'

import React, { useState } from 'react'
import { Box, AbsoluteBox } from '../types/grid'
import { getAbsolutePosition, snapToGrid } from '../utils/gridCalculations'
import { useGridInteractions } from '../hooks/useGridInteractions'
import GridContainer from '../components/Grid/GridContainer'
import Toolbar from '../components/Toolbar/Toolbar'
import GridState from '../components/GridState/GridState'
import { GRID_CONFIG } from '../types/grid'

const { COLS } = GRID_CONFIG

export default function Home() {
  const [boxes, setBoxes] = useState<Box[]>([
    { id: 1, col: 0, row: 0, width: 2, height: 1 },
    { id: 2, col: 3, row: 0, width: 3, height: 2 },
    { id: 3, col: 0, row: 2, width: 2, height: 2 },
    { id: 4, col: 7, row: 1, width: 2, height: 1 },
  ])
  
  const [selectedBox, setSelectedBox] = useState<AbsoluteBox | null>(null)
  const [nextId, setNextId] = useState(5)

  const { handleDragStart, handleResizeStart } = useGridInteractions(
    selectedBox,
    setSelectedBox
  )

  const handleBoxClick = (e: React.MouseEvent, box: Box) => {
    e.stopPropagation()
    if (selectedBox?.id === box.id) return
    
    setSelectedBox({
      ...box,
      ...getAbsolutePosition(box)
    })
  }

  const handleDeselect = () => {
    if (selectedBox) {
      const snapped = snapToGrid(
        selectedBox.left,
        selectedBox.top,
        selectedBox.width,
        selectedBox.height
      )
      
      setBoxes(boxes.map(b => 
        b.id === selectedBox.id 
          ? { ...b, ...snapped }
          : b
      ))
      
      setSelectedBox(null)
    }
  }

  const findEmptySpot = (width: number, height: number): { col: number; row: number } => {
    const gridMap: boolean[][] = []
    const maxRow = Math.max(...boxes.map(b => b.row + b.height), 0)
    
    for (let r = 0; r <= maxRow + 5; r++) {
      gridMap[r] = new Array(COLS).fill(false)
    }
    
    boxes.forEach(box => {
      for (let r = box.row; r < box.row + box.height; r++) {
        for (let c = box.col; c < box.col + box.width; c++) {
          if (gridMap[r] && c < COLS) {
            gridMap[r][c] = true
          }
        }
      }
    })
    
    for (let r = 0; r < gridMap.length; r++) {
      for (let c = 0; c <= COLS - width; c++) {
        let fits = true
        
        for (let dr = 0; dr < height && fits; dr++) {
          for (let dc = 0; dc < width && fits; dc++) {
            if (r + dr >= gridMap.length || gridMap[r + dr][c + dc]) {
              fits = false
            }
          }
        }
        
        if (fits) {
          return { col: c, row: r }
        }
      }
    }
    
    return { col: 0, row: maxRow + 1 }
  }

  const handleAddBox = () => {
    const width = 2
    const height = 1
    const position = findEmptySpot(width, height)
    
    const newBox: Box = {
      id: nextId,
      col: position.col,
      row: position.row,
      width: width,
      height: height,
    }
    
    setBoxes([...boxes, newBox])
    setNextId(nextId + 1)
  }

  const handleDeleteBox = (id: number) => {
    setBoxes(boxes.filter(b => b.id !== id))
    if (selectedBox?.id === id) {
      setSelectedBox(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <Toolbar onAddBox={handleAddBox} />
        
        <GridContainer
          boxes={boxes}
          selectedBox={selectedBox}
          onDeselect={handleDeselect}
          onBoxClick={handleBoxClick}
          onDragStart={handleDragStart}
          onResizeStart={handleResizeStart}
          onDeleteBox={handleDeleteBox}
        />
        
        <GridState boxes={boxes} />
      </div>
    </div>
  )
}