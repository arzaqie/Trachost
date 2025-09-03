const game = document.getElementById("game");
const player = document.getElementById("player");
const catchLine = document.getElementById("catchLine");
const scoreValue = document.getElementById("scoreValue");
const livesDisplay = document.getElementById("lives");
const gameOverScreen = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const restartBtn = document.getElementById("restart");
const backMenuBtn = document.getElementById("backMenu");

const bgMusic = document.getElementById("bgMusic");
const lineHitSound = document.getElementById("lineHitSound");
const missSound = document.getElementById("missSound");

const settingsBtn = document.getElementById("settingsBtn");
const settingsMenu = document.getElementById("settingsMenu");
const musicToggle = document.getElementById("musicToggle");
const soundToggle = document.getElementById("soundToggle");
const closeSettings = document.getElementById("closeSettings");

const mainMenu = document.getElementById("mainMenu");
const playBtn = document.getElementById("playBtn");
const menuLevelBtn = document.getElementById("menuLevelBtn");
const menuSettingsBtn = document.getElementById("menuSettingsBtn");
const levelMenu = document.getElementById("levelMenu");

let score, lives, playerX, isGameOver, spawnTimer;
let musicOn = true, soundOn = true;
let fallSpeed, spawnDelay, currentLevel = 1;

// ---------------- LEVELS ----------------
const levels = [
  {level:1,fallSpeed:5,spawnDelay:1000,unlockScore:0},
  {level:2,fallSpeed:6,spawnDelay:900,unlockScore:1000},
  {level:3,fallSpeed:7,spawnDelay:800,unlockScore:2000},
  {level:4,fallSpeed:8,spawnDelay:700,unlockScore:3000},
  {level:5,fallSpeed:9,spawnDelay:650,unlockScore:4000},
  {level:6,fallSpeed:10,spawnDelay:600,unlockScore:5000},
  {level:7,fallSpeed:11,spawnDelay:550,unlockScore:6000},
  {level:8,fallSpeed:12,spawnDelay:500,unlockScore:7000},
  {level:9,fallSpeed:13,spawnDelay:450,unlockScore:8000},
  {level:10,fallSpeed:14,spawnDelay:400,unlockScore:9000},
  {level:11,fallSpeed:0,spawnDelay:0,unlockScore:10000,comingSoon:true}
];

// ---------------- INIT ----------------
window.onload = () => {
  mainMenu.style.display="block";
  levelMenu.style.display="none";
  settingsMenu.style.display="none";
  gameOverScreen.style.display="none";
};

// ---------------- MENU ----------------
playBtn.onclick = ()=>{mainMenu.style.display="none"; startGame();}
menuLevelBtn.onclick = ()=>{mainMenu.style.display="none"; levelMenu.style.display="block";}
menuSettingsBtn.onclick = ()=>{mainMenu.style.display="none"; settingsMenu.style.display="block";}
settingsBtn.onclick = ()=>{settingsMenu.style.display="block";}
closeSettings.onclick = ()=>{settingsMenu.style.display="none";}
musicToggle.onchange = ()=>{musicOn=musicToggle.checked;if(musicOn && !isGameOver) bgMusic.play(); else bgMusic.pause();}
soundToggle.onchange = ()=>{soundOn=soundToggle.checked;}

// ---------------- LEVEL SELECT ----------------
function selectLevel(level){
  const lvl = levels[level-1];
  if(lvl.comingSoon){ alert("Level "+level+" Coming Soon!"); return; }
  if(score>=lvl.unlockScore || level===1){
    currentLevel=level; fallSpeed=lvl.fallSpeed; spawnDelay=lvl.spawnDelay;
    levelMenu.style.display="none"; startGame();
  } else alert("Kamu butuh skor "+lvl.unlockScore+" untuk membuka level ini!");
}
function backToMenu(){ levelMenu.style.display="none"; mainMenu.style.display="block"; }

// ---------------- START GAME ----------------
function startGame(){
  score=0; lives=3; isGameOver=false;
  playerX = game.clientWidth/2 - player.clientWidth/2;
  player.style.left = playerX+"px"; updateCatchLine();
  scoreValue.innerText = score; livesDisplay.innerText = "❤️❤️❤️";
  gameOverScreen.style.display = "none";
  fallSpeed = levels[currentLevel-1].fallSpeed;
  spawnDelay = levels[currentLevel-1].spawnDelay;
  document.querySelectorAll(".item").forEach(b=>b.remove());
  if(musicOn) bgMusic.play();
  spawnItem();
}

// ---------------- PLAYER CONTROL ----------------
game.addEventListener("mousemove", e=>{
  if(isGameOver) return;
  const rect = game.getBoundingClientRect();
  playerX = e.clientX - rect.left - player.clientWidth/2;
  playerX = Math.max(0, Math.min(playerX, game.clientWidth - player.clientWidth));
  player.style.left = playerX + "px";
  updateCatchLine();
});
function updateCatchLine(){ catchLine.style.left = (playerX+player.clientWidth/2-40) + "px"; }

// ---------------- SPAWN ITEM ----------------
function spawnItem(){
  if(isGameOver) return;
  const box = document.createElement("div"); box.classList.add("item");
  const emojis = ["⭐","🌟","💎","🔥","🍀"];
  box.innerText = emojis[Math.floor(Math.random()*emojis.length)];
  box.style.left = Math.random()*(game.clientWidth-40)+"px";
  game.appendChild(box);

  let fall = setInterval(()=>{
    if(isGameOver){ clearInterval(fall); return; }
    let top = parseInt(box.style.top||"0"); box.style.top = top+fallSpeed+"px";

    const boxRect = box.getBoundingClientRect();
    const lineRect = catchLine.getBoundingClientRect();
    if(boxRect.bottom>=lineRect.top && boxRect.top<=lineRect.bottom &&
       boxRect.left+20>=lineRect.left && boxRect.right-20<=lineRect.right){
      score++; scoreValue.innerText=score;
      if(soundOn) lineHitSound.play(); box.remove(); clearInterval(fall);
      if(score%5===0){ fallSpeed+=1; spawnDelay=Math.max(300, spawnDelay-50); }
    }

    if(top>game.clientHeight){
      lives--; updateLives(); if(soundOn) missSound.play(); box.remove(); clearInterval(fall);
    }
  },30);

  spawnTimer = setTimeout(spawnItem, spawnDelay);
}

// ---------------- UPDATE LIVES ----------------
function updateLives(){
  if(lives===3) livesDisplay.innerText="❤️❤️❤️";
  else if(lives===2) livesDisplay.innerText="❤️❤️";
  else if(lives===1) livesDisplay.innerText="❤️";
  else{ livesDisplay.innerText="💀"; gameOver(); }
}

// ---------------- GAME OVER ----------------
function gameOver(){
  isGameOver=true; clearTimeout(spawnTimer);
  finalScore.innerText = "Skor Akhir: "+score; gameOverScreen.style.display="block";
  bgMusic.pause();
}
restartBtn.onclick = ()=>startGame();
backMenuBtn.onclick = ()=>{gameOverScreen.style.display="none"; mainMenu.style.display="block";}
