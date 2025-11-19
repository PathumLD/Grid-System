import React from 'react'

interface ResizeHandlesProps {
  onResizeStart: (e: React.MouseEvent, direction: string) => void
}

const ResizeHandles: React.FC<ResizeHandlesProps> = ({ onResizeStart }) => {
  const handles = [
    { dir: 'n', pos: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize' },
    { dir: 'ne', pos: 'top-0 right-0 -translate-y-1/2 translate-x-1/2 cursor-nesw-resize' },
    { dir: 'e', pos: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2 cursor-ew-resize' },
    { dir: 'se', pos: 'bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-nwse-resize' },
    { dir: 's', pos: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-ns-resize' },
    { dir: 'sw', pos: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-nesw-resize' },
    { dir: 'w', pos: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize' },
    { dir: 'nw', pos: 'top-0 left-0 -translate-x-1/2 -translate-y-1/2 cursor-nwse-resize' },
  ]

  return (
    <>
      {handles.map(({ dir, pos }) => (
        <div
          key={dir}
          className={`absolute w-3 h-3 sm:w-4 sm:h-4 bg-white border-2 border-green-600 rounded-full ${pos} hover:scale-125 transition-transform`}
          onMouseDown={(e) => onResizeStart(e, dir)}
        />
      ))}
    </>
  )
}

export default ResizeHandles