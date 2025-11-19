import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import gridReducer from './gridSlice'

const persistConfig = {
  key: 'grid-system',
  storage,
  whitelist: ['boxes', 'nextId'], // Only persist boxes and nextId
}

const persistedReducer = persistReducer(persistConfig, gridReducer)

export const store = configureStore({
  reducer: {
    grid: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch