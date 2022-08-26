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

    for (let i = 0; i < this.ground.width + 100; i += 20) {
      this.game.ctx.fillStyle = '#fff';
      this.game.ctx.fillRect(
        i - this.ground.currentTick * 2.5,
        this.ground.y,
        10,
        2
      );
      this.game.ctx.fillRect(
        i - this.ground.currentTick * 2.5 + 2,
        this.ground.y,
        10,
        2
      );
      this.game.ctx.fillRect(
        i - this.ground.currentTick * 2.5 + 4,
        this.ground.y,
        10,
        4
      );
      this.game.ctx.fillRect(
        i - this.ground.currentTick * 2.5 + 6,
        this.ground.y,
        10,
        6
      );
      this.game.ctx.fillRect(
        i - this.ground.currentTick * 2.5 + 8,
        this.ground.y,
        10,
        8
      );
    }
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
