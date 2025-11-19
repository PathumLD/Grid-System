import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Box } from '../types/grid'

interface GridState {
  boxes: Box[]
  nextId: number
  selectedBoxId: number | null
}

const initialState: GridState = {
  boxes: [
    { id: 1, col: 0, row: 0, width: 2, height: 1 },
    { id: 2, col: 3, row: 0, width: 3, height: 2 },
    { id: 3, col: 0, row: 2, width: 2, height: 2 },
    { id: 4, col: 7, row: 1, width: 2, height: 1 },
  ],
  nextId: 5,
  selectedBoxId: null,
}

// Helper function to find the next available ID
const getNextAvailableId = (boxes: Box[], currentNextId: number): number => {
  // Get all existing IDs
  const existingIds = new Set(boxes.map(box => box.id))
  
  // Find the smallest available ID starting from 1
  for (let id = 1; id < currentNextId; id++) {
    if (!existingIds.has(id)) {
      return id
    }
  }
  
  // If no gaps found, use the current nextId
  return currentNextId
}

const gridSlice = createSlice({
  name: 'grid',
  initialState,
  reducers: {
    addBox: (state, action: PayloadAction<Omit<Box, 'id'>>) => {
      // Find the next available ID (reuse deleted IDs)
      const newId = getNextAvailableId(state.boxes, state.nextId)
      
      const newBox: Box = {
        ...action.payload,
        id: newId,
      }
      
      state.boxes.push(newBox)
      
      // Only increment nextId if we used it (no gaps were found)
      if (newId === state.nextId) {
        state.nextId += 1
      }
    },
    
    deleteBox: (state, action: PayloadAction<number>) => {
      state.boxes = state.boxes.filter(box => box.id !== action.payload)
      
      // If the deleted box ID was the highest, adjust nextId
      const maxId = state.boxes.length > 0 
        ? Math.max(...state.boxes.map(box => box.id))
        : 0
      
      // Set nextId to be one more than the highest existing ID
      state.nextId = maxId + 1
      
      if (state.selectedBoxId === action.payload) {
        state.selectedBoxId = null
      }
    },
    
    updateBox: (state, action: PayloadAction<Box>) => {
      const index = state.boxes.findIndex(box => box.id === action.payload.id)
      if (index !== -1) {
        state.boxes[index] = action.payload
      }
    },
    
    selectBox: (state, action: PayloadAction<number | null>) => {
      state.selectedBoxId = action.payload
    },
    
    clearAllBoxes: (state) => {
      state.boxes = []
      state.nextId = 1
      state.selectedBoxId = null
    },
    
    resetToDefault: () => initialState,
  },
})

export const {
  addBox,
  deleteBox,
  updateBox,
  selectBox,
  clearAllBoxes,
  resetToDefault,
} = gridSlice.actions

export default gridSlice.reducer