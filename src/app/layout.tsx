import type { Metadata } from 'next'
import './globals.css'
import ReduxProvider from '../providers/ReduxProvider'

export const metadata: Metadata = {
  title: 'Grid Layout System',
  description: 'Dynamic grid layout with draggable and resizable boxes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  )
}