import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Box } from '../types/grid'

// Redux state shape for the grid system
interface GridState {
  boxes: Box[] // All boxes on the grid
  nextId: number // Next available ID for new boxes
  selectedBoxId: number | null // Currently selected box ID
}

// Initial state with some demo boxes
const initialState: GridState = {
  boxes: [
    { id: 1, col: 0, row: 0, width: 2, height: 1 },
    { id: 2, col: 3, row: 0, width: 3, height: 2 },
    { id: 3, col: 0, row: 2, width: 2, height: 2 },
    { id: 4, col: 7, row: 1, width: 2, height: 1 },
  ],
  nextId: 5, // Next box will have ID 5
  selectedBoxId: null,
}

// Helper function to find the next available ID (reuses deleted IDs to keep numbers low)
const getNextAvailableId = (boxes: Box[], currentNextId: number): number => {
  // Get all existing IDs in a Set for fast lookup
  const existingIds = new Set(boxes.map(box => box.id))
  
  // Find the smallest available ID starting from 1 (fills gaps from deleted boxes)
  for (let id = 1; id < currentNextId; id++) {
    if (!existingIds.has(id)) {
      return id // Found a gap, reuse this ID
    }
  }
  
  // If no gaps found, use the current nextId
  return currentNextId
}

const gridSlice = createSlice({
  name: 'grid',
  initialState,
  reducers: {
    // Add a new box to the grid
    addBox: (state, action: PayloadAction<Omit<Box, 'id'>>) => {
      // Find the next available ID (reuse deleted IDs to keep numbers low)
      const newId = getNextAvailableId(state.boxes, state.nextId)
      
      // Create new box with generated ID
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
    
    // Delete a box from the grid
    deleteBox: (state, action: PayloadAction<number>) => {
      state.boxes = state.boxes.filter(box => box.id !== action.payload)
      
      // Adjust nextId to be one more than the highest existing ID
      const maxId = state.boxes.length > 0 
        ? Math.max(...state.boxes.map(box => box.id))
        : 0
      
      // Set nextId to be one more than the highest existing ID
      state.nextId = maxId + 1
      
      // Clear selection if deleted box was selected
      if (state.selectedBoxId === action.payload) {
        state.selectedBoxId = null
      }
    },
    
    // Update an existing box's properties (position, size)
    updateBox: (state, action: PayloadAction<Box>) => {
      const index = state.boxes.findIndex(box => box.id === action.payload.id)
      if (index !== -1) {
        state.boxes[index] = action.payload // Replace entire box object
      }
    },
    
    // Set the currently selected box ID
    selectBox: (state, action: PayloadAction<number | null>) => {
      state.selectedBoxId = action.payload
    },
    
    // Remove all boxes from the grid
    clearAllBoxes: (state) => {
      state.boxes = []
      state.nextId = 1 // Reset ID counter
      state.selectedBoxId = null
    },
    
    // Reset to initial demo state
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