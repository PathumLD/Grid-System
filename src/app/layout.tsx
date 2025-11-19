import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Grid Layout System',
  description: 'Dynamic grid layout with draggable and resizable boxes',
}


// Root layout: wraps entire Next.js app with HTML structure and global styles
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