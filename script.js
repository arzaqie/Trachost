// ----- DOM Elements -----
const mainMenu = document.getElementById('mainMenu');
const startBtn = document.getElementById('startBtn');
const skinBtn = document.getElementById('skinBtn');
const missionBtn = document.getElementById('missionBtn');
const leaderboardBtn = document.getElementById('leaderboardBtn');

const gameUI = document.getElementById('gameUI');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const restartBtn = document.getElementById('restartBtn');

// ----- Game Variables -----
let bird = { x:50, y:300, width:20, height:20, dy:0, color:'yellow', skin:'default' };
let pipes = [];
let monsters = [];
let powerUps = [];
let frame = 0;
let score = 0;
let level = 0;
let gameOver = false;

// ----- Main Menu Events -----
startBtn.addEventListener('click',()=>{mainMenu.style.display='none';gameUI.style.display='flex';gameLoop();});
restartBtn.addEventListener('click',()=>{resetGame();restartBtn.style.display='none';gameLoop();});

// ----- Draw Functions -----
function drawBird(){ctx.fillStyle=bird.color;ctx.fillRect(bird.x,bird.y,bird.width,bird.height);}
function drawPipes(){ctx.fillStyle='green';pipes.forEach(p=>{ctx.fillRect(p.x,0,p.width,p.top);ctx.fillRect(p.x,canvas.height-p.bottom,p.width,p.bottom);});}
function drawMonsters(){ctx.fillStyle='red';monsters.forEach(m=>ctx.fillRect(m.x,m.y,m.width,m.height));}
function drawPowerUps(){ctx.fillStyle='blue';powerUps.forEach(p=>ctx.fillRect(p.x,p.y,p.size,p.size));}

// ----- Update Functions -----
function updatePipes(){if(frame%90===0){let top=Math.random()*200+50;let bottom=canvas.height-top-150;pipes.push({x:canvas.width,width:40,top,bottom});}pipes.forEach(p=>p.x-=2+level*0.2);pipes=pipes.filter(p=>p.x+p.width>0);}
function updateMonsters(){if(frame%300===0){monsters.push({x:canvas.width,y:Math.random()*500,width:30,height:30,dx:-2-level*0.2});}monsters.forEach(m=>m.x+=m.dx);monsters=monsters.filter(m=>m.x+m.width>0);}
function updatePowerUps(){if(frame%500===0){powerUps.push({x:canvas.width,y:Math.random()*500,size:20,dx:-2-level*0.1});}powerUps.forEach(p=>p.x+=p.dx);powerUps=powerUps.filter(p=>p.x+p.size>0);}
function checkCollision(){if(bird.y+bird.height>canvas.height||bird.y<0)return true;for(let p of pipes){if(bird.x<p.x+p.width && bird.x+bird.width>p.x && (bird.y<p.top || bird.y+bird.height>canvas.height-p.bottom)) return true;}for(let m of monsters){if(bird.x<m.x+m.width && bird.x+bird.width>m.x && bird.y<m.y+m.height && bird.y+bird.height>m.y) return true;}return false;}
function updateScoreAndLevel(){pipes.forEach(p=>{if(p.x+p.width===bird.x)score++;});level=Math.min(Math.floor(score/10),100);scoreDisplay.textContent=score;levelDisplay.textContent=level;}

// ----- Game Loop -----
function gameLoop(){if(gameOver)return;ctx.clearRect(0,0,canvas.width,canvas.height);drawBird();drawPipes();drawMonsters();drawPowerUps();bird.dy+=0.5;bird.y+=bird.dy;updatePipes();updateMonsters();updatePowerUps();updateScoreAndLevel();if(checkCollision()){gameOver=true;restartBtn.style.display='inline-block';}else{frame++;requestAnimationFrame(gameLoop);}}

// ----- Controls -----
document.addEventListener('keydown',()=>{if(!gameOver)bird.dy=-8;});

// ----- Reset Game -----
function resetGame(){bird={x:50,y:300,width:20,height:20,dy:0,color:'yellow',skin:'default'};pipes=[];monsters=[];powerUps=[];frame=0;score=0;level=0;gameOver=false;}
