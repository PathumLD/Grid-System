'use client';

import React from 'react';
import { Box } from '../types/grid';
import { gridToPixels } from '../utils/gridUtils';
interface GridBoxProps {
  box: Box;
  isSelected: boolean;
  onClick: (box: Box, e: React.MouseEvent) => void;
}

export const GridBox: React.FC<GridBoxProps> = ({ box, isSelected, onClick }) => {
  if (isSelected) return null;
  
  const pixels = gridToPixels(box.col, box.row, box.width, box.height);
  
  return (
    <div
      onClick={(e) => onClick(box, e)}
      className="absolute cursor-pointer transition-all hover:opacity-90"
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
      <div className="flex items-center justify-center h-full text-white font-semibold">
        Box {box.id}
      </div>
    </div>
  );
};