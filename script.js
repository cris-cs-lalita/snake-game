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

// Score
let score = 0;

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
  drawSnake();
  drawScore();

  // Win condition
  if (score >= 6) {

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

    createFood();

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

// Start game
drawGame();