# Grid Layout System

This is a dynamic grid layout system built with Next.js, TypeScript, and Tailwind CSS. It allows users to create, move, and resize boxes on a responsive grid.

## Features

- **Responsive Grid:** The grid automatically adjusts its number of columns and cell size based on the screen size.
- **Draggable Boxes:** Click and drag a box to move it to a new position on the grid.
- **Resizable Boxes:** Use the handles on the corners and edges of a selected box to resize it.
- **Add and Delete Boxes:** Easily add new boxes to the grid or delete existing ones.
- **Snap to Grid:** When you move or resize a box, it automatically snaps to the nearest grid cell.
- **State Display:** The current state of the grid (the properties of each box) is displayed in real-time.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to Use

- **Add a box:** Click the "Add Box" button in the toolbar.
- **Select a box:** Click on any box to select it.
- **Move a box:** Click and drag a selected box to move it.
- **Resize a box:** Click and drag the handles on the corners and edges of a selected box.
- **Deselect a box:** Click anywhere outside of the selected box to deselect it and snap it to the grid.
- **Delete a box:** Click the "x" button that appears on a selected box or when you hover over a box.

## Project Structure

- `src/app/page.tsx`: The main page of the application.
- `src/components`: Contains the React components used in the application.
- `src/hooks`: Contains custom React hooks.
- `src/types`: Contains TypeScript type definitions.
- `src/utils`: Contains utility functions.

## Learn More

To learn more about the technologies used in this project, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [React Documentation](https://reactjs.org/docs/getting-started.html) - learn about React.
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - learn about TypeScript.
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - learn about Tailwind CSS.
