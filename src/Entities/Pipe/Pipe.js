import { Entity } from '../../Engine/Entity';

export class Pipe extends Entity {
  static queue = [];
  static height = 500;
  static width = 80;
  static gapBetweenPipes = 300;
  static gapHeight = 220;

  constructor (game) {
    super({
      game,
      x: game.scene.width,
      y: 0,
      velocityX: 5
    });

    this.topPipeY = Pipe.getRandomtopY(-350, -100);
    this.bottomPipeY = this.topPipeY + Pipe.height + Pipe.gapHeight;
  }

  static getRandomtopY (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static updatePipes (game) {
    if (game.gameOver || game.inMenu) {
      return;
    }

    let shift = false;

    if (
      Pipe.queue.length === 0 ||
      (Pipe.queue.length > 0 &&
        Pipe.queue[Pipe.queue.length - 1].x <
          game.scene.width - Pipe.width - Pipe.gapBetweenPipes)
    ) {
      Pipe.queue.push(new Pipe(game));
    }

    for (let i = 0; i < Pipe.queue.length; i++) {
      Pipe.queue[i].update();

      if (Pipe.queue[i].x + Pipe.width <= 0) {
        shift = true;
      }
    }

    if (shift) {
      Pipe.queue.shift();
    }
  }

  static renderPipes () {
    for (let i = 0; i < Pipe.queue.length; i++) {
      Pipe.queue[i].render();
    }
  }

  static resetQueue () {
    Pipe.queue = [];
  }

  update () {
    this.x += -this.velocityX;
  }

  render () {
    this.game.ctx.fillStyle = '#000000';
    this.game.ctx.fillRect(this.x, this.topPipeY, Pipe.width, Pipe.height);

    this.game.ctx.fillStyle = '#381f65';
    this.game.ctx.fillRect(
      this.x + 5,
      this.topPipeY + 5,
      Pipe.width - 10,
      Pipe.height - 10
    );

    this.game.ctx.fillStyle = '#000000';
    this.game.ctx.fillRect(
      this.x,
      this.bottomPipeY,
      Pipe.width,
      this.game.scene.floor - this.bottomPipeY
    );

    this.game.ctx.fillStyle = '#381f65';
    this.game.ctx.fillRect(
      this.x + 5,
      this.bottomPipeY + 5,
      Pipe.width - 10,
      this.game.scene.floor - this.bottomPipeY - 10
    );
  }
}
