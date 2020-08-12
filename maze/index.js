const {
  Engine,
  Render,
  Runner,
  World,
  Bodies,
  MouseConstraint,
  Mouse,
} = Matter;

const width = 600;
const height = 600;

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

const grid = Array(3)
  .fill(null)
  .map(() => Array(3).fill(false));

const verticalsSegment = Array(3)
  .fill(null)
  .map(() => Array(2).fill(false));
const horizontalsSegment = Array(2)
  .fill(null)
  .map(() => Array(3).fill(false));
