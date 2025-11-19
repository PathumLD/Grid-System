import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

// Typed version of useDispatch hook for TypeScript autocomplete
export const useAppDispatch = () => useDispatch<AppDispatch>()
// Typed version of useSelector hook for TypeScript autocomplete
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector