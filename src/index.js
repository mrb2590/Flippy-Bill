import sGameOver from './audio/game-over.mp3';
import sBam from './audio/bam.mp3';
import sNice from './audio/nice.mp3';
import sWoosh from './audio/woosh.mp3';
import sOhh from './audio/ohh.mp3';

const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = canvas.width / 2;

function pt (pt) {
  return canvas.width * 0.01 * pt;
}

const defaultPlayer = {
  size: 10,
  alive: true,
  x: 50,
  y: 100,
  v: 0,
  up: false,
  width: pt(2),
  height: pt(2),
  checkGroundCollision () {
    return player.y + player.height >= canvas.height;
  }
};

const pipe = {
  x: 0,
  width: pt(5),
  openingY: pt(30),
  openingHeight: pt(20),
  checkPlayerCollision () {
    return player.x + player.width >= this.x &&
      player.x < this.x + this.width && (
      player.y <= this.openingY || player.y > this.openingY + this.openingHeight
    );
  }
};

var player = { ...defaultPlayer };
let pipeQueue = [];
let score = 0;
let highScore = 0;
let pause = true;
let jump = false;
let wingTicks = 0;

const gravity = 1;
const ceiling = 0;
const ground = canvas.height;
const jumpVelocity = 15;
const tickRate = 60;
const fpsInterval = 1000 / tickRate;
const scrollSpeed = 3;
let ctx;
let now;
let then;
let elapsed;

window.onload = function () {
  document.body.onkeydown = function (e) {
    const key = e.key || e.keyCode;

    if (key == 32 || key === ' ') {
      if (!pause) {
        playerJump();
      }
    }

    if (key == 13 || key === 'Enter') {
      if (pause) {
        pause = false;
        resetGame();
      }
    }
  };

  ctx = canvas.getContext('2d');
  startGameLoop();
};

function gameLoop (newtime) {
  requestAnimationFrame(gameLoop);

  now = newtime;
  elapsed = now - then;

  if (elapsed > fpsInterval) {
    then = now - (elapsed % fpsInterval);

    if (!pause) {
      drawFrame();
      checkGameOver();
    } else {
      drawPauseScreen();
    }
  }
}

function playerJump () {
  player.v = jumpVelocity;
  player.up = true;
  const sound = new Audio(sWoosh);
  sound.play();
  jump = true;
  wingTicks = 0;
}

function startGameLoop () {
  then = window.performance.now();
  gameLoop();
}

function drawFrame () {
  drawBackground();
  drawPipes();
  drawPlayer();
  updateScore();
  drawScore();
}

function updateScore () {
  for (let i = 0; i < pipeQueue.length; i++) {
    if (player.x > pipeQueue[i].x + pipeQueue[i].width + 1 && player.x < pipeQueue[i].x + pipeQueue[i].width + 3) {
      score++;

      if (score > highScore) {
        highScore = score;
      }

      const sound = new Audio(sNice);
      sound.play();
    }
  }
}

function checkGameOver () {
  for (let i = 0; i < pipeQueue.length; i++) {
    if (pipeQueue[i].checkPlayerCollision()) {
      const sound = new Audio(sBam);
      sound.play();
      pause = true;
      break;
    }
  }

  if (player.checkGroundCollision()) {
    const sound = new Audio(sOhh);
    sound.play();
    pause = true;
  }

  if (pause) {
    setTimeout(() => {
      const sound = new Audio(sGameOver);
      sound.play();
    }, 500);
  }
}

function drawPauseScreen () {
  drawBackground();
  drawPlayer();

  ctx.font = '20px serif';
  ctx.fillStyle = '#000000';
  ctx.fillText('START', canvas.width - (canvas.width / 2), canvas.height - (canvas.height / 2));

  ctx.fillStyle = '#000000';
  ctx.fillText('Score: ' + score, canvas.width - (canvas.width / 2), canvas.height - (canvas.height / 2) + 50);

  ctx.fillStyle = '#000000';
  ctx.fillText('High Score: ' + highScore, canvas.width - (canvas.width / 2), canvas.height - (canvas.height / 2) + 100);
}

function resetGame () {
  pipeQueue = [];
  player = { ...defaultPlayer };
  score = 0;
  sound.pause();
  sound.currentTime = 0;
}

function drawBackground () {
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawScore () {
  ctx.font = '20px serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(canvas.width - 50, 0, 50, 50);
  ctx.fillStyle = '#000000';
  ctx.fillText(score, canvas.width - 30, 25);
}

function drawPlayer () {
  if (!pause) {
    if (player.up) {
      player.v -= gravity;
      player.y -= player.v;

      if (player.v <= 0) {
        player.up = false;
      }
    } else {
      player.v += gravity;
      player.y += player.v;
    }

    if (player.y <= ceiling) {
      player.y = ceiling;
      player.v = 0;
      player.up = false;
    }

    if (player.y >= ground - player.height) {
      player.y = ground - player.height;
      player.v = 0;
    }
  }

  ctx.fillStyle = '#000000';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  if (!jump) {
    // Left wing
    ctx.fillRect(player.x - 5, player.y + (player.height / 2 - 1), 5, 2);
    // right wing
    ctx.fillRect(player.x + player.width, player.y + (player.height / 2 - 1), 5, 2);
  } else {
    if (wingTicks > 5) {
      wingTicks = 0;
      jump = false;
    }

    ctx.save();
    ctx.translate(player.x, player.y + (player.height / 2 + 1));
    ctx.rotate(-20 * Math.PI / 180);
    ctx.translate(-(player.x), -(player.y + (player.height / 2 + 1)));
    // Left wing
    ctx.fillRect(player.x - 5, player.y + (player.height / 2 - 1), 5, 2);

    ctx.resetTransform();

    ctx.restore();

    ctx.save();
    // right wing
    ctx.translate(player.x + player.width, player.y + (player.height / 2 - 1));
    ctx.rotate(20 * Math.PI / 180);
    ctx.translate(-(player.x + player.width), -(player.y + (player.height / 2 - 1)));
    ctx.fillRect(player.x + player.width, player.y + (player.height / 2 - 1), 5, 2);

    ctx.resetTransform();
    ctx.restore();

    wingTicks++;
  }
}

function drawPipes () {
  let shift = false;

  if (pipeQueue.length === 0 || pipeQueue[pipeQueue.length - 1].x + pipeQueue[pipeQueue.length - 1].width < canvas.width - pt(20)) {
    const newPipe = { ...pipe };
    newPipe.x = canvas.width;
    newPipe.openingY = Math.floor(Math.random() * (canvas.height - pipe.openingHeight - 50 + 1) + 50);
    pipeQueue.push(newPipe);
  }

  for (let i = 0; i < pipeQueue.length; i++) {
    pipeQueue[i].x -= scrollSpeed;

    if (pipeQueue[i].x + pipeQueue[i].width <= 0) {
      shift = true;
    } else {
      ctx.fillStyle = '#000000';
      ctx.fillRect(pipeQueue[i].x, 0, pipeQueue[i].width, canvas.height);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(pipeQueue[i].x, pipeQueue[i].openingY, pipeQueue[i].width, pipeQueue[i].openingHeight);
    }
  }

  if (shift) {
    pipeQueue.shift();
  }
}
