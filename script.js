// Get canvas and drawing context
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Snake position
let x = 200;
let y = 200;

// Snake movement direction
let dx = 20;
let dy = 0;

// Main game loop
function gameLoop() {

  // Clear old frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  ctx.fillStyle = "lime";
  ctx.fillRect(x, y, 20, 20);

  // Update snake position
  x += dx;
  y += dy;

  // Check wall collision
  checkCollision();
}

// Check if snake hits wall
function checkCollision() {

  if (
    x < 0 ||
    x >= canvas.width ||
    y < 0 ||
    y >= canvas.height
  ) {
    alert("Game Over");
    document.location.reload();
  }
}

// Run game loop every 100 milliseconds
setInterval(gameLoop, 100);

// Listen for keyboard input
document.addEventListener("keydown", changeDirection);

// Change snake direction
function changeDirection(event) {

  // Move up
  if (event.key === "ArrowUp" && dy === 0) {
    dx = 0;
    dy = -20;

  // Move down
  } else if (event.key === "ArrowDown" && dy === 0) {
    dx = 0;
    dy = 20;

  // Move left
  } else if (event.key === "ArrowLeft" && dx === 0) {
    dx = -20;
    dy = 0;

  // Move right
  } else if (event.key === "ArrowRight" && dx === 0) {
    dx = 20;
    dy = 0;
  }
}