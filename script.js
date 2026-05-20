const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const levelSelect =
  document.getElementById("levelSelect");

const endOverlay = document.getElementById("endOverlay");
const endMessageEl = document.getElementById("endMessage");
const actionButton = document.getElementById("actionButton");

/* GRID SIZE */
const gridSize = 30;

/* TILE COUNT */
const tileCountX = canvas.width / gridSize;
const tileCountY = canvas.height / gridSize;

/* SNAKE */
let snake = [
  { x: 10, y: 10 }
];

/* MOVEMENT */
let dx = 1;
let dy = 0;

/* FOOD */
let foodX = 0;
let foodY = 0;

/* FOOD EMOJIS */
const foodEmojis = [
  "🥯",
  "🍮",
  "🥞",
  "🍨",
  "🥨",
  "🥐",
  "🧁",
  "🥧"
];

let currentFoodEmoji = "🍮";

/* POISON */
let poisons = [];

/* SCORE */
let score = 0;

/* LEVEL */
let level = 1;

/* GAME SPEED */
let gameSpeed = 150;

/* GAME START */
let gameStarted = false;

/* LIVES */
const maxLives = 5;
let lives = maxLives;

/* MAIN GAME LOOP */
function drawGame() {

  if (!gameStarted) {
    return;
  }

  moveSnake();

  /* COLLISION */
  if (checkCollision()) {

    showEndMessage("Game Over!");

    return;
  }

  clearScreen();

  drawFood();
  drawPoison();
  drawSnake();
  drawLives();

  setTimeout(drawGame, gameSpeed);
}

/* CLEAR SCREEN */
function clearScreen() {

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );
}

/* DRAW SNAKE */
function drawSnake() {

  ctx.fillStyle = "#ff9cd8";
  ctx.strokeStyle = "#ff9cd8";

  snake.forEach((part, index) => {
    ctx.fillRect(
      part.x * gridSize,
      part.y * gridSize,
      gridSize,
      gridSize
    );

    ctx.strokeRect(
      part.x * gridSize,
      part.y * gridSize,
      gridSize,
      gridSize
    );

    if (index === 0) {
      drawHeadEyes(part);
    }
  });
}

function drawHeadEyes(part) {
  const eyeSize = 4;
  const padding = 6;
  const x = part.x * gridSize;
  const y = part.y * gridSize;

  const previousFill = ctx.fillStyle;
  ctx.fillStyle = "black";

  let eye1 = { x: x + padding, y: y + padding };
  let eye2 = { x: x + padding, y: y + gridSize - padding - eyeSize };

  if (dx === 1) {
    eye1.x = x + gridSize - padding - eyeSize;
    eye2.x = x + gridSize - padding - eyeSize;
  } else if (dx === -1) {
    eye1.x = x + padding;
    eye2.x = x + padding;
  } else if (dy === 1) {
    eye1.x = x + padding;
    eye2.x = x + gridSize - padding - eyeSize;
    eye1.y = y + gridSize - padding - eyeSize;
    eye2.y = y + gridSize - padding - eyeSize;
  }

  if (dy === -1) {
    eye1.y = y + padding;
    eye2.y = y + padding;
  }

  ctx.fillRect(eye1.x, eye1.y, eyeSize, eyeSize);
  ctx.fillRect(eye2.x, eye2.y, eyeSize, eyeSize);

  ctx.fillStyle = previousFill;
}


/* MOVE SNAKE */
function moveSnake() {

  const head = {

    x: snake[0].x + dx,
    y: snake[0].y + dy
  };

  snake.unshift(head);

  /* EAT FOOD */
  if (
    head.x === foodX &&
    head.y === foodY
  ) {

    score++;

    createFood();
    createPoison();
  }

  else {

    snake.pop();
  }
}

/* DRAW FOOD */
function drawFood() {

  ctx.font = "32px Arial";

  ctx.fillText(
    currentFoodEmoji,
    foodX * gridSize,
    foodY * gridSize + 28
  );
}

/* DRAW POISON */
function drawPoison() {

  ctx.font = "32px Arial";

  poisons.forEach(poison => {

    ctx.fillText(
      "💣",
      poison.x * gridSize,
      poison.y * gridSize + 28
    );
  });
}

