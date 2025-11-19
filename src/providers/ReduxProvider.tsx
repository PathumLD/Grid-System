'use client'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '../store/store'

// Wrapper component that provides Redux store and persistence to the app
export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Provider store={store}>
      {/* PersistGate delays rendering until persisted state is loaded from localStorage */}
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}