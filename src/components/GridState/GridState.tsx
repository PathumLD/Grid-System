import React from 'react'
import { Box } from '../../types/grid'

interface GridStateProps {
  boxes: Box[]
}

const GridState: React.FC<GridStateProps> = ({ boxes }) => {
  return (
    <div className="mt-6 text-white bg-gray-800 rounded-lg p-4">
      <h3 className="font-bold mb-2">Grid State ({boxes.length} boxes):</h3>
      <div className="text-sm text-gray-300 font-mono">
        {boxes.map(b => (
          <div key={b.id}>
            Box {b.id}: col={b.col}, row={b.row}, width={b.width}, height={b.height}
          </div>
        ))}
      </div>
    </div>
  )
}

export default GridState