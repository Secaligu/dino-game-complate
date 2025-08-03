let dino = document.getElementById("dino");
let cactus = document.getElementById("cactus");
let cactusSmall = document.getElementById("cactusSmall");
let scoreText = document.getElementById("score");
let gameOverText = document.getElementById("gameOver");
let finalScoreEl = document.getElementById("finalScore");

let isJumping = false;
let velocity = 0;
let gravity = 0.6;
let score = 0;
let highScore = localStorage.getItem('dinoHighScore') || 0;
let gameSpeed = 5;
let gameInterval;

function jump() {
  if (!isJumping) {
    velocity = 12;
    isJumping = true;

    // Moonwalk + boca abierta
    dino.classList.add('mouth-open');
    dino.style.transition = "transform 0.2s";
    dino.style.transform = "translateX(-10px)";

    setTimeout(() => {
      dino.style.transform = "translateX(0)";
    }, 200);

    // Cierra la boca después del salto
    setTimeout(() => {
      dino.classList.remove('mouth-open');
    }, 600);
  }
}

function updateDino() {
  velocity -= gravity;
  let bottom = parseFloat(dino.style.bottom || 2);
  bottom += velocity;
  if (bottom <= 2) {
    bottom = 2;
    isJumping = false;
    velocity = 0;
  }
  dino.style.bottom = bottom + "px";
}

function moveObstacle(obs) {
  let left = parseFloat(obs.style.right || -30);
  left += gameSpeed;
  obs.style.right = left + "px";

  if (left > window.innerWidth + 60) {
    obs.style.right = "-30px";
  }

  score++; // sumar punto cada vez que se mueven
  updateScore();
  checkCollision(obs);
}

function checkCollision(obs) {
  const dinoBox = dino.getBoundingClientRect();
  const obsBox = obs.getBoundingClientRect();

  const collide =
    dinoBox.right - 10 > obsBox.left + 5 &&
    dinoBox.left + 10 < obsBox.right - 5 &&
    dinoBox.bottom > obsBox.top + 5;

  if (collide) endGame();
}

function updateScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('dinoHighScore', highScore);
  }

  scoreText.innerText = `HI ${String(highScore).padStart(4, "0")} ${String(score).padStart(4, "0")}`;

  // Modo día/noche según puntuación
  if (score % 400 < 200) {
    document.body.style.backgroundColor = "#f1f8e9"; // día
    document.querySelector(".game-container").style.background = "#ffffff";
  } else {
    document.body.style.backgroundColor = "#263238"; // noche
    document.querySelector(".game-container").style.background = "#37474f";
  }
}

function startGame() {
  dino.style.bottom = "2px";
  cactus.style.right = "-30px";
  cactusSmall.style.right = "-60px";
  gameOverText.style.display = "none";
  score = 0;
  gameSpeed = 10; // velocidad inicial más rápida
  updateScore();

  gameInterval = setInterval(() => {
    updateDino();

    if (Math.random() < 0.07) moveObstacle(cactus);
    if (Math.random() < 0.08) moveObstacle(cactusSmall);

   if (gameSpeed < 25) gameSpeed += 0.01; // acelera más rápido y permite mayor velocidad máxima
  }, 20);
}

function endGame() {
  clearInterval(gameInterval);
  finalScoreEl.innerText = score;
  gameOverText.style.display = "block";
}

function restartGame() {
  clearInterval(gameInterval);
  startGame();
}

document.addEventListener("keydown", e => {
  if (e.code === "Space") jump();
});
document.addEventListener("click", jump);

startGame();