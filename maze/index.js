const {
  Engine,
  Render,
  Runner,
  World,
  Bodies,
  MouseConstraint,
  Mouse,
} = Matter;

const cells = 3;
const width = 600;
const height = 600;
const unitLength = width / 3;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width,
    height,
  },
});
Render.run(render);
Runner.run(Runner.create(), engine);

World.add(
  world,
  MouseConstraint.create(engine, {
    mouse: Mouse.create(render.canvas),
  })
);

// Walls
const walls = [
  Bodies.rectangle(width / 2, 0, width, 40, { isStatic: true }),
  Bodies.rectangle(width / 2, height, width, 40, { isStatic: true }),
  Bodies.rectangle(0, height / 2, 40, height, { isStatic: true }),
  Bodies.rectangle(width, height / 2, 40, height, { isStatic: true }),
];
World.add(world, walls);

// Maze generation
// Creating 2d arrays with 3 columns and 3 rows (grid array)

const shuffle = (arr) => {
  let counter = arr.length;
  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);
    counter--;
    const temp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = temp;
  }
  return arr;
};

const grid = Array(cells)
  .fill(null)
  .map(() => Array(cells).fill(false));

const verticalsSegment = Array(cells)
  .fill(null)
  .map(() => Array(cells - 1).fill(false));
const horizontalsSegment = Array(cells - 1)
  .fill(null)
  .map(() => Array(cells).fill(false));

// Select a random starting cell
const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

const stepThroughCell = (rowIndex, columnIndex) => {
  // if I have visited the cell at `[rowIndex, columnIndex]`, return
  if (grid[rowIndex][columnIndex]) return;
  // Mark this cell as being visited
  grid[rowIndex][columnIndex] = true;
  // Assemble randomly-ordered list of neighbors
  const neighbors = shuffle([
    [rowIndex - 1, columnIndex, "up"],
    [rowIndex, columnIndex + 1, "right"],
    [rowIndex + 1, columnIndex, "down"],
    [rowIndex, columnIndex - 1, "left"],
  ]);
  // For each neighbor:
  for (const neighbor of neighbors) {
    const [nextRow, nextColumn, direction] = neighbor;
    // Check if that neighbor is out of bounds
    if (
      nextRow < 0 ||
      nextRow >= cells ||
      nextColumn < 0 ||
      nextColumn >= cells
    )
      continue;
    // Check if we have visited that neighbor, continue to next neighbor
    if (grid[nextRow][nextColumn]) continue;
    // Remove the wall from either horizontal or vertical segments
    if (direction === "left") {
      verticalsSegment[rowIndex][columnIndex - 1] = true;
    } else if (direction === "right") {
      verticalsSegment[rowIndex][columnIndex] = true;
    } else if (direction === "up") {
      horizontalsSegment[rowIndex - 1][columnIndex] = true;
    } else if (direction === "down") {
      horizontalsSegment[rowIndex][columnIndex] = true;
    }
    // Visit that next cell
    stepThroughCell(nextRow, nextColumn);
  }
};

stepThroughCell(startRow, startColumn);

horizontalsSegment.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) return;
    const wall = Bodies.rectangle(
      columnIndex * unitLength + unitLength / 2,
      rowIndex * unitLength + unitLength,
      unitLength,
      10,
      {
        isStatic: true,
      }
    );
    World.add(world, wall);
  });
});

verticalsSegment.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) return;
    const wall = Bodies.rectangle(
      columnIndex * unitLength + unitLength,
      rowIndex * unitLength + unitLength / 2,
      10,
      unitLength,
      {
        isStatic: true,
      }
    );
    World.add(world, wall);
  });
});
