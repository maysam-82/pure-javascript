const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const cellsHorizontal = 12;
const cellsVertical = 8;
const width = window.innerWidth;
const height = window.innerHeight;
const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;
const borderThickness = 5;
const wallTickness = 5;
const ballRadius = Math.min(unitLengthX, unitLengthY) * 0.25;
const ballLabel = "ball";
const goalLabel = "goal";
const wallLabel = "wall";

const engine = Engine.create();
// Disable gravity
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false,
    width,
    height,
  },
});
Render.run(render);
Runner.run(Runner.create(), engine);

// Borders
const walls = [
  Bodies.rectangle(width / 2, borderThickness / 2, width, borderThickness, {
    isStatic: true,
  }),
  Bodies.rectangle(
    width / 2,
    height - borderThickness / 2,
    width,
    borderThickness,
    {
      isStatic: true,
    }
  ),
  Bodies.rectangle(borderThickness / 2, height / 2, borderThickness, height, {
    isStatic: true,
  }),
  Bodies.rectangle(
    width - borderThickness / 2,
    height / 2,
    borderThickness,
    height,
    {
      isStatic: true,
    }
  ),
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

const grid = Array(cellsVertical)
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false));

const verticalsSegment = Array(cellsVertical)
  .fill(null)
  .map(() => Array(cellsHorizontal - 1).fill(false));
const horizontalsSegment = Array(cellsVertical - 1)
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false));

// Select a random starting cell
const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

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
      nextRow >= cellsVertical ||
      nextColumn < 0 ||
      nextColumn >= cellsHorizontal
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
      columnIndex * unitLengthX + unitLengthX / 2,
      rowIndex * unitLengthY + unitLengthY,
      unitLengthX,
      wallTickness,
      {
        label: wallLabel,
        isStatic: true,
        render: {
          fillStyle: "red",
        },
      }
    );
    World.add(world, wall);
  });
});

verticalsSegment.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) return;
    const wall = Bodies.rectangle(
      columnIndex * unitLengthX + unitLengthX,
      rowIndex * unitLengthY + unitLengthY / 2,
      wallTickness,
      unitLengthY,
      {
        label: wallLabel,
        isStatic: true,
        render: {
          fillStyle: "red",
        },
      }
    );
    World.add(world, wall);
  });
});

// Draw Goal
const goal = Bodies.rectangle(
  width - unitLengthX / 2,
  height - unitLengthY / 2,
  0.65 * Math.min(unitLengthX, unitLengthY),
  0.65 * Math.min(unitLengthX, unitLengthY),
  {
    isStatic: true,
    label: goalLabel,
    render: {
      fillStyle: "green",
    },
  }
);
World.add(world, goal);

// Draw Ball
const ball = Bodies.circle(unitLengthX / 2, unitLengthY / 2, ballRadius, {
  label: ballLabel,
  render: {
    fillStyle: "white",
  },
});

World.add(world, ball);

document.addEventListener("keydown", (event) => {
  const {
    velocity: { x, y },
  } = ball;
  if (event.keyCode === 38) {
    Body.setVelocity(ball, { x, y: y - 5 });
  } else if (event.keyCode === 40) {
    Body.setVelocity(ball, { x, y: y + 5 });
  } else if (event.keyCode === 37) {
    Body.setVelocity(ball, { x: x - 5, y });
  } else if (event.keyCode === 39) {
    Body.setVelocity(ball, { x: x + 5, y });
  }
});

Events.on(engine, "collisionStart", (event) => {
  event.pairs.forEach((collision) => {
    const labels = [ballLabel, goalLabel];
    if (
      labels.includes(collision.bodyA.label) &&
      labels.includes(collision.bodyB.label)
    ) {
      world.gravity.y = 1;
      for (const body of world.bodies) {
        if (
          body.label === wallLabel ||
          body.label === ballLabel ||
          body.label === goalLabel
        )
          Body.setStatic(body, false);
      }
    }
  });
});
