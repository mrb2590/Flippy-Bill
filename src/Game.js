import { Engine } from './Engine/Engine';
import { Player } from './Entities/Player/Player';
import { Scene } from './Entities/Scene/Scene';
import { Pipe } from './Entities/Pipe/Pipe';

export class Game extends Engine {
  constructor () {
    super({
      canvasId: 'gameCanvas',
      canvasWidth: 1200,
      canvasHeight: 800
    });

    this.gameOver = true;
    this.isPaused = false;
    this.currentScore = 0;
    this.scene = new Scene(this);
    this.player = new Player(this);

    this.eventListeners.push(() => {
      return this.canvas.addEventListener('keydown', (event) => {
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
    Pipe.updatePipes(this);
    this.player.update();
    this.updateScore();

    if (this.player.checkGroundCollision()) {
      this.gameOver = true;
    }
  }

  render () {
    super.render();
    this.scene.render();
    this.player.render();
    Pipe.renderPipes();
    this.renderCurrentScore();
  }

  resetGame () {
    this.player.reset();
    this.hoopQueue = [];
    this.gameOver = false;
  }

  updateScore () {
    for (let i = 0; i < Pipe.queue.length; i++) {
      if (Pipe.queue[i].x + Pipe.width === this.player.x) {
        this.currentScore++;

        return;
      }
    }
  }

  renderCurrentScore () {
    this.ctx.fillStyle = 'white';
    this.ctx.globalAlpha = 0.5;
    this.ctx.fillRect(this.canvas.width - 125, 0, 125, 50);
    this.ctx.globalAlpha = 1;
    this.ctx.font = '25px Arial';
    this.ctx.fillStyle = '#000';
    this.ctx.fillText(
      `Score: ${this.currentScore}`,
      this.canvas.width - 115,
      30
    );
  }
}
