// Canvas setup
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');
const playerScoreElement = document.getElementById('playerScore');
const aiScoreElement = document.getElementById('aiScore');

// Game objects
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 5,
    dx: 5,
    dy: 5
};

const playerPaddle = {
    x: 10,
    y: canvas.height / 2 - 50,
    width: 15,
    height: 100,
    speed: 8,
    dy: 0
};

const aiPaddle = {
    x: canvas.width - 25,
    y: canvas.height / 2 - 50,
    width: 15,
    height: 100,
    speed: 5
};

// Scores
let playerScore = 0;
let aiScore = 0;

// Mouse movement handler
canvas.addEventListener('mousemove', movePaddle);

function movePaddle(e) {
    const rect = canvas.getBoundingClientRect();
    playerPaddle.y = e.clientY - rect.top - playerPaddle.height / 2;
    
    // Keep paddle within canvas
    if (playerPaddle.y < 0) {
        playerPaddle.y = 0;
    } else if (playerPaddle.y + playerPaddle.height > canvas.height) {
        playerPaddle.y = canvas.height - playerPaddle.height;
    }
}

// Collision detection
function collision(b, p) {
    return b.x + b.radius > p.x && 
           b.x - b.radius < p.x + p.width && 
           b.y + b.radius > p.y && 
           b.y - b.radius < p.y + p.height;
}

// Reset ball
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = -ball.dx;
    ball.speed = 5;
}

// Update game objects
function update() {
    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Wall collision (top/bottom)
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }
    
    // Paddle collision
    if (collision(ball, playerPaddle)) {
        const hitPoint = (ball.y - (playerPaddle.y + playerPaddle.height / 2));
        const angle = (hitPoint / (playerPaddle.height / 2)) * (Math.PI / 4);
        ball.dx = ball.speed * Math.cos(angle);
        ball.dy = ball.speed * Math.sin(angle);
        ball.speed += 0.5;
    }
    
    if (collision(ball, aiPaddle)) {
        const hitPoint = (ball.y - (aiPaddle.y + aiPaddle.height / 2));
        const angle = (hitPoint / (aiPaddle.height / 2)) * (Math.PI / 4);
        ball.dx = -ball.speed * Math.cos(angle);
        ball.dy = ball.speed * Math.sin(angle);
        ball.speed += 0.5;
    }
    
    // AI paddle movement
    const aiPaddleCenter = aiPaddle.y + aiPaddle.height / 2;
    if (aiPaddleCenter < ball.y - 35) {
        aiPaddle.y += aiPaddle.speed;
    } else if (aiPaddleCenter > ball.y + 35) {
        aiPaddle.y -= aiPaddle.speed;
    }
    
    // Keep AI paddle within canvas
    if (aiPaddle.y < 0) {
        aiPaddle.y = 0;
    } else if (aiPaddle.y + aiPaddle.height > canvas.height) {
        aiPaddle.y = canvas.height - aiPaddle.height;
    }
    
    // Score points
    if (ball.x + ball.radius < 0) {
        aiScore++;
        aiScoreElement.textContent = aiScore;
        resetBall();
    } else if (ball.x - ball.radius > canvas.width) {
        playerScore++;
        playerScoreElement.textContent = playerScore;
        resetBall();
    }
}

// Draw game objects
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
    
    // Draw paddles
    ctx.fillStyle = 'white';
    ctx.fillRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height);
    ctx.fillRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);
    
    // Draw center line
    ctx.beginPath();
    ctx.setLineDash([10, 10]);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = 'white';
    ctx.stroke();
    ctx.setLineDash([]);
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();