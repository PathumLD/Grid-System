# 🎯 Dynamic Grid Layout System

<div align="center">

A modern, interactive grid layout system built with **Next.js 14**, **TypeScript**, **Redux Toolkit**, and **Tailwind CSS**. Create, drag, resize, and manage boxes on a fully responsive grid with persistent state.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.0-purple)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38bdf8)](https://tailwindcss.com/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Usage Guide](#-usage-guide)
- [Project Structure](#-project-structure)
- [Key Concepts](#-key-concepts)
- [Contributing](#-contributing)

---

## 🌟 Overview

The **Dynamic Grid Layout System** is a powerful web application that provides an intuitive interface for creating and managing grid-based layouts. Perfect for dashboard builders, layout designers, or anyone needing a flexible grid management system.

### Purpose

- **Visual Layout Management**: Create and organize content in a grid-based interface
- **Responsive Design**: Automatically adapts to different screen sizes (mobile, tablet, desktop)
- **State Persistence**: Your grid layout is saved automatically and persists across sessions
- **Developer-Friendly**: Clean, well-documented code with TypeScript for type safety

---

## ✨ Features

### Core Functionality

- ✅ **Drag & Drop**: Smoothly move boxes anywhere on the grid
- ✅ **Resize Boxes**: 8-point resize handles (corners + edges) for precise sizing
- ✅ **Smart Snap**: Automatic grid snapping when releasing boxes
- ✅ **Add/Delete Boxes**: Easily manage grid items with intuitive controls
- ✅ **Auto-Placement**: New boxes automatically find the first available empty spot
- ✅ **ID Reuse**: Intelligent ID management that reuses deleted box IDs

### Technical Features

- 🎨 **Fully Responsive**: Adapts grid columns and cell sizes based on viewport
  - Mobile (< 640px): 4 columns, 70px cells
  - Tablet (640px - 1024px): 6 columns, 90px cells
  - Desktop (> 1024px): 10 columns, 100px cells
- 💾 **State Persistence**: Redux Persist saves your layout to localStorage
- 🎯 **Real-time State Display**: Debug panel shows current grid state
- 🚀 **Optimized Performance**: Efficient rendering with React hooks
- 📱 **Touch-Friendly**: Works seamlessly on touch devices

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|----------|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type safety and better developer experience |
| **Redux Toolkit** | State management with minimal boilerplate |
| **Redux Persist** | Automatic state persistence to localStorage |
| **Tailwind CSS** | Utility-first CSS framework |
| **React Hooks** | Modern React patterns for state and effects |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm**, **yarn**, **pnpm**, or **bun**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/PathumLD/Grid-System.git
cd Grid-System
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Build for Production

```bash
npm run build
npm start
```

---

## 📖 Usage Guide

### Basic Operations

#### Adding a Box
1. Click the **"Add Box"** button in the toolbar
2. A new box (2×1 cells) appears at the first available empty spot

#### Selecting a Box
1. Click on any box to select it
2. Selected boxes have a blue border and visible resize handles

#### Moving a Box
1. Click and hold on a selected box
2. Drag it to the desired position
3. Release to snap it to the nearest grid cells

#### Resizing a Box
1. Select a box
2. Grab any of the 8 resize handles (corners or edges)
3. Drag to resize
4. Release to snap to grid dimensions

#### Deleting a Box
- **Method 1**: Click the **×** button on a selected box
- **Method 2**: Hover over any box and click the **×** button that appears

#### Deselecting a Box
- Click anywhere on the empty grid area
- The box will snap to the nearest grid cells

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main application page
│   ├── layout.tsx            # Root layout with metadata
│   ├── globals.css           # Global styles and Tailwind directives
│   └── favicon.ico           # App icon
├── components/
│   ├── Grid/
│   │   ├── GridContainer.tsx # Main grid orchestrator
│   │   ├── GridBackground.tsx# Visual grid lines
│   │   ├── GridBox.tsx       # Non-selected box component
│   │   ├── SelectedBox.tsx   # Selected box with handles
│   │   └── ResizeHandles.tsx # 8-point resize handles
│   ├── Toolbar/
│   │   └── Toolbar.tsx       # Top toolbar with Add Box button
│   └── GridState/
│       └── GridState.tsx     # Debug state display panel
├── hooks/
│   └── useGridInteractions.ts# Custom hook for drag/resize logic
├── store/
│   ├── store.ts              # Redux store configuration
│   ├── gridSlice.ts          # Grid state slice with reducers
│   └── hooks.ts              # Typed Redux hooks
├── providers/
│   └── ReduxProvider.tsx     # Redux Provider wrapper
├── types/
│   └── grid.ts               # TypeScript type definitions
└── utils/
    └── gridCalculations.ts   # Grid coordinate calculations
```

---

## 🧠 Key Concepts

### Coordinate Systems

The system uses two coordinate systems:

1. **Grid Coordinates** (stored in Redux)
   - `col`, `row`: Position in grid cells
   - `width`, `height`: Size in grid cells
   - Used for final snapped positions

2. **Absolute Coordinates** (used during drag/resize)
   - `left`, `top`: Pixel position from top-left
   - `width`, `height`: Pixel dimensions
   - Enables smooth dragging without grid constraints

### State Management

- **Redux Store**: Manages all boxes and their grid positions
- **Local State**: Handles temporary absolute positions during interactions
- **Redux Persist**: Automatically saves to localStorage

### Responsive Grid

The grid automatically reconfigures based on screen width:

```typescript
Mobile:   4 columns × 70px cells  (< 640px)
Tablet:   6 columns × 90px cells  (640px - 1024px)
Desktop: 10 columns × 100px cells (> 1024px)
```

### Smart Features

- **Empty Spot Detection**: Scans grid from top-left to find first available space
- **ID Reuse**: Deleted box IDs are reused to keep numbers low and sequential
- **Boundary Prevention**: Boxes cannot be moved or resized beyond grid boundaries

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🔗 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

<div align="center">

**Developed by Pathum Dissanayake**

</div>
