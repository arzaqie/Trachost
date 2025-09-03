const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let bird = { x: 50, y: 300, width: 20, height: 20, dy: 0 };
let pipes = [];
let frame = 0;
let score = 0;

function drawBird() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    ctx.fillStyle = 'green';
    pipes.forEach(p => {
        ctx.fillRect(p.x, 0, p.width, p.top);
        ctx.fillRect(p.x, canvas.height - p.bottom, p.width, p.bottom);
    });
}

function updatePipes() {
    if(frame % 90 === 0) {
        let top = Math.random() * 200 + 50;
        let bottom = canvas.height - top - 150;
        pipes.push({ x: canvas.width, width: 40, top, bottom });
    }
    pipes.forEach(p => p.x -= 2);
    pipes = pipes.filter(p => p.x + p.width > 0);
}

function checkCollision() {
    if(bird.y + bird.height > canvas.height || bird.y < 0) return true;
    for(let p of pipes) {
        if(bird.x < p.x + p.width && bird.x + bird.width > p.x &&
           (bird.y < p.top || bird.y + bird.height > canvas.height - p.bottom)) return true;
    }
    return false;
}

function drawScore() {
    document.getElementById('score').textContent = score;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();
    updatePipes();
    bird.dy += 0.5; // gravitasi
    bird.y += bird.dy;

    pipes.forEach(p => {
        if(p.x + p.width === bird.x) score++;
    });

    drawScore();

    if(checkCollision()) {
        alert('Game Over! Skor: ' + score);
        location.reload();
    } else {
        frame++;
        requestAnimationFrame(gameLoop);
    }
}

document.addEventListener('keydown', () => {
    bird.dy = -8; // lompat
});

gameLoop();