/* CREATE FOOD */
function createFood() {

  let validPosition = false;

  while (!validPosition) {

    foodX =
      Math.floor(
        Math.random() * tileCountX
      );

    foodY =
      Math.floor(
        Math.random() * tileCountY
      );

    validPosition = true;

    currentFoodEmoji =
      foodEmojis[
        Math.floor(
          Math.random() *
          foodEmojis.length
        )
      ];

    /* NOT ON SNAKE */
    for (
      let i = 0;
      i < snake.length;
      i++
    ) {

      if (
        snake[i].x === foodX &&
        snake[i].y === foodY
      ) {

        validPosition = false;
      }
    }

    /* NOT ON POISON */
    for (
      let i = 0;
      i < poisons.length;
      i++
    ) {

      if (
        poisons[i].x === foodX &&
        poisons[i].y === foodY
      ) {

        validPosition = false;
      }
    }
  }
}

/* CREATE POISON */
function createPoison() {

  poisons = [];

  let poisonCount = 1;

  /* EASY */
  if (level === 1) {

    poisonCount = 1;
  }

  /* MEDIUM */
  else if (level === 2) {

    poisonCount = 3;
  }

  /* IMPOSSIBLE */
  else if (level === 3) {

    poisonCount = 5;
  }

  for (
    let i = 0;
    i < poisonCount;
    i++
  ) {

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

      /* NOT ON SNAKE */
      for (
        let j = 0;
        j < snake.length;
        j++
      ) {

        if (
          poison.x === snake[j].x &&
          poison.y === snake[j].y
        ) {

          validPosition = false;
        }
      }

      /* NOT ON FOOD */
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

/* DRAW SCORE */
function drawLives() {

  ctx.fillStyle = "#73736e";

  ctx.font = "28px Arial";

  let lifeText = "ℒ𝒾𝓋ℯ𝓈: ";

  for (let i = 0; i < lives; i++) {
    lifeText += "🎀 ";
  }

  lifeText = lifeText.trim();

  ctx.fillText(lifeText, 10, 25);
}

/* DRAW LEVEL */
function drawLevel() {

  ctx.fillStyle = "white";

  ctx.font = "20px Arial";

  ctx.fillText(
    "Level: " + level,
    260,
    25
  );
}

/* SHOW END MESSAGE ON CANVAS */
function showEndMessage(message) {

  gameStarted = false;

  if (endMessageEl && endOverlay) {

    endMessageEl.textContent = message;

    if (actionButton) {
      actionButton.textContent = "Restart";
    }

    endOverlay.classList.remove("hidden");
  }
}

function resetGame() {

  // reset state
  snake = [{ x: 10, y: 10 }];

  dx = 1;
  dy = 0;

  score = 0;
  lives = maxLives;

  poisons = [];

  level = Number(levelSelect.value);

  if (level === 1) {
    gameSpeed = 150;
  } else if (level === 2) {
    gameSpeed = 100;
  } else if (level === 3) {
    gameSpeed = 70;
  }

  createFood();
  createPoison();

  if (endOverlay) {
    endOverlay.classList.add("hidden");
  }

  gameStarted = true;

  drawGame();
}

if (actionButton) {
  actionButton.addEventListener("click", () => {
    if (gameStarted) {
      return;
    }

    if (endOverlay) {
      endOverlay.classList.add("hidden");
    }

    resetGame();
  });
}

/* CHECK COLLISION */
function checkCollision() {

  const head = snake[0];

  /* WALL */
  if (
    head.x < 0 ||
    head.x >= tileCountX ||
    head.y < 0 ||
    head.y >= tileCountY
  ) {

    return true;
  }

  /* SELF */
  for (
    let i = 1;
    i < snake.length;
    i++
  ) {

    if (
      head.x === snake[i].x &&
      head.y === snake[i].y
    ) {

      return true;
    }
  }

  /* POISON */
  for (
    let i = 0;
    i < poisons.length;
    i++
  ) {

    if (
      head.x === poisons[i].x &&
      head.y === poisons[i].y
    ) {

      lives -= 1;
      poisons.splice(i, 1);
      createPoison();
      return lives <= 0;
    }
  }

  return false;
}

/* CONTROLS */
document.addEventListener(
  "keydown",
  changeDirection
);

function changeDirection(event) {

  /* LEFT */
  if (
    event.key === "ArrowLeft" &&
    dx !== 1
  ) {

    dx = -1;
    dy = 0;
  }

  /* UP */
  else if (
    event.key === "ArrowUp" &&
    dy !== 1
  ) {

    dx = 0;
    dy = -1;
  }

  /* RIGHT */
  else if (
    event.key === "ArrowRight" &&
    dx !== -1
  ) {

    dx = 1;
    dy = 0;
  }

  /* DOWN */
  else if (
    event.key === "ArrowDown" &&
    dy !== -1
  ) {

    dx = 0;
    dy = 1;
  }
}

/* START handled via on-screen action button */