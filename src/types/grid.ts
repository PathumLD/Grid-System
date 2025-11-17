export interface Box {
  id: number;
  col: number;
  row: number;
  width: number;
  height: number;
  color: string;
}

export interface PixelPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AbsoluteBox extends Box, PixelPosition {}

export interface DragState {
  startX: number;
  startY: number;
  initialX: number;
  initialY: number;
}

export interface ResizeState {
  startX: number;
  startY: number;
  initialWidth: number;
  initialHeight: number;
  initialX: number;
  initialY: number;
  handle: string;
}