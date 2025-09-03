const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const gameOverScreen = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const restartBtn = document.getElementById("restart");

const bgMusic = document.getElementById("bgMusic");
const catchSound = document.getElementById("catchSound");
const missSound = document.getElementById("missSound");
const lineHitSound = document.getElementById("lineHitSound");

const settingsBtn = document.getElementById("settingsBtn");
const settingsMenu = document.getElementById("settingsMenu");
const musicToggle = document.getElementById("musicToggle");
const soundToggle = document.getElementById("soundToggle");
const closeSettings = document.getElementById("closeSettings");

const catchLine = document.getElementById("catchLine");

let score, lives, playerX, isGameOver, spawnTimer;
let musicOn = true, soundOn = true;
let fallSpeed, spawnDelay;
let currentLevel = 1;

const levels = [
  {level: 1, fallSpeed: 5, spawnDelay: 1000, unlockScore: 0},
  {level: 2, fallSpeed: 6, spawnDelay: 900, unlockScore: 1000},
  {level: 3, fallSpeed: 7, spawnDelay: 800, unlockScore: 2000},
  {level: 4, fallSpeed: 8, spawnDelay: 700, unlockScore: 3000},
  {level: 5, fallSpeed: 9, spawnDelay: 650, unlockScore: 4000},
  {level: 6, fallSpeed: 10, spawnDelay: 600, unlockScore: 5000},
  {level: 7, fallSpeed: 11, spawnDelay: 550, unlockScore: 6000},
  {level: 8, fallSpeed: 12, spawnDelay: 500, unlockScore: 7000},
  {level: 9, fallSpeed: 13, spawnDelay: 450, unlockScore: 8000},
  {level: 10, fallSpeed: 14, spawnDelay: 400, unlockScore: 9000},
  {level: 11, fallSpeed: 0, spawnDelay: 0, unlockScore: 10000, comingSoon: true}
];

function selectLevel(level) {
  const lvl = levels[level-1];
  if(lvl.comingSoon){
    alert("Level " + level + " Coming Soon!");
    return;
  }
  if(score >= lvl.unlockScore || level===1){
    currentLevel = level;
    fallSpeed = lvl.fallSpeed;
    spawnDelay = lvl.spawnDelay;
    startGame();
  } else {
    alert("Kamu butuh skor " + lvl.unlockScore + " untuk membuka level ini!");
  }
}

// ---------------------- GAME LOGIC ----------------------
function startGame() {
  score = 0;
  lives = 3;
  isGameOver = false;
  playerX = game.clientWidth / 2 - player.clientWidth / 2;
  player.style.left = playerX + "px";
  scoreDisplay.innerText = "Score: " + score;
  livesDisplay.innerText = "❤️❤️❤️";
  gameOverScreen.style.display = "none";

  fallSpeed = levels[currentLevel-1].fallSpeed;
  spawnDelay = levels[currentLevel-1].spawnDelay;

  document.querySelectorAll(".box").forEach(b => b.remove());
  if (musicOn) bgMusic.play();
  spawnBox();
}

game.addEventListener("touchmove", (e) => {
  if (isGameOver) return;
  const touch = e.touches[0];
  const rect = game.getBoundingClientRect();
  playerX = touch.clientX - rect.left - player.clientWidth / 2;
  playerX = Math.max(0, Math.min(playerX, game.clientWidth - player.clientWidth));
  player.style.left = playerX + "px";
});

// ---------------------- SPAWN BOX ----------------------
function spawnBox() {
  if (isGameOver) return;

  const box = document.createElement("div");
  box.classList.add("box");
  box.style.left = Math.random() * (game.clientWidth - 30) + "px";
  box.style.top = "0px";
  game.appendChild(box);

  let fall = setInterval(() => {
    if (isGameOver) { clearInterval(fall); return; }
    let top = parseInt(box.style.top || "0");
    box.style.top = top + fallSpeed + "px";

    const boxRect = box.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();
    const lineY = catchLine.getBoundingClientRect().top;

    // Efek block kena garis
    if(boxRect.bottom >= lineY && boxRect.bottom < lineY + fallSpeed) {
      if(soundOn) lineHitSound.play();
      box.style.background = "yellow";
    }

    // Block kena player
    if (boxRect.bottom >= playerRect.top &&
        boxRect.left < playerRect.right &&
        boxRect.right > playerRect.left) {
      score++;
      scoreDisplay.innerText = "Score: " + score;
      if(soundOn) catchSound.play();
      box.remove();
      clearInterval(fall);
      if(score % 5 === 0){
        fallSpeed += 1;
        spawnDelay = Math.max(300, spawnDelay - 100);
      }
    }

    // Block jatuh ke bawah
    if (top > game.clientHeight) {
      lives--;
      updateLives();
      if(soundOn) missSound.play();
      box.remove();
      clearInterval(fall);
    }

  }, 30);

  spawnTimer = setTimeout(spawnBox, spawnDelay);
}

function updateLives() {
  if (lives === 3) livesDisplay.innerText = "❤️❤️❤️";
  if (lives === 2) livesDisplay.innerText = "❤️❤️";
  if (lives === 1) livesDisplay.innerText = "❤️";
  if (lives <= 0) {
    livesDisplay.innerText = "💀";
    gameOver();
  }
}

function gameOver() {
  isGameOver = true;
  clearTimeout(spawnTimer);
  finalScore.innerText = "Skor Akhir: " + score;
  gameOverScreen.style.display = "block";
  bgMusic.pause();
}

restartBtn.addEventListener("click", startGame);

// ---------------------- SETTINGS ----------------------
settingsBtn.addEventListener("click", () => { settingsMenu.style.display = "block"; });
closeSettings.addEventListener("click", () => { settingsMenu.style.display = "none"; });

document.addEventListener("click", (e) => {
  if(settingsMenu.style.display === "block" && !settingsMenu.contains(e.target) && e.target !== settingsBtn){
    settingsMenu.style.display = "none";
  }
});

musicToggle.addEventListener("change", () => {
  musicOn = musicToggle.checked;
  if (musicOn && !isGameOver) bgMusic.play();
  else bgMusic.pause();
});
soundToggle.addEventListener("change", () => { soundOn = soundToggle.checked; });

// ---------------------- LEVEL ----------------------
function selectLevel(level) {
  if(score >= levels[level-1].unlockScore || level===1){
    currentLevel = level;
    fallSpeed = levels[level-1].fallSpeed;
    spawnDelay = levels[level-1].spawnDelay;
    startGame();
  } else {
    alert("Kamu butuh skor " + levels[level-1].unlockScore + " untuk membuka level ini!");
  }
}

// ---------------------- BACKGROUND STARS ----------------------
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [];

function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function createStars(count){
  stars=[];
  for(let i=0;i<count;i++){
    stars.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      size: Math.random()*2,
      speed: Math.random()*1 + 0.5
    });
  }
}
createStars(100);

function animateStars(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="white";
  stars.forEach(star=>{
    ctx.beginPath();
    ctx.arc(star.x,star.y,star.size,0,Math.PI*2);
    ctx.fill();
    star.y += star.speed;
    if(star.y > canvas.height){
      star.y = 0;
      star.x = Math.random()*canvas.width;
    }
  });
  requestAnimationFrame(animateStars);
}
animateStars();

// ---------------------- START ----------------------
startGame();
