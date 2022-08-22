import { Entity } from '../../Engine/Entity';
import { Sprite } from '../../Engine/Sprite';
import spriteLeftSrc from './hoop-left.png';
import spriteRightSrc from './hoop-right.png';

export class Hoop extends Entity {
  static width = 100;

  constructor (game) {
    super({
      game,
      x: game.scene.right,
      y: Math.floor(
        Math.random() * (game.scene.top - (game.scene.bottom - 300) + 1) +
          game.scene.bottom -
          300
      ),
      velocityX: -5,
      velocityY: 0
    });

    this.height = 300;
    this.spriteLeft = new Sprite({
      src: spriteLeftSrc,
      game: this.game,
      x: this.x,
      y: this.y,
      width: Hoop.width,
      height: 300,
      frames: 1,
      row: 0,
      ticksPerFrame: 1
    });
    this.spriteRight = new Sprite({
      src: spriteRightSrc,
      game: this.game,
      x: this.x,
      y: this.y,
      width: Hoop.width,
      height: 300,
      frames: 1,
      row: 0,
      ticksPerFrame: 1
    });
  }

  renderLeft () {
    this.spriteLeft.render();
  }

  renderRight () {
    this.spriteRight.render();
  }

  update () {
    this.x += this.velocityX;

    this.spriteLeft.update({ x: this.x, y: this.y });
    this.spriteRight.update({ x: this.x, y: this.y });
  }
}
