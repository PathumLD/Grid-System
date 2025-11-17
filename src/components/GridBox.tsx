'use client';

import React from 'react';
import { Box } from '../types/grid';
import { gridToPixels } from '../utils/gridUtils';

interface GridBoxProps {
  box: Box;
  isSelected: boolean;
  onClick: (box: Box, e: React.MouseEvent) => void;
  cellSize: number;
}

export const GridBox: React.FC<GridBoxProps> = ({ box, isSelected, onClick, cellSize }) => {
  if (isSelected) return null;
  
  const pixels = gridToPixels(box.col, box.row, box.width, box.height, cellSize);
  
  return (
    <div
      onClick={(e) => onClick(box, e)}
      className="absolute transition-all cursor-pointer hover:opacity-90"
      style={{
        left: pixels.x,
        top: pixels.y,
        width: pixels.width,
        height: pixels.height,
        backgroundColor: box.color,
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
      }}
    >
      <div className="flex items-center justify-center h-full text-sm font-semibold text-white md:text-base">
        Box {box.id}
      </div>
    </div>
  );
};