export class Engine {
  constructor () {
    this.renderer = {
      canvas: document.getElementById('gameCanvas'),
      ctx: null,
      lastTickTime: null,
      lastFrameTime: null,
      tickRate: 120,
      frameRate: 120,
      frameInterval: null
    };
    this.renderer.canvas.width = 3840;
    this.renderer.canvas.height = 2160;
    this.renderer.tickInterval = 1000 / this.renderer.tickRate;
    this.renderer.frameInterval = 1000 / this.renderer.frameRate;
    this.renderer.ctx = this.renderer.canvas.getContext('2d');
    this.game = null;
    this.scene = {
      top: 0,
      bottom: this.renderer.canvas.height,
      left: 0,
      right: this.renderer.canvas.width
    };
    this.physics = {
      gravity: 1.3
    };
    this.audioStack = [];
  }

  gameLoop (timestamp) {
    const tickElapsed = timestamp - this.renderer.lastFrameTime;
    const frameElapsed = timestamp - this.renderer.lastFrameTime;

    if (tickElapsed > this.renderer.tickInterval) {
      this.renderer.lastTickTime = timestamp - (tickElapsed % this.renderer.tickInterval);

      this.game.update();
    }

    if (frameElapsed > this.renderer.frameInterval) {
      this.renderer.lastFrameTime = timestamp - (frameElapsed % this.renderer.frameInterval);

      this.game.renderFrame();
    }

    requestAnimationFrame((timestamp) => {
      return this.gameLoop(timestamp);
    });
  }

  start (game) {
    this.game = game;
    this.bindListeners();

    this.gameLoop(window.performance.now());
  }

  bindListeners () {
    for (let i = 0; i < this.game.events.length; i++) {
      this.game.events[i].bind();
    }
  }
}
