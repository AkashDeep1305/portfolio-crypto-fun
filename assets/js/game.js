// Canvas mini-game: move the paddle to catch falling coins
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const state = {
    paddle: { x: canvas.width / 2 - 50, y: canvas.height - 20, w: 100, h: 10, speed: 8 },
    coins: [],
    score: 0,
    misses: 0,
    lastSpawn: 0,
    running: false,
    animationId: null
  };

  function spawnCoin() {
    const x = Math.random() * (canvas.width - 20) + 10;
    const speed = 2 + Math.random() * 3;
    state.coins.push({ x, y: -10, r: 10, speed });
  }

  function drawPaddle() {
    ctx.fillStyle = '#2a7cff';
    ctx.fillRect(state.paddle.x, state.paddle.y, state.paddle.w, state.paddle.h);
  }

  function drawCoin(c) {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(c.x, c.y, 4, c.x, c.y, c.r);
    grad.addColorStop(0, '#ffd45a');
    grad.addColorStop(1, '#ff7a18');
    ctx.fillStyle = grad;
    ctx.fill();
  }

  function updateCoins() {
    for (const c of state.coins) c.y += c.speed;
    // collision
    state.coins = state.coins.filter(c => {
      const hit = c.y + c.r >= state.paddle.y &&
        c.x >= state.paddle.x &&
        c.x <= state.paddle.x + state.paddle.w;
      const missed = c.y - c.r > canvas.height;
      if (hit) { state.score += 1; document.getElementById('score').textContent = state.score; return false; }
      if (missed) { state.misses += 1; document.getElementById('misses').textContent = state.misses; return false; }
      return true;
    });
  }

  function loop(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (timestamp - state.lastSpawn > 700) { spawnCoin(); state.lastSpawn = timestamp; }
    updateCoins();
    drawPaddle();
    state.coins.forEach(drawCoin);
    if (state.running) {
      state.animationId = requestAnimationFrame(loop);
    }
  }

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    state.paddle.x = Math.min(Math.max(x - state.paddle.w / 2, 0), canvas.width - state.paddle.w);
  });

  // Start button
  document.getElementById('startBtn').addEventListener('click', () => {
    if (!state.running) {
      state.running = true;
      state.animationId = requestAnimationFrame(loop);
    }
  });

  // Stop button
  document.getElementById('stopBtn').addEventListener('click', () => {
    state.running = false;
    if (state.animationId) cancelAnimationFrame(state.animationId);
  });

});
