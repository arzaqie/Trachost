// ---- MENU & LEVEL SELECT ----
const mainMenu=document.getElementById("mainMenu");
const levelSelect=document.getElementById("levelSelect");
const levelButtons=document.getElementById("levelButtons");
const gameDiv=document.getElementById("game");
const startBtn=document.getElementById("startBtn");

let currentLevel=1;
let totalScore=0;
const levelUnlockScore=[0,100,300,600,1000,1500,2100,2800,3600,4500]; 

startBtn.onclick=showLevelSelect;

function showLevelSelect(){
  mainMenu.style.display="none";
  levelSelect.style.display="flex";
  levelButtons.innerHTML="";
  for(let i=1;i<=11;i++){
    const btn=document.createElement("button");
    if(i<=10){
      if(totalScore>=levelUnlockScore[i-1]){
        btn.innerText=`Level ${i}`; btn.disabled=false;
      } else { btn.innerText=`🔒 Level ${i}`; btn.disabled=true; btn.classList.add("locked"); }
    } else { btn.innerText=`Level 11 (Coming Soon)`; btn.disabled=true; btn.classList.add("locked"); }
    btn.onclick=()=>startGame(i);
    levelButtons.appendChild(btn);
  }
}

function backToMenu(){
  gameDiv.style.display="none"; 
  levelSelect.style.display="none"; 
  mainMenu.style.display="flex";
}

// ---- GAME ELEMENTS ----
const player=document.getElementById("player");
const catchLine=document.getElementById("catchLine");
const scoreValue=document.getElementById("scoreValue");
const livesDisplay=document.getElementById("lives");
const gameOverScreen=document.getElementById("gameOver");
const finalScore=document.getElementById("finalScore");
const restartBtn=document.getElementById("restart");

const bgMusic=document.getElementById("bgMusic");
const lineHitSound=document.getElementById("lineHitSound");
const missSound=document.getElementById("missSound");

const settingsBtn=document.getElementById("settingsBtn");
const settingsMenu=document.getElementById("settingsMenu");
const musicToggle=document.getElementById("musicToggle");
const soundToggle=document.getElementById("soundToggle");
const closeSettings=document.getElementById("closeSettings");

let score,lives,playerX,isGameOver,spawnTimer,gamePaused=false;
let musicOn=true,soundOn=true;
let fallSpeed=5,spawnDelay=1000;

// ---- START GAME ----
function startGame(level){
  levelSelect.style.display="none"; gameDiv.style.display="block";
  currentLevel=level; score=0; lives=3; isGameOver=false;
  fallSpeed=5+level; spawnDelay=Math.max(300,1000-50*level);
  playerX=gameDiv.clientWidth/2-player.clientWidth/2;
  player.style.left=playerX+"px";
  catchLine.style.left=(playerX+player.clientWidth/2-catchLine.clientWidth/2)+"px";
  scoreValue.innerText=score; livesDisplay.innerText="❤️❤️❤️";
  gameOverScreen.style.display="none";
  document.querySelectorAll(".item").forEach(b=>b.remove());
  if(musicOn) bgMusic.play();
  spawnItem();
}

// ---- PLAYER CONTROL ----
gameDiv.addEventListener("mousemove", e=>{
  if(isGameOver||gamePaused) return;
  const rect=gameDiv.getBoundingClientRect();
  playerX=e.clientX-rect.left-player.clientWidth/2;
  playerX=Math.max(0,Math.min(playerX,gameDiv.clientWidth-player.clientWidth));
  player.style.left=playerX+"px";
  catchLine.style.left=(playerX+player.clientWidth/2-catchLine.clientWidth/2)+"px";
});

// ---- SPAWN ITEM ----
function spawnItem(){
  if(isGameOver||gamePaused) return;
  const box=document.createElement("div"); box.classList.add("item");
  const emojis=["⭐","🌟","💎","🔥","🍀"];
  box.innerText=emojis[Math.floor(Math.random()*emojis.length)];
  box.style.left=Math.random()*(gameDiv.clientWidth-40)+"px";
  gameDiv.appendChild(box);

  let fall=setInterval(()=>{
    if(isGameOver||gamePaused){ clearInterval(fall); return; }
    let top=parseInt(box.style.top||"0");
    box.style.top=top+fallSpeed+"px";

    const boxRect=box.getBoundingClientRect();
    const lineRect=catchLine.getBoundingClientRect();

    if(boxRect.bottom>=lineRect.top && boxRect.top<=lineRect.bottom &&
       boxRect.left+20>=lineRect.left && boxRect.right-20<=lineRect.right){
      score++; scoreValue.innerText=score;
      totalScore++; 
      if(soundOn) lineHitSound.play(); box.remove(); clearInterval(fall);
    }
    if(top>gameDiv.clientHeight){ lives--; updateLives(); if(soundOn) missSound.play(); box.remove(); clearInterval(fall);}
  },30);

  spawnTimer=setTimeout(spawnItem,spawnDelay);
}

// ---- LIVES & GAME OVER ----
function updateLives(){
  livesDisplay.innerText=lives===3?"❤️❤️❤️":lives===2?"❤️❤️":lives===1?"❤️":"💀";
  if(lives<=0) gameOver();
}
function gameOver(){
  isGameOver=true; clearTimeout(spawnTimer);
  finalScore.innerText="Skor Akhir: "+score;
  gameOverScreen.style.display="block";
  bgMusic.pause();
}
restartBtn.onclick=()=>startGame(currentLevel);

// ---- SETTINGS ----
settingsBtn.onclick=()=>{
  gamePaused=true;
  settingsMenu.style.display="block";
}
closeSettings.onclick=()=>{
  settingsMenu.style.display="none";
  gamePaused=false;
}
musicToggle.onchange=()=>{musicOn=musicToggle.checked; if(musicOn&&!isGameOver) bgMusic.play(); else bgMusic.pause();}
soundToggle.onchange=()=>{soundOn=soundToggle.checked;}

// ---- STARS BACKGROUND ----
const canvas=document.getElementById("stars");
const ctx=canvas.getContext("2d"); let stars=[];
function resizeCanvas(){ canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
resizeCanvas(); window.addEventListener("resize",resizeCanvas);
function createStars(count){ stars=[]; for(let i=0;i<count;i++){ stars.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,size:Math.random()*2,speed:Math.random()*1+0.5}); } }
createStars(100);
function animateStars(){ ctx.clearRect(0,0,canvas.width,canvas.height); ctx.fillStyle="white"; stars.forEach(star=>{ ctx.beginPath(); ctx.arc(star.x,star.y,star.size,0,Math.PI*2); ctx.fill(); star.y+=star.speed; if(star.y>canvas.height){ star.y=0; star.x=Math.random()*canvas.width; } }); requestAnimationFrame(animateStars); }
animateStars();
