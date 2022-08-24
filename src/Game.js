import { Engine } from './Engine/Engine';
import { Player } from './Entities/Player/Player';
import { Hoop } from './Entities/Hoop/Hoop';
import { Scene } from './Entities/Scene/Scene';

export class Game extends Engine {
  constructor () {
    super({
      canvasId: 'gameCanvas',
      canvasWidth: 1920,
      canvasHeight: 1080
    });

    this.gameOver = true;
    this.isPaused = false;
    this.scene = new Scene(this);
    this.player = new Player(this);
    this.hoopQueue = [];

    this.eventListeners.push(() => {
      return this.canvas.addEventListener('keydown', (event) => {
        console.log(this);
        if (event.code === 'Space') {
          if (this.gameOver) {
            this.resetGame();
          }
        }
      });
    });
  }

  update () {
    super.update();

    if (this.isPaused || this.gameOver) {
      return;
    }

    this.scene.update();
    this.player.update();
    let shift = false;

    if (this.player.checkGroundCollision()) {
      this.gameOver = true;
    }

    if (
      this.hoopQueue.length === 0 ||
      (this.hoopQueue.length > 0 &&
        this.hoopQueue[this.hoopQueue.length - 1].x <
          this.scene.width - Hoop.width - 300)
    ) {
      this.hoopQueue.push(new Hoop(this));
    }

    for (let i = 0; i < this.hoopQueue.length; i++) {
      this.hoopQueue[i].update();

      if (this.hoopQueue[i].x + Hoop.width <= 0) {
        shift = true;
      }

      if (this.hoopQueue[i].checkPlayerCollision()) {
        console.log('hit');
      }
    }

    if (shift) {
      this.hoopQueue.shift();
    }
  }

  render () {
    super.render();
    this.scene.render();

    for (let i = 0; i < this.hoopQueue.length; i++) {
      this.hoopQueue[i].renderLeft();
    }

    this.player.render();

    for (let i = 0; i < this.hoopQueue.length; i++) {
      this.hoopQueue[i].renderRight();
    }
  }

  resetGame () {
    this.player.reset();
    this.hoopQueue = [];
    this.gameOver = false;
  }
}
