import type { Metadata } from 'next'
import './globals.css'
import ReduxProvider from '../providers/ReduxProvider'

// Metadata for the page (appears in browser tab and search results)
export const metadata: Metadata = {
  title: 'Grid Layout System',
  description: 'Dynamic grid layout with draggable and resizable boxes',
}

// Root layout component that wraps all pages
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* Wrap app with Redux provider for state management */}
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  )
}