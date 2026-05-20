const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const levelSelect =
  document.getElementById("levelSelect");

const startButton =
  document.getElementById("startButton");

const background =
  document.getElementById("background");

/* GRID SIZE */
const gridSize = 25;

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

/* POISON */
let poisons = [];

/* SCORE */
let score = 0;

/* LEVEL */
let level = 1;

/* WIN SCORE */
const winScore = 6;

/* GAME SPEED */
let gameSpeed = 150;

/* GAME START */
let gameStarted = false;

/* MAIN LOOP */
function drawGame() {

  if (!gameStarted) {
    return;
  }

  moveSnake();

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

  if (score >= winScore) {

    alert("You Win!");

    document.location.reload();

    return;
  }

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

  ctx.drawImage(
    background,
    0,
    0,
    canvas.width,
    canvas.height
  );
}

/* DRAW SNAKE */
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

  ctx.fillStyle = "red";

  ctx.fillRect(
    foodX * gridSize,
    foodY * gridSize,
    gridSize,
    gridSize
  );
}

/* DRAW POISON */
function drawPoison() {

  ctx.fillStyle = "purple";

  poisons.forEach(poison => {

    ctx.beginPath();

    ctx.arc(
      poison.x * gridSize + gridSize / 2,
      poison.y * gridSize + gridSize / 2,
      gridSize / 2,
      0,
      Math.PI * 2
    );

    ctx.fill();
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
function drawScore() {

  ctx.fillStyle = "white";

  ctx.font = "20px Arial";

  ctx.fillText(
    "Score: " +
    score +
    "/" +
    winScore,
    10,
    25
  );
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

/* COLLISION */
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

      return true;
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

/* START GAME */
startButton.addEventListener(
  "click",
  () => {

    if (gameStarted) {
      return;
    }

    gameStarted = true;

    level =
      Number(levelSelect.value);

    /* EASY */
    if (level === 1) {

      gameSpeed = 150;
    }

    /* MEDIUM */
    else if (level === 2) {

      gameSpeed = 100;
    }

    /* IMPOSSIBLE */
    else if (level === 3) {

      gameSpeed = 70;
    }

    createFood();
    createPoison();

    drawGame();
  }
);