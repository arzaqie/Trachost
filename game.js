const playBtn = document.getElementById("play");
const menu = document.getElementById("menu");
const gameScreen = document.getElementById("gameScreen");
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Resize canvas agar 16:9 penuh layar
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerWidth * 9 / 16;
  if (canvas.height > window.innerHeight) {
    canvas.height = window.innerHeight;
    canvas.width = window.innerHeight * 16 / 9;
  }
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Player basic
let player = { x: 50, y: 300, w: 40, h: 40, vy: 0, onGround: false };
let gravity = 0.5;
let keys = {};

// Control
document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // gravity
  player.vy += gravity;
  player.y += player.vy;

  // floor
  if (player.y + player.h > canvas.height) {
    player.y = canvas.height - player.h;
    player.vy = 0;
    player.onGround = true;
  } else {
    player.onGround = false;
  }

  // control
  if (keys["ArrowLeft"]) player.x -= 5;
  if (keys["ArrowRight"]) player.x += 5;
  if (keys["Space"] && player.onGround) {
    player.vy = -10;
    player.onGround = false;
  }

  // draw player
  ctx.fillStyle = "lime";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  requestAnimationFrame(gameLoop);
}

// Start game setelah klik Play
playBtn.addEventListener("click", () => {
  menu.style.display = "none";
  gameScreen.style.display = "block";
  gameLoop();
});
