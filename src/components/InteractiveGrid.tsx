
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { GridBox } from './GridBox';
import { Box, AbsoluteBox, DragState, ResizeState } from '../types/grid';
import { GRID_COLUMNS, CELL_SIZE, GAP, gridToPixels, pixelsToGrid } from '../utils/gridUtils';

const INITIAL_BOXES: Box[] = [
  { id: 1, col: 0, row: 0, width: 2, height: 1, color: '#3b82f6' },
  { id: 2, col: 2, row: 0, width: 3, height: 2, color: '#ec4899' },
  { id: 3, col: 5, row: 0, width: 1, height: 1, color: '#10b981' },
  { id: 4, col: 0, row: 1, width: 2, height: 1, color: '#f59e0b' },
];

export const InteractiveGrid: React.FC = () => {
  const [boxes, setBoxes] = useState<Box[]>(INITIAL_BOXES);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [absoluteBox, setAbsoluteBox] = useState<AbsoluteBox | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [resizeState, setResizeState] = useState<ResizeState | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleBoxClick = (box: Box, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedBox === box.id) return;
    
    const pixels = gridToPixels(box.col, box.row, box.width, box.height);
    setSelectedBox(box.id);
    setAbsoluteBox({ ...box, ...pixels });
  };

  const handleDeselect = () => {
    if (selectedBox && absoluteBox) {
      const gridPos = pixelsToGrid(
        absoluteBox.x,
        absoluteBox.y,
        absoluteBox.width,
        absoluteBox.height
      );
      
      setBoxes(boxes.map(b => 
        b.id === selectedBox 
          ? { ...b, ...gridPos }
          : b
      ));
      
      setSelectedBox(null);
      setAbsoluteBox(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent, type: 'drag' | 'resize', handle?: string) => {
    e.stopPropagation();
    if (!absoluteBox) return;

    const startX = e.clientX;
    const startY = e.clientY;

    if (type === 'drag') {
      setDragState({
        startX,
        startY,
        initialX: absoluteBox.x,
        initialY: absoluteBox.y,
      });
    } else if (type === 'resize' && handle) {
      setResizeState({
        startX,
        startY,
        initialWidth: absoluteBox.width,
        initialHeight: absoluteBox.height,
        initialX: absoluteBox.x,
        initialY: absoluteBox.y,
        handle,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragState) {
        const deltaX = e.clientX - dragState.startX;
        const deltaY = e.clientY - dragState.startY;
        
        setAbsoluteBox(prev => prev ? ({
          ...prev,
          x: Math.max(0, dragState.initialX + deltaX),
          y: Math.max(0, dragState.initialY + deltaY),
        }) : null);
      } else if (resizeState) {
        const deltaX = e.clientX - resizeState.startX;
        const deltaY = e.clientY - resizeState.startY;
        
        let newWidth = resizeState.initialWidth;
        let newHeight = resizeState.initialHeight;
        let newX = resizeState.initialX;
        let newY = resizeState.initialY;

        if (resizeState.handle.includes('e')) {
          newWidth = Math.max(CELL_SIZE, resizeState.initialWidth + deltaX);
        }
        if (resizeState.handle.includes('w')) {
          newWidth = Math.max(CELL_SIZE, resizeState.initialWidth - deltaX);
          newX = resizeState.initialX + deltaX;
          if (newWidth === CELL_SIZE) newX = resizeState.initialX + resizeState.initialWidth - CELL_SIZE;
        }
        if (resizeState.handle.includes('s')) {
          newHeight = Math.max(CELL_SIZE, resizeState.initialHeight + deltaY);
        }
        if (resizeState.handle.includes('n')) {
          newHeight = Math.max(CELL_SIZE, resizeState.initialHeight - deltaY);
          newY = resizeState.initialY + deltaY;
          if (newHeight === CELL_SIZE) newY = resizeState.initialY + resizeState.initialHeight - CELL_SIZE;
        }

        setAbsoluteBox(prev => prev ? ({
          ...prev,
          x: Math.max(0, newX),
          y: Math.max(0, newY),
          width: newWidth,
          height: newHeight,
        }) : null);
      }
    };

    const handleMouseUp = () => {
      setDragState(null);
      setResizeState(null);
    };

    if (dragState || resizeState) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState, resizeState]);

  const maxRow = Math.max(...boxes.map(b => b.row + b.height), 5);

  const getHandleStyles = (handle: string) => {
    const base = {
      width: '12px',
      height: '12px',
    };

    const positions: Record<string, React.CSSProperties> = {
      n: { top: '-6px', left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' },
      s: { bottom: '-6px', left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' },
      w: { left: '-6px', top: '50%', transform: 'translateY(-50%)', cursor: 'ew-resize' },
      e: { right: '-6px', top: '50%', transform: 'translateY(-50%)', cursor: 'ew-resize' },
      nw: { top: '-6px', left: '-6px', cursor: 'nwse-resize' },
      ne: { top: '-6px', right: '-6px', cursor: 'nesw-resize' },
      sw: { bottom: '-6px', left: '-6px', cursor: 'nesw-resize' },
      se: { bottom: '-6px', right: '-6px', cursor: 'nwse-resize' },
    };

    return { ...base, ...positions[handle] };
  };

  return (
    <div className=" min-h-screen bg-gray-900 p-8" onClick={handleDeselect}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Interactive Grid System</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg mb-4">
          <p className="text-gray-300 text-sm">
            Click a box to select • Drag to move • Drag corners/edges to resize • Click outside to snap to grid
          </p>
        </div>

        <div 
          ref={containerRef}
          className="relative bg-gray-800 p-8 rounded-lg"
          style={{
            backgroundImage: `
              linear-gradient(to right, #374151 1px, transparent 1px),
              linear-gradient(to bottom, #374151 1px, transparent 1px)
            `,
            backgroundSize: `${CELL_SIZE + GAP}px ${CELL_SIZE + GAP}px`,
            minHeight: `${maxRow * (CELL_SIZE + GAP) + 100}px`,
          }}
        >
          {/* Grid boxes */}
          {boxes.map(box => (
            <GridBox
              key={box.id}
              box={box}
              isSelected={selectedBox === box.id}
              onClick={handleBoxClick}
            />
          ))}

          {/* Absolute positioned selected box */}
          {absoluteBox && (
            <div
              className="absolute"
              style={{
                left: absoluteBox.x,
                top: absoluteBox.y,
                width: absoluteBox.width,
                height: absoluteBox.height,
                backgroundColor: absoluteBox.color,
                borderRadius: '8px',
                border: '3px solid #fff',
                boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
                cursor: dragState ? 'grabbing' : 'grab',
              }}
              onMouseDown={(e) => handleMouseDown(e, 'drag')}
            >
              <div className="flex items-center justify-center h-full text-white font-semibold pointer-events-none">
                Box {absoluteBox.id}
              </div>

              {/* Resize handles */}
              {['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map(handle => (
                <div
                  key={handle}
                  onMouseDown={(e) => handleMouseDown(e, 'resize', handle)}
                  className="absolute bg-white rounded-full"
                  style={getHandleStyles(handle)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};