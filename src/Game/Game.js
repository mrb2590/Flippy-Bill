import { AudioPlayer } from '../Engine/AudioPlayer';
import { Engine } from '../Engine/Engine';
import { Player } from '../Entities/Player/Player';
import { Scene } from '../Entities/Scene/Scene';
import { Pipe } from '../Entities/Pipe/Pipe';
import dingSound from './ding.mp3';
import gameOverSound from './game-over.mp3';
import points10Sound from './10-points.mp3';
import points25Sound from './25-points.mp3';
import points50Sound from './50-points.mp3';

export class Game extends Engine {
  constructor () {
    super({
      canvasId: 'gameCanvas',
      canvasWidth: 1280,
      canvasHeight: 720
    });

    this.audioPlayer = new AudioPlayer({
      audioFiles: {
        gameOver: gameOverSound,
        ding: dingSound,
        points10: points10Sound,
        points25: points25Sound,
        points50: points50Sound
      }
    });
    this.gameOver = false;
    this.inMenu = true;
    this.isPaused = false;
    this.currentScore = 0;
    this.topScore = 0;
    this.scene = new Scene(this);
    this.player = new Player(this);
    this.eventListeners.push(() => {
      return document.body.addEventListener('dblclick', (event) => {
        if (this.gameOver) {
          this.startMenu();
        }
      });
    });
    this.eventListeners.push(() => {
      return document.body.addEventListener('mousedown', (event) => {
        if (this.inMenu) {
          this.startNewGame();
        }
      });
    });
    this.eventListeners.push(() => {
      return document.body.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
          if (this.inMenu) {
            this.startNewGame();
          }
        } else if (event.code === 'Escape') {
          if (!this.inMenu && !this.gameOver) {
            this.isPaused = !this.isPaused;
          }
        } else if (event.code === 'Enter') {
          if (this.gameOver) {
            this.startMenu();
          }
        }
      });
    });
  }

  update () {
    super.update();

    if (this.isPaused) {
      return;
    }

    this.scene.update();
    Pipe.updatePipes(this);
    this.player.update();
    this.updateScore();
    this.checkGameOver();
  }

  render () {
    super.render();
    this.scene.render();
    Pipe.renderPipes();
    this.player.render();
    this.renderCurrentScore();

    if (this.gameOver) {
      this.renderGameOver();
    } else if (this.isPaused) {
      this.renderPause();
    } else if (this.inMenu) {
      this.renderMenu();
    }
  }

  resetGame () {
    this.player.reset();
    Pipe.resetQueue();
    this.currentScore = 0;
    this.gameOver = false;
  }

  startNewGame () {
    this.inMenu = false;
    this.resetGame();
  }

  startMenu () {
    this.audioPlayer.pauseAll();
    this.gameOver = false;
    this.inMenu = true;
    this.resetGame();
  }

  startGameOver () {
    this.gameOver = true;
    this.audioPlayer.playFromStart('gameOver', 0.5);

    window.gtag('event', 'game_over', {
      score: this.currentScore,
      top_score: this.topScore
    });
  }

  renderGameOver () {
    // Background darken
    this.ctx.fillStyle = '#000';
    this.ctx.globalAlpha = 0.5;
    this.ctx.fillRect(
      this.scene.x,
      this.scene.y,
      this.scene.width,
      this.scene.height
    );
    this.ctx.globalAlpha = 1;

    // Game over text
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '150px Arial';
    this.ctx.fillText(
      'Game Over',
      this.scene.width / 2,
      this.scene.height / 2 - 50
    );

    // Current Score
    this.ctx.font = '60px Arial';
    this.ctx.fillText(
      `Score: ${this.currentScore}`,
      this.scene.width / 2,
      this.scene.height / 2 - 50 + 200
    );

    // Top Score
    this.ctx.fillText(
      `Best: ${this.topScore}`,
      this.scene.width / 2,
      this.scene.height / 2 - 50 + 300
    );

    // Start Instructions
    this.ctx.font = '30px Arial';
    this.ctx.fillText(
      'Double Click or Enter to Restart',
      this.scene.width / 2,
      this.scene.height / 2 - 50 + 100
    );
  }

  renderPause () {
    // Background darken
    this.ctx.fillStyle = '#000';
    this.ctx.globalAlpha = 0.5;
    this.ctx.fillRect(
      this.scene.x,
      this.scene.y,
      this.scene.width,
      this.scene.height
    );
    this.ctx.globalAlpha = 1;

    // Paused text
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '150px Arial';
    this.ctx.fillText(
      'Paused',
      this.scene.width / 2,
      this.scene.height / 2 + 75
    );
  }

  renderMenu () {
    // Background darken
    this.ctx.fillStyle = '#000';
    this.ctx.globalAlpha = 0.5;
    this.ctx.fillRect(
      this.scene.x,
      this.scene.y,
      this.scene.width,
      this.scene.height
    );
    this.ctx.globalAlpha = 1;

    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = '#fff';

    // Start Instructions
    this.ctx.font = '60px Arial';
    this.ctx.fillText(
      'Click or Space to Start',
      this.scene.width / 2,
      this.scene.height / 2 + 50
    );

    // Best score
    this.ctx.font = '60px Arial';
    this.ctx.fillText(
      `Best: ${this.topScore}`,
      this.scene.width / 2,
      this.scene.height / 2 - 50 + 200
    );
  }

  updateScore () {
    if (this.gameOver || this.inMenu) {
      return;
    }

    for (let i = 0; i < Pipe.queue.length; i++) {
      if (Pipe.queue[i].x + Math.floor(Pipe.width) / 2 === this.player.x) {
        this.audioPlayer.playFromStart('ding', 0.75);

        this.currentScore++;

        if (this.currentScore > this.topScore) {
          this.topScore = this.currentScore;
        }

        if (this.currentScore === 10) {
          this.audioPlayer.playFromStart('points10');
        } else if (this.currentScore === 25) {
          this.audioPlayer.playFromStart('points25');
        } else if (this.currentScore === 50) {
          this.audioPlayer.playFromStart('points50');
        }

        return;
      }
    }
  }

  renderCurrentScore () {
    this.ctx.fillStyle = '#000';
    this.ctx.globalAlpha = 0.5;
    this.ctx.fillRect(this.canvas.width - 160, 0, 160, 80);
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(this.canvas.width - 79, 0, 2, 80);
    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = '#fff';
    this.ctx.textAlign = 'center';

    this.ctx.font = '15px Arial';
    this.ctx.fillText('Score', this.canvas.width - 120, 20, 30);
    this.ctx.fillText('Best', this.canvas.width - 40, 20, 30);
    this.ctx.font = '50px Arial';
    this.ctx.fillText(this.currentScore, this.canvas.width - 120, 70, 30);
    this.ctx.fillText(this.topScore, this.canvas.width - 40, 70, 30);
  }

  checkGameOver () {
    if (this.gameOver || this.inMenu) {
      return;
    }

    if (this.player.checkGroundCollision()) {
      this.startGameOver();
      return;
    }

    if (this.player.checkPipeCollision()) {
      this.startGameOver();
    }
  }
}
