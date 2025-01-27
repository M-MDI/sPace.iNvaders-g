const game = document.getElementById('game');
const paddle = document.getElementById('paddle');
const ball = document.getElementById('ball');

let ballX = 300;
let ballY = 200;
let ballDX = 2;
let ballDY = 2;
let paddleX = (game.clientWidth - paddle.clientWidth) / 2;
const paddleWidth = 100;

let keys = {};

document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

function showPopup(message, callback) {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerHTML = `<p>${message}</p><button id='popup-btn'>OK</button>`;
    document.body.appendChild(popup);
    document.getElementById('popup-btn').addEventListener('click', () => {
        popup.remove();
        if (callback) callback();
    });
}

function createBricks(rows, cols) {
    const brickWidth = 60;
    const brickHeight = 20;
    const spacing = 10;
    const offsetX = 30;
    const offsetY = 50;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (row * cols + col >= 30) return;
            const brick = document.createElement('div');
            brick.classList.add('brick');
            brick.style.top = `${offsetY + row * (brickHeight + spacing)}px`;
            brick.style.left = `${offsetX + col * (brickWidth + spacing)}px`;
            game.appendChild(brick);
        }
    }
}

createBricks(5, 6);

function gameLoop() {
    if (keys['ArrowLeft'] && paddleX > 0) {
        paddleX -= 5;
    }
    if (keys['ArrowRight'] && paddleX < game.clientWidth - paddleWidth) {
        paddleX += 5;
    }
    paddle.style.left = `${paddleX}px`;

    ballX += ballDX;
    ballY += ballDY;

    if (ballX <= 0 || ballX >= game.clientWidth - ball.clientWidth) ballDX *= -1;
    if (ballY <= 0) ballDY *= -1;

    if (
        ballY + ball.clientHeight >= game.clientHeight - paddle.clientHeight &&
        ballX + ball.clientWidth >= paddleX &&
        ballX <= paddleX + paddleWidth
    ) {
        let paddleCenter = paddleX + paddleWidth / 2;
        let ballCenter = ballX + ball.clientWidth / 2;
        let bounceAngle = (ballCenter - paddleCenter) / (paddleWidth / 2);
        ballDX = bounceAngle * 4;
        ballDY *= -1;
    }

    if (ballY > game.clientHeight) {
        showPopup('Game Over!', () => location.reload());
        return;
    }

    document.querySelectorAll('.brick').forEach((brick) => {
        const rect = brick.getBoundingClientRect();
        const ballRect = ball.getBoundingClientRect();
        if (
            ballRect.left < rect.right &&
            ballRect.right > rect.left &&
            ballRect.top < rect.bottom &&
            ballRect.bottom > rect.top
        ) {
            brick.remove();
            ballDY *= -1;
        }
    });

    if (document.querySelectorAll('.brick').length === 0) {
        showPopup('You Win!', () => location.reload());
        return;
    }

    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;

    requestAnimationFrame(gameLoop);
}

showPopup('Click OK to start the game!', gameLoop);


document.head.appendChild(style);
