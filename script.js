let goku = document.querySelector(".goku");
let gameContainer = document.querySelector("#game-container");
let gokuKameha = document.querySelector(".kameha");
let frizaKiBlast = document.querySelector(".kiBlast");
let lifeBar = document.querySelector("#life-bar");
let frizaLifeBar = document.querySelector("#friza-life-bar");
let friza = document.querySelector(".friza");
let gameOver = false;

let gokuY = 10;
let gokuX = 50;
const gokuSpeed = 10;

let kamehaSpeed = 50;
let kamehaReleased = false;
let frizaHitCount = 0;
const requiredHits = 5;

let kiBlastIntervalId;

const gokuMaxLife = 5;
let gokuLife = gokuMaxLife;

const frizaMaxLife = 5;
let frizaLife = frizaMaxLife;

document.addEventListener("keydown", function (event) {
  if (gameOver) return;

  if (event.key === "ArrowUp") {
    gokuY -= gokuSpeed;
  } else if (event.key === "ArrowDown") {
    gokuY += gokuSpeed;
  } else if (event.key === " ") {
    if (!kamehaReleased) {
      releaseKameha();
    }
  }
  goku.style.top = gokuY + "px";
  goku.style.left = gokuX + "px";
});

function releaseKameha() {
  kamehaReleased = true;
  if (gameOver) return;

  gokuKameha.style.top = gokuY + 50 + "px";
  gokuKameha.style.left = gokuX + 100 + "px";
  gokuKameha.style.display = "block";

  let kamehaX = gokuX + 100;
  const kamehaInterval = setInterval(() => {
    kamehaX += kamehaSpeed;
    gokuKameha.style.left = kamehaX + "px";

    if (kamehaX > gameContainer.offsetWidth) {
      clearInterval(kamehaInterval);
      gokuKameha.style.display = "none";
      kamehaReleased = false;
    }

    if (isColliding(gokuKameha, friza)) {
      clearInterval(kamehaInterval);
      gokuKameha.style.display = "none";
      kamehaReleased = false;
      frizaHit();
    }
  }, 10);
}

function isColliding(kameha, friza) {
  let kamehaRect = kameha.getBoundingClientRect();
  let frizaRect = friza.getBoundingClientRect();

  return !(
    kamehaRect.top > frizaRect.bottom ||
    kamehaRect.bottom < frizaRect.top ||
    kamehaRect.left > frizaRect.right ||
    kamehaRect.right < frizaRect.left
  );
}

function frizaHit() {
  frizaHitCount++;
  reduceFrizaLife();
  if (frizaHitCount >= requiredHits) {
    showResult("You win! Goku defeated Frieza!");
  }
}

function startFrizaMovement() {
  if (gameOver) return;

  let frizaY = Math.random() * (gameContainer.offsetHeight - 100);
  friza.style.top = frizaY + "px";

  setInterval(() => {
    frizaY = Math.random() * (gameContainer.offsetHeight - 100);
    friza.style.top = frizaY + "px";
  }, 2000);
}

startFrizaMovement();

function reduceFrizaLife() {
  frizaLife--;
  updateFrizaLifeBar();
}

function updateFrizaLifeBar() {
  frizaLifeBar.style.width = (frizaLife / frizaMaxLife) * 200 + "px";
}

function updateLifeBar() {
  lifeBar.style.width = (gokuLife / gokuMaxLife) * 200 + "px";
}

function resetGame() {
  const resultPopup = document.getElementById("result-popup");
  resultPopup.classList.add("hidden");

  gokuY = 10;
  gokuX = 50;
  goku.style.top = gokuY + "px";
  goku.style.left = gokuX + "px";
  gokuLife = gokuMaxLife;
  frizaLife = frizaMaxLife;
  frizaHitCount = 0;
  updateLifeBar();
  updateFrizaLifeBar();
  kamehaReleased = false;

  gameOver = false;

  startFrizaMovement();
  randomKiBlastAttack();
}

let kiBlastSpeed = 5;
let kiBlastReleased = false;

function releaseKiBlast() {
  kiBlastReleased = true;

  if (gameOver) return;

  let blastY = friza.getBoundingClientRect().top - gameContainer.getBoundingClientRect().top;
  let blastX = friza.getBoundingClientRect().left - gameContainer.getBoundingClientRect().left;

  frizaKiBlast.style.top = blastY + "px";
  frizaKiBlast.style.left = blastX + "px";
  frizaKiBlast.style.display = "block";

  const kiBlastInterval = setInterval(() => {
    blastX -= kiBlastSpeed;
    frizaKiBlast.style.left = blastX + "px";

    if (blastX < 0) {
      clearInterval(kiBlastInterval);
      frizaKiBlast.style.display = "none";
      kiBlastReleased = false;
    }

    if (isColliding(goku, frizaKiBlast)) {
      clearInterval(kiBlastInterval);
      reduceLife();
      frizaKiBlast.style.display = "none";
      kiBlastReleased = false;
    }
  }, 10);
}

function randomKiBlastAttack() {
  if (kiBlastIntervalId) {
    clearInterval(kiBlastIntervalId);
  }

  kiBlastIntervalId = setInterval(() => {
    if (!kiBlastReleased) {
      releaseKiBlast();
    }
  }, Math.random() * 3000 + 1000);
}

function reduceLife() {
  gokuLife--;
  updateLifeBar();

  if (gokuLife <= 0) {
    showResult("Game Over.. Frieza defeated Goku.");
  }
}

randomKiBlastAttack();

function showResult(message) {
  const resultPopup = document.getElementById("result-popup");
  const resultMessage = document.getElementById("result-message");

  resultMessage.textContent = message;
  resultPopup.classList.remove("hidden");

  gameOver = true;

  clearInterval(kiBlastIntervalId);
}
