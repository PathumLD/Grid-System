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
  const dispatch = useAppDispatch()
  const boxes = useAppSelector((state) => state.grid.boxes)
  const selectedBoxId = useAppSelector((state) => state.grid.selectedBoxId)
  
  const [gridConfig, setGridConfig] = useState(getGridConfig())
  const [selectedBox, setSelectedBox] = useState<AbsoluteBox | null>(null)

  // Update grid config on window resize
  useEffect(() => {
    const handleResize = () => {
      const newConfig = getGridConfig()
      setGridConfig(newConfig)
      
      // Deselect box on resize to avoid position issues
      if (selectedBox) {
        const snapped = snapToGrid(
          selectedBox.left,
          selectedBox.top,
          selectedBox.width,
          selectedBox.height,
          newConfig
        )
        dispatch(updateBox({ ...selectedBox, ...snapped }))
        setSelectedBox(null)
        dispatch(selectBox(null))
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [selectedBox, dispatch])

  const { handleDragStart, handleResizeStart } = useGridInteractions(
    selectedBox,
    setSelectedBox,
    gridConfig
  )

  const handleBoxClick = (e: React.MouseEvent, box: Box) => {
    e.stopPropagation()
    if (selectedBox?.id === box.id) return
    
    const absoluteBox = {
      ...box,
      ...getAbsolutePosition(box, gridConfig)
    }
    setSelectedBox(absoluteBox)
    dispatch(selectBox(box.id))
  }

  const handleDeselect = () => {
    if (selectedBox) {
      const snapped = snapToGrid(
        selectedBox.left,
        selectedBox.top,
        selectedBox.width,
        selectedBox.height,
        gridConfig
      )
      
      dispatch(updateBox({ ...selectedBox, ...snapped }))
      setSelectedBox(null)
      dispatch(selectBox(null))
    }
  }

  const findEmptySpot = (width: number, height: number): { col: number; row: number } => {
    const gridMap: boolean[][] = []
    const maxRow = Math.max(...boxes.map(b => b.row + b.height), 0)
    
    for (let r = 0; r <= maxRow + 5; r++) {
      gridMap[r] = new Array(gridConfig.COLS).fill(false)
    }
    
    boxes.forEach(box => {
      for (let r = box.row; r < box.row + box.height; r++) {
        for (let c = box.col; c < box.col + box.width; c++) {
          if (gridMap[r] && c < gridConfig.COLS) {
            gridMap[r][c] = true
          }
        }
      }
    })
    
    for (let r = 0; r < gridMap.length; r++) {
      for (let c = 0; c <= gridConfig.COLS - width; c++) {
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
    const width = Math.min(2, gridConfig.COLS)
    const height = 1
    const position = findEmptySpot(width, height)
    
    dispatch(addBox({
      col: position.col,
      row: position.row,
      width: width,
      height: height,
    }))
  }

  const handleDeleteBox = (id: number) => {
    dispatch(deleteBox(id))
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