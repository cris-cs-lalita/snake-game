const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let x = 200;
let y = 200;
let dx = 20;
let dy = 0;

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "lime";
  ctx.fillRect(x, y, 20, 20);

  x += dx;
  y += dy;
}

setInterval(gameLoop, 100);

