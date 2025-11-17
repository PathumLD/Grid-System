'use client';

import React, { useState, useRef, useEffect } from 'react';
import { GridBox } from './GridBox';
import { Box, AbsoluteBox, DragState, ResizeState } from '../types/grid';
import { GRID_COLUMNS, GAP, gridToPixels, pixelsToGrid, getCellSize } from '../utils/gridUtils';

const INITIAL_BOXES: Box[] = [
  { id: 1, col: 0, row: 0, width: 2, height: 1, color: '#3b82f6' },
  { id: 2, col: 2, row: 0, width: 3, height: 2, color: '#ec4899' },
  { id: 3, col: 5, row: 0, width: 2, height: 1, color: '#10b981' },
  { id: 4, col: 7, row: 0, width: 3, height: 1, color: '#f59e0b' },
  { id: 5, col: 0, row: 1, width: 2, height: 1, color: '#8b5cf6' },
  { id: 6, col: 7, row: 1, width: 3, height: 1, color: '#ef4444' },
];

export const InteractiveGrid: React.FC = () => {
  const [boxes, setBoxes] = useState<Box[]>(INITIAL_BOXES);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [absoluteBox, setAbsoluteBox] = useState<AbsoluteBox | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [resizeState, setResizeState] = useState<ResizeState | null>(null);
  const [cellSize, setCellSize] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle responsive cell size calculation
  useEffect(() => {
    const updateCellSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const newCellSize = getCellSize(containerWidth);
        setCellSize(newCellSize);
      }
    };

    // Initial calculation
    updateCellSize();
    
    // Use ResizeObserver for better performance
    const resizeObserver = new ResizeObserver(updateCellSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    // Fallback to window resize
    window.addEventListener('resize', updateCellSize);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateCellSize);
    };
  }, []);

  // Update absolute box when cell size changes
  useEffect(() => {
    if (selectedBox && absoluteBox) {
      const box = boxes.find(b => b.id === selectedBox);
      if (box) {
        const pixels = gridToPixels(box.col, box.row, box.width, box.height, cellSize);
        setAbsoluteBox({ ...box, ...pixels });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cellSize]);

  const handleBoxClick = (box: Box, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedBox === box.id) return;
    
    const pixels = gridToPixels(box.col, box.row, box.width, box.height, cellSize);
    setSelectedBox(box.id);
    setAbsoluteBox({ ...box, ...pixels });
  };

  const handleDeselect = () => {
    if (selectedBox && absoluteBox) {
      const gridPos = pixelsToGrid(
        absoluteBox.x,
        absoluteBox.y,
        absoluteBox.width,
        absoluteBox.height,
        cellSize
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
          newWidth = Math.max(cellSize, resizeState.initialWidth + deltaX);
        }
        if (resizeState.handle.includes('w')) {
          newWidth = Math.max(cellSize, resizeState.initialWidth - deltaX);
          newX = resizeState.initialX + deltaX;
          if (newWidth === cellSize) newX = resizeState.initialX + resizeState.initialWidth - cellSize;
        }
        if (resizeState.handle.includes('s')) {
          newHeight = Math.max(cellSize, resizeState.initialHeight + deltaY);
        }
        if (resizeState.handle.includes('n')) {
          newHeight = Math.max(cellSize, resizeState.initialHeight - deltaY);
          newY = resizeState.initialY + deltaY;
          if (newHeight === cellSize) newY = resizeState.initialY + resizeState.initialHeight - cellSize;
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
  }, [dragState, resizeState, cellSize]);

  const maxRow = Math.max(...boxes.map(b => b.row + b.height), 5);

  const getHandleStyles = (handle: string) => {
    const base = {
      width: '10px',
      height: '10px',
    };

    const positions: Record<string, React.CSSProperties> = {
      n: { top: '-5px', left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' },
      s: { bottom: '-5px', left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' },
      w: { left: '-5px', top: '50%', transform: 'translateY(-50%)', cursor: 'ew-resize' },
      e: { right: '-5px', top: '50%', transform: 'translateY(-50%)', cursor: 'ew-resize' },
      nw: { top: '-5px', left: '-5px', cursor: 'nwse-resize' },
      ne: { top: '-5px', right: '-5px', cursor: 'nesw-resize' },
      sw: { bottom: '-5px', left: '-5px', cursor: 'nesw-resize' },
      se: { bottom: '-5px', right: '-5px', cursor: 'nwse-resize' },
    };

    return { ...base, ...positions[handle] };
  };

  return (
    <div className="min-h-screen p-4 bg-gray-900 md:p-8" onClick={handleDeselect}>
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-4 text-2xl font-bold text-white md:text-3xl md:mb-6">
          Interactive Grid System
        </h1>
        
        <div className="p-4 mb-4 bg-gray-800 rounded-lg md:p-6">
          <p className="text-xs text-gray-300 md:text-sm">
            Click a box to select • Drag to move • Drag corners/edges to resize • Click outside to snap to grid
          </p>
          <p className="mt-2 text-xs text-gray-400">
            10 columns • Fully responsive • Rows expand dynamically
          </p>
        </div>

        <div 
          ref={containerRef}
          className="relative p-4 bg-gray-800 rounded-lg md:p-8"
          style={{
            backgroundImage: cellSize > 0 ? `
              linear-gradient(to right, #374151 1px, transparent 1px),
              linear-gradient(to bottom, #374151 1px, transparent 1px)
            ` : 'none',
            backgroundSize: cellSize > 0 ? `${cellSize + GAP}px ${cellSize + GAP}px` : 'auto',
            minHeight: `${maxRow * (cellSize + GAP) + 100}px`,
          }}
        >
          {/* Only render grid when cellSize is calculated */}
          {cellSize > 0 && (
            <>
              {/* Grid boxes */}
              {boxes.map(box => (
                <GridBox
                  key={box.id}
                  box={box}
                  isSelected={selectedBox === box.id}
                  onClick={handleBoxClick}
                  cellSize={cellSize}
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
                  <div className="flex items-center justify-center h-full text-sm font-semibold text-white pointer-events-none md:text-base">
                    Box {absoluteBox.id}
                  </div>

                  {/* Resize handles */}
                  {['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map(handle => (
                    <div
                      key={handle}
                      onMouseDown={(e) => handleMouseDown(e, 'resize', handle)}
                      className="absolute transition-transform bg-white rounded-full hover:scale-125"
                      style={getHandleStyles(handle)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};