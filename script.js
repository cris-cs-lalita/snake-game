const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const levelSelect =
  document.getElementById("levelSelect");

const startButton =
  document.getElementById("startButton");

const gridSize = 20;

const tileCountX = canvas.width / gridSize;
const tileCountY = canvas.height / gridSize;

let background =
  document.getElementById("background");

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

// Win score
const winScore = 6;

// Game speed
let gameSpeed = 150;

// Game started
let gameStarted = false;

// Main game loop
function drawGame() {

  if (!gameStarted) {
    return;
  }

  moveSnake();

  // Collision
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

  // Win
  if (score >= winScore) {

    alert("You Win!");

    document.location.reload();

    return;
  }

  setTimeout(drawGame, gameSpeed);
}

// Clear screen
function clearScreen() {

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  ctx.drawImage(
    background,
    0,
    0,
    canvas.width,
    canvas.height
  );
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

  // Eat food
  if (head.x === foodX && head.y === foodY) {

    score++;

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

// Create food
function createFood() {

  let validPosition = false;

  while (!validPosition) {

    foodX =
      Math.floor(Math.random() * tileCountX);

    foodY =
      Math.floor(Math.random() * tileCountY);

    validPosition = true;

    // Not on snake
    for (let i = 0; i < snake.length; i++) {

      if (
        snake[i].x === foodX &&
        snake[i].y === foodY
      ) {
        validPosition = false;
      }
    }

    // Not on poison
    for (let i = 0; i < poisons.length; i++) {

      if (
        poisons[i].x === foodX &&
        poisons[i].y === foodY
      ) {
        validPosition = false;
      }
    }
  }
}

// Create poison
function createPoison() {

  poisons = [];

  let poisonCount = 1;

  // Easy
  if (level === 1) {

    poisonCount = 1;
  }

  // Medium
  else if (level === 2) {

    poisonCount = 3;
  }

  // Impossible
  else if (level === 3) {

    poisonCount = 5;
  }

  for (let i = 0; i < poisonCount; i++) {

    let validPosition = false;

    while (!validPosition) {

      let poison = {

        x: Math.floor(
          Math.random() * tileCountX
        ),

        y: Math.floor(
          Math.random() * tileCountY
        )
      };

      validPosition = true;

      // Not on snake
      for (let j = 0; j < snake.length; j++) {

        if (
          poison.x === snake[j].x &&
          poison.y === snake[j].y
        ) {
          validPosition = false;
        }
      }

      // Not on food
      if (
        poison.x === foodX &&
        poison.y === foodY
      ) {
        validPosition = false;
      }

      if (validPosition) {

        poisons.push(poison);
      }
    }
  }
}

// Draw score
function drawScore() {

  ctx.fillStyle = "white";

  ctx.font = "20px Arial";

  ctx.fillText(
    "Score: " + score + "/" + winScore,
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
    280,
    25
  );
}

// Collision
function checkCollision() {

  const head = snake[0];

  // Wall
  if (
    head.x < 0 ||
    head.x >= tileCountX ||
    head.y < 0 ||
    head.y >= tileCountY
  ) {
    return true;
  }

  // Self
  for (let i = 1; i < snake.length; i++) {

    if (
      head.x === snake[i].x &&
      head.y === snake[i].y
    ) {
      return true;
    }
  }

  // Poison
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

// Controls
document.addEventListener(
  "keydown",
  changeDirection
);

function changeDirection(event) {

  // Left
  if (
    event.key === "ArrowLeft" &&
    dx !== 1
  ) {

    dx = -1;
    dy = 0;
  }

  // Up
  else if (
    event.key === "ArrowUp" &&
    dy !== 1
  ) {

    dx = 0;
    dy = -1;
  }

  // Right
  else if (
    event.key === "ArrowRight" &&
    dx !== -1
  ) {

    dx = 1;
    dy = 0;
  }

  // Down
  else if (
    event.key === "ArrowDown" &&
    dy !== -1
  ) {

    dx = 0;
    dy = 1;
  }
}

// Start game
startButton.addEventListener(
  "click",
  () => {

    if (gameStarted) {
      return;
    }

    gameStarted = true;

    level = Number(
      levelSelect.value
    );

    // Easy
    if (level === 1) {

      gameSpeed = 150;
    }

    // Medium
    else if (level === 2) {

      gameSpeed = 100;
    }

    // Impossible
    else if (level === 3) {

      gameSpeed = 70;
    }

    createFood();
    createPoison();

    drawGame();
  }
);