import { Entity } from '../../Engine/Entity';

export class Scene extends Entity {
  constructor (game) {
    super({
      game,
      x: 0,
      y: 0
    });

    this.width = this.game.canvas.width;
    this.height = this.game.canvas.height;
    this.color = '#89d1f2';

    this.ground = {
      x: 0,
      y: this.height - 50,
      width: this.width,
      height: 50,
      color: '#58d826',
      currentTick: 0,
      maxTicks: 30
    };

    this.floor = this.height - this.ground.height;
  }

  renderBackground () {
    this.game.ctx.fillStyle = this.color;
    this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  renderGround () {
    this.game.ctx.fillStyle = this.ground.color;
    this.game.ctx.fillRect(
      this.ground.x,
      this.ground.y,
      this.ground.width,
      this.ground.height
    );

    this.game.ctx.fillStyle = '#000';
    this.game.ctx.fillRect(this.ground.x, this.ground.y, this.ground.width, 2);

    this.game.ctx.fillStyle = '#fff';

    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < this.ground.width / 20; i++) {
        this.game.ctx.fillRect(
          i * (this.ground.width / 20) + j * 20,
          this.ground.y + j * 5 + 2,
          20,
          5
        );
      }
    }

    this.game.ctx.fillStyle = '#000';
    this.game.ctx.fillRect(
      this.ground.x,
      this.ground.y + 17,
      this.ground.width,
      2
    );
  }

  render () {
    this.renderBackground();
    this.renderGround();
  }

  update () {
    if (this.game.gameOver || this.game.inMenu) {
      return;
    }

    if (this.ground.currentTick > this.ground.maxTicks) {
      this.ground.currentTick = 0;
    }

    this.ground.currentTick++;
  }
}
