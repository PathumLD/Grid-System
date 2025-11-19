import React from 'react'
import { Box } from '../../types/grid'

interface GridStateProps {
  boxes: Box[]
}

// Debug panel: displays all box properties in real-time
const GridState: React.FC<GridStateProps> = ({ boxes }) => {
  return (
    <div className="mt-4 md:mt-6 text-white bg-slate-900 rounded-lg p-3 sm:p-4 shadow-lg">
      <h3 className="font-bold mb-2 text-sm sm:text-base">
        Grid State ({boxes.length} boxes):
      </h3>
      <div className="text-xs sm:text-sm text-slate-300 font-mono space-y-1">
        {boxes.map(b => (
          <div key={b.id} className="break-all">
            Box {b.id}: col={b.col}, row={b.row}, width={b.width}, height={b.height}
          </div>
        ))}
      </div>
    </div>
  )
}

export default GridState