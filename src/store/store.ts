import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // Uses localStorage
import gridReducer from './gridSlice'

// Configuration for redux-persist (saves state to localStorage)
const persistConfig = {
  key: 'grid-system', // Key in localStorage
  storage,
  whitelist: ['boxes', 'nextId'], // Only persist boxes and nextId (not selectedBoxId)
}

// Wrap reducer with persistence capabilities
const persistedReducer = persistReducer(persistConfig, gridReducer)

// Create Redux store with persisted reducer
export const store = configureStore({
  reducer: {
    grid: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions in serialization check
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

// Create persistor for PersistGate component
export const persistor = persistStore(store)

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch