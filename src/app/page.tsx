'use client'

import React, { useState, useEffect } from 'react'
import { AbsoluteBox, Box, getGridConfig } from '../types/grid'
import { getAbsolutePosition, snapToGrid } from '../utils/gridCalculations'
import { useGridInteractions } from '../hooks/useGridInteractions'
import GridContainer from '../components/Grid/GridContainer'
import Toolbar from '../components/Toolbar/Toolbar'
import GridState from '../components/GridState/GridState'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addBox, deleteBox, updateBox, selectBox } from '../store/gridSlice'

export default function Home() {
  // Redux state and dispatch
  const dispatch = useAppDispatch()
  const boxes = useAppSelector((state) => state.grid.boxes) // All boxes from Redux store
  const selectedBoxId = useAppSelector((state) => state.grid.selectedBoxId)
  
  // Local state for responsive grid configuration
  const [gridConfig, setGridConfig] = useState(getGridConfig())
  // Local state for currently selected box with absolute pixel positions (for smooth drag/resize)
  const [selectedBox, setSelectedBox] = useState<AbsoluteBox | null>(null)

  // Update grid config on window resize
  useEffect(() => {
    const handleResize = () => {
      // Recalculate grid configuration based on new window size
      const newConfig = getGridConfig()
      setGridConfig(newConfig)
      
      // Deselect and snap box to new grid to avoid position issues
      if (selectedBox) {
        // Snap the box to the new grid configuration
        const snapped = snapToGrid(
          selectedBox.left,
          selectedBox.top,
          selectedBox.width,
          selectedBox.height,
          newConfig
        )
        // Update box in Redux store with new snapped position
        dispatch(updateBox({ ...selectedBox, ...snapped }))
        // Clear local selection state
        setSelectedBox(null)
        dispatch(selectBox(null))
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [selectedBox, dispatch])

  // Custom hook that handles drag and resize mouse interactions
  const { handleDragStart, handleResizeStart } = useGridInteractions(
    selectedBox,
    setSelectedBox,
    gridConfig
  )

  // Handle box selection when clicked
  const handleBoxClick = (e: React.MouseEvent, box: Box) => {
    e.stopPropagation() // Prevent grid deselect from triggering
    if (selectedBox?.id === box.id) return // Already selected
    
    // Convert grid coordinates to absolute pixel positions for smooth dragging
    const absoluteBox = {
      ...box,
      ...getAbsolutePosition(box, gridConfig)
    }
    setSelectedBox(absoluteBox) // Set local state for rendering
    dispatch(selectBox(box.id)) // Update Redux store
  }

  // Deselect box and snap it to the nearest grid cells
  const handleDeselect = () => {
    if (selectedBox) {
      // Convert absolute pixel positions back to grid coordinates
      const snapped = snapToGrid(
        selectedBox.left,
        selectedBox.top,
        selectedBox.width,
        selectedBox.height,
        gridConfig
      )
      
      // Save snapped position to Redux store
      dispatch(updateBox({ ...selectedBox, ...snapped }))
      // Clear selection
      setSelectedBox(null)
      dispatch(selectBox(null))
    }
  }

  // Find the first available empty spot on the grid for a new box
  const findEmptySpot = (width: number, height: number): { col: number; row: number } => {
    // Create a 2D map to track occupied cells
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
    
    // Scan grid from top-left to find first spot that fits the box dimensions
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
    
    // No empty spot found, place at bottom
    return { col: 0, row: maxRow + 1 }
  }

  // Add a new box to the grid at the first available empty spot
  const handleAddBox = () => {
    const width = Math.min(2, gridConfig.COLS) // 2 cells wide, or less if grid is narrow
    const height = 1 // 1 cell tall
    const position = findEmptySpot(width, height)
    
    // Dispatch action to add box to Redux store
    dispatch(addBox({
      col: position.col,
      row: position.row,
      width: width,
      height: height,
    }))
  }

  // Delete a box from the grid
  const handleDeleteBox = (id: number) => {
    dispatch(deleteBox(id)) // Remove from Redux store
    // Clear selection if deleted box was selected
    if (selectedBox?.id === id) {
      setSelectedBox(null)
    }
  }

  return (
    <div className="min-h-screen p-3 bg-slate-950 sm:p-4 md:p-6 lg:p-8">
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