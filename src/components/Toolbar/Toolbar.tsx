import React from 'react'

interface ToolbarProps {
  onAddBox: () => void
}

const Toolbar: React.FC<ToolbarProps> = ({ onAddBox }) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="text-white">
        <h1 className="text-3xl font-bold mb-2">Dynamic Grid Layout System</h1>
        <p className="text-gray-400">
          Click a box to select it. Drag to move, use handles to resize. Click outside to snap to grid.
        </p>
      </div>
      <button
        onClick={onAddBox}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
      >
        <span className="text-xl">+</span>
        Add Box
      </button>
    </div>
  )
}

export default Toolbar