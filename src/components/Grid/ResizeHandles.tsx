import React from 'react'

interface ResizeHandlesProps {
  onResizeStart: (e: React.MouseEvent, direction: string) => void
}

// Renders 8 resize handles (corners + edges) for the selected box
const ResizeHandles: React.FC<ResizeHandlesProps> = ({ onResizeStart }) => {
  // Define all 8 handle positions and cursor styles
  const handles = [
    { dir: 'n', pos: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize' },      // North (top)
    { dir: 'ne', pos: 'top-0 right-0 -translate-y-1/2 translate-x-1/2 cursor-nesw-resize' },    // Northeast (top-right)
    { dir: 'e', pos: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2 cursor-ew-resize' },     // East (right)
    { dir: 'se', pos: 'bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize' },  // Southeast (bottom-right)
    { dir: 's', pos: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-ns-resize' },   // South (bottom)
    { dir: 'sw', pos: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize' },  // Southwest (bottom-left)
    { dir: 'w', pos: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize' },     // West (left)
    { dir: 'nw', pos: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize' },    // Northwest (top-left)
  ]

  return (
    <>
      {handles.map(({ dir, pos }) => (
        <div
          key={dir}
          className={`absolute w-1 h-1 sm:w-3 sm:h-3 bg-white border-1 border-green-700 rounded-full ${pos} hover:scale-125 transition-transform`}
          onMouseDown={(e) => onResizeStart(e, dir)}  // Initiate resize in this direction
        />
      ))}
    </>
  )
}

export default ResizeHandles