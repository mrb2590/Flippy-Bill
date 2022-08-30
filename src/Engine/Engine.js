import { Physics } from './Physics';

export class Engine {
  constructor ({ canvasId, canvasWidth, canvasHeight }) {
    this.canvas = document.getElementById(canvasId);
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
    this.tickRate = 60;
    this.tickInterval = 1000 / this.tickRate;
    this.pastTickTimestamp = null;
    this.pastTimestamp = null;
    this.fps = null;
    this.debug = true;
    this.eventListeners = [];
    this.physics = new Physics();
  }

  gameLoop (timestamp) {
    const timeSinceLastTime = timestamp - this.pastTickTimestamp;

    if (timeSinceLastTime > this.tickInterval) {
      this.pastTickTimestamp =
        timestamp - (timeSinceLastTime % this.tickInterval);

      this.update(timeSinceLastTime);
    }

    this.render();

    if (this.debug) {
      this.updateDebug(timestamp);
      this.renderDebug();
    }

    window.requestAnimationFrame((timestamp) => {
      return this.gameLoop(timestamp);
    });
  }

  start () {
    this.bindEventListeners();
    this.gameLoop(window.performance.now());
  }

  update (timeSinceLastTime) {}

  render () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  updateDebug (timestamp) {
    const elapsedTime = timestamp - this.pastTimestamp;
    this.fps = Math.round(1 / (elapsedTime / 1000));
    this.pastTimestamp = timestamp;
  }

  renderDebug () {
    this.ctx.fillStyle = 'white';
    this.ctx.globalAlpha = 0.5;
    this.ctx.fillRect(0, 0, 50, 20);
    this.ctx.globalAlpha = 1;
    this.ctx.font = '10px Arial';
    this.ctx.fillStyle = '#000';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`FPS: ${this.fps}`, 25, 15, 50);
  }

  bindEventListeners () {
    for (let i = 0; i < this.eventListeners.length; i++) {
      this.eventListeners[i]();
    }
  }
}
