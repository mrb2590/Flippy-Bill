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
      color: '#58d826'
    };

    this.floor = this.height - this.ground.height / 2;
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
  }

  render () {
    this.renderBackground();
    this.renderGround();
  }
}
