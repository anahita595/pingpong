const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Paddle settings
const paddleWidth = 10, paddleHeight = 100, paddleMargin = 20;
const player = {
  x: paddleMargin,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: '#50fa7b',
  dy: 0
};
const ai = {
  x: canvas.width - paddleMargin - paddleWidth,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: '#ff5555',
  dy: 0
};

// Ball settings
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  speed: 6,
  dx: 6,
  dy: 3,
  color: '#f1fa8c'
};

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}
function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

function drawNet() {
  ctx.strokeStyle = "#444";
  for (let i = 0; i < canvas.height; i += 30) {
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, i);
    ctx.lineTo(canvas.width/2, i + 15);
    ctx.stroke();
  }
}

function draw() {
  // Clear
  drawRect(0, 0, canvas.width, canvas.height, '#111');

  // Net
  drawNet();

  // Paddles
  drawRect(player.x, player.y, player.width, player.height, player.color);
  drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);

  // Ball
  drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  // Randomize direction, keep speed
  ball.dx = Math.random() > 0.5 ? ball.speed : -ball.speed;
  ball.dy = (Math.random() - 0.5) * 8;
}

function update() {
  // Ball movement
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Top and bottom wall collision
  if (ball.y - ball.radius < 0) {
    ball.y = ball.radius;
    ball.dy *= -1;
  } else if (ball.y + ball.radius > canvas.height) {
    ball.y = canvas.height - ball.radius;
    ball.dy *= -1;
  }

  // Player paddle collision
  if (
    ball.x - ball.radius < player.x + player.width &&
    ball.y > player.y &&
    ball.y < player.y + player.height
  ) {
    ball.x = player.x + player.width + ball.radius; // Prevent sticking
    let collidePoint = (ball.y - (player.y + player.height / 2));
    collidePoint = collidePoint / (player.height / 2);
    let angle = collidePoint * (Math.PI / 4);
    let direction = 1;
    ball.dx = direction * ball.speed * Math.cos(angle);
    ball.dy = ball.speed * Math.sin(angle);
  }

  // AI paddle collision
  if (
    ball.x + ball.radius > ai.x &&
    ball.y > ai.y &&
    ball.y < ai.y + ai.height
  ) {
    ball.x = ai.x - ball.radius; // Prevent sticking
    let collidePoint = (ball.y - (ai.y + ai.height / 2));
    collidePoint = collidePoint / (ai.height / 2);
    let angle = collidePoint * (Math.PI / 4);
    let direction = -1;
    ball.dx = direction * ball.speed * Math.cos(angle);
    ball.dy = ball.speed * Math.sin(angle);
  }

  // Left and right wall (score)
  if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
    resetBall();
  }

  // AI paddle movement (simple tracking, add difficulty by reducing tracking speed)
  let aiCenter = ai.y + ai.height / 2;
  if (ball.y < aiCenter - 10) {
    ai.y -= 4;
  } else if (ball.y > aiCenter + 10) {
    ai.y += 4;
  }
  // Prevent AI paddle from going out of bounds
  ai.y = Math.max(0, Math.min(canvas.height - ai.height, ai.y));
}

// Mouse movement for player paddle
canvas.addEventListener('mousemove', (evt) => {
  const rect = canvas.getBoundingClientRect();
  const mouseY = evt.clientY - rect.top;
  player.y = mouseY - player.height / 2;
  // Prevent going out of bounds
  player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
});

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Initial call
resetBall();
gameLoop();
