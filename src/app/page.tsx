'use client'

import React, { useState, useEffect } from 'react'
import { Box, AbsoluteBox, getGridConfig } from '../types/grid'
import { getAbsolutePosition, snapToGrid } from '../utils/gridCalculations'
import { useGridInteractions } from '../hooks/useGridInteractions'
import GridContainer from '../components/Grid/GridContainer'
import Toolbar from '../components/Toolbar/Toolbar'
import GridState from '../components/GridState/GridState'

// The main component for the grid layout application.
export default function Home() {
  // Grid configuration: determines number of columns, cell size, and gap based on screen size
  const [gridConfig, setGridConfig] = useState(getGridConfig())
  
  // Array of all boxes with their grid positions (col, row) and dimensions (width, height)
  const [boxes, setBoxes] = useState<Box[]>([
    { id: 1, col: 0, row: 0, width: 2, height: 1 },
    { id: 2, col: 3, row: 0, width: 3, height: 2 },
    { id: 3, col: 0, row: 2, width: 2, height: 2 },
    { id: 4, col: 7, row: 1, width: 2, height: 1 },
  ])
  
  // Currently selected box with absolute pixel positions for smooth dragging/resizing
  const [selectedBox, setSelectedBox] = useState<AbsoluteBox | null>(null)
  
  // Auto-incrementing ID counter for new boxes
  const [nextId, setNextId] = useState(5)

  // Recalculate grid layout when window is resized (mobile/tablet/desktop breakpoints)
  useEffect(() => {
    const handleResize = () => {
      const newConfig = getGridConfig()
      setGridConfig(newConfig)
      
      // Snap selected box to new grid and deselect to prevent positioning errors
      if (selectedBox) {
        const snapped = snapToGrid(
          selectedBox.left,
          selectedBox.top,
          selectedBox.width,
          selectedBox.height,
          newConfig
        )
        setBoxes(boxes.map(b => 
          b.id === selectedBox.id 
            ? { ...b, ...snapped }
            : b
        ))
        setSelectedBox(null)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [selectedBox, boxes])

  // Hook that manages mouse events for dragging and resizing boxes
  const { handleDragStart, handleResizeStart } = useGridInteractions(
    selectedBox,
    setSelectedBox,
    gridConfig
  )

  // Select a box: converts grid coordinates to absolute pixels for smooth interactions
  const handleBoxClick = (e: React.MouseEvent, box: Box) => {
    e.stopPropagation()
    if (selectedBox?.id === box.id) return
    
    setSelectedBox({
      ...box,
      ...getAbsolutePosition(box, gridConfig)
    })
  }

  // Deselect box: snaps absolute pixel position back to nearest grid cells
  const handleDeselect = () => {
    if (selectedBox) {
      const snapped = snapToGrid(
        selectedBox.left,
        selectedBox.top,
        selectedBox.width,
        selectedBox.height,
        gridConfig
      )
      
      setBoxes(boxes.map(b => 
        b.id === selectedBox.id 
          ? { ...b, ...snapped }
          : b
      ))
      
      setSelectedBox(null)
    }
  }

  // Algorithm to find first available empty space that fits the new box dimensions
  const findEmptySpot = (width: number, height: number): { col: number; row: number } => {
    // Create 2D boolean map of occupied cells
    const gridMap: boolean[][] = []
    const maxRow = Math.max(...boxes.map(b => b.row + b.height), 0)
    
    // Initialize grid map with extra rows for new boxes
    for (let r = 0; r <= maxRow + 5; r++) {
      gridMap[r] = new Array(gridConfig.COLS).fill(false)
    }
    
    // Mark all occupied cells as true
    boxes.forEach(box => {
      for (let r = box.row; r < box.row + box.height; r++) {
        for (let c = box.col; c < box.col + box.width; c++) {
          if (gridMap[r] && c < gridConfig.COLS) {
            gridMap[r][c] = true
          }
        }
      }
    })
    
    // Scan grid top-to-bottom, left-to-right for first fit
    for (let r = 0; r < gridMap.length; r++) {
      for (let c = 0; c <= gridConfig.COLS - width; c++) {
        let fits = true
        
        // Check if box fits at this position
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
    
    // No space found: place at bottom
    return { col: 0, row: maxRow + 1 }
  }

  // Create new 2x1 box at first available empty position
  const handleAddBox = () => {
    const width = Math.min(2, gridConfig.COLS)
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

  // Remove box from grid and clear selection if it was selected
  const handleDeleteBox = (id: number) => {
    setBoxes(boxes.filter(b => b.id !== id))
    if (selectedBox?.id === id) {
      setSelectedBox(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-full mx-auto">
        <Toolbar onAddBox={handleAddBox} />
        
        <div className="grid-scroll-container">
          <GridContainer
            boxes={boxes}
            selectedBox={selectedBox}
            onDeselect={handleDeselect}
            onBoxClick={handleBoxClick}
            onDragStart={handleDragStart}
            onResizeStart={handleResizeStart}
            onDeleteBox={handleDeleteBox}
            gridConfig={gridConfig}
          />
        </div>
        
        <GridState boxes={boxes} />
      </div>
    </div>
  )
}