const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const gridSize = 20;

const tileCountX = canvas.width / gridSize;
const tileCountY = canvas.height / gridSize;

// Snake
let snake = [
  { x: 10, y: 10 }
];

// Movement
let dx = 1;
let dy = 0;

// Food
let foodX = 0;
let foodY = 0;

// Poison array
let poisons = [];

// Score
let score = 0;

// Level
let level = 1;

// Main game loop
function drawGame() {

  moveSnake();

  // Check collisions
  if (checkCollision()) {

    alert("Game Over!");
    document.location.reload();
    return;
  }

  clearScreen();

  drawFood();
  drawPoison();
  drawSnake();
  drawScore();
  drawLevel();

  // Win condition
  if (score >= 15) {

    alert("You Win!");
    document.location.reload();
    return;
  }

  setTimeout(drawGame, 150);
}

// Clear screen
function clearScreen() {

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Draw snake
function drawSnake() {

  ctx.fillStyle = "lime";

  snake.forEach(part => {

    ctx.fillRect(
      part.x * gridSize,
      part.y * gridSize,
      gridSize,
      gridSize
    );

    ctx.strokeStyle = "black";

    ctx.strokeRect(
      part.x * gridSize,
      part.y * gridSize,
      gridSize,
      gridSize
    );
  });
}

// Move snake
function moveSnake() {

  const head = {
    x: snake[0].x + dx,
    y: snake[0].y + dy
  };

  snake.unshift(head);

  // Snake eats food
  if (head.x === foodX && head.y === foodY) {

    score++;

    // Level system
    if (score >= 10) {

      level = 3;

    } else if (score >= 5) {

      level = 2;
    }

    createFood();
    createPoison();

  } else {

    snake.pop();
  }
}

// Draw food
function drawFood() {

  ctx.fillStyle = "red";

  ctx.fillRect(
    foodX * gridSize,
    foodY * gridSize,
    gridSize,
    gridSize
  );
}

// Draw poison
function drawPoison() {

  ctx.fillStyle = "purple";

  poisons.forEach(poison => {

    ctx.beginPath();

    ctx.arc(
      poison.x * gridSize + 10,
      poison.y * gridSize + 10,
      10,
      0,
      Math.PI * 2
    );

    ctx.fill();
  });
}

// Create random food
function createFood() {

  let foodOnSnake = true;

  while (foodOnSnake) {

    foodX = Math.floor(Math.random() * tileCountX);
    foodY = Math.floor(Math.random() * tileCountY);

    foodOnSnake = false;

    for (let i = 0; i < snake.length; i++) {

      if (
        snake[i].x === foodX &&
        snake[i].y === foodY
      ) {
        foodOnSnake = true;
      }
    }
  }
}

// Create poison
function createPoison() {

  poisons = [];

  let poisonCount = level;

  for (let i = 0; i < poisonCount; i++) {

    let poison = {
      x: Math.floor(Math.random() * tileCountX),
      y: Math.floor(Math.random() * tileCountY)
    };

    poisons.push(poison);
  }
}

// Draw score
function drawScore() {

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";

  ctx.fillText(
    "Score: " + score,
    10,
    25
  );
}

// Draw level
function drawLevel() {

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";

  ctx.fillText(
    "Level: " + level,
    300,
    25
  );
}

// Collision detection
function checkCollision() {

  const head = snake[0];

  // Wall collision
  if (
    head.x < 0 ||
    head.x >= tileCountX ||
    head.y < 0 ||
    head.y >= tileCountY
  ) {
    return true;
  }

  // Self collision
  for (let i = 1; i < snake.length; i++) {

    if (
      head.x === snake[i].x &&
      head.y === snake[i].y
    ) {
      return true;
    }
  }

  // Poison collision
  for (let i = 0; i < poisons.length; i++) {

    if (
      head.x === poisons[i].x &&
      head.y === poisons[i].y
    ) {
      return true;
    }
  }

  return false;
}

// Keyboard controls
document.addEventListener("keydown", changeDirection);

function changeDirection(event) {

  // Left
  if (event.key === "ArrowLeft" && dx !== 1) {

    dx = -1;
    dy = 0;
  }

  // Up
  else if (event.key === "ArrowUp" && dy !== 1) {

    dx = 0;
    dy = -1;
  }

  // Right
  else if (event.key === "ArrowRight" && dx !== -1) {

    dx = 1;
    dy = 0;
  }

  // Down
  else if (event.key === "ArrowDown" && dy !== -1) {

    dx = 0;
    dy = 1;
  }
}

// Create first food
createFood();

// Create first poison
createPoison();

// Start game
drawGame();