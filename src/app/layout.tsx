import type { Metadata } from 'next'
import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}