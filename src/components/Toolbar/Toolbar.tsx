import React from 'react'

interface ToolbarProps {
  onAddBox: () => void
}

const Toolbar: React.FC<ToolbarProps> = ({ onAddBox }) => {
  return (
    <div className="mb-4 md:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="text-white">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">
          Dynamic Grid Layout System
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Click a box to select it. Drag to move, use handles to resize. Click outside to snap to grid.
        </p>
      </div>
      <button
        onClick={onAddBox}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap flex-shrink-0"
      >
        <span className="text-lg sm:text-xl">+</span>
        <span className="text-sm sm:text-base">Add Box</span>
      </button>
    </div>
  )
}

export default Toolbar