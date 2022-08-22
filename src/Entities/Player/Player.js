import { EventListener } from '../../Engine/EventListener';
import { Entity } from '../../Engine/Entity';
import { Sprite } from '../../Engine/Sprite';
import jumpSound from './jump.mp3';
import backflipSound from './backflip.mp3';
import spriteSrc from './player.png';

export class Player extends Entity {
  constructor (game) {
    super({
      game,
      x: 200,
      y: 100,
      velocityX: 0,
      velocityY: 0
    });

    this.width = 50;
    this.height = 100;
    this.jumpV = -40;
    this.sprite = new Sprite({
      src: spriteSrc,
      game: this.game,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      frames: 23,
      row: 0,
      ticksPerFrame: 1
    });
    this.backflipTick = 0;
    this.isBackFlipping = false;

    this.game.eventListeners.push(
      new EventListener({
        eventName: 'onkeydown',
        eventKey: 'Space',
        callback: function () {
          return this.jump();
        }.bind(this)
      })
    );
  }

  jump () {
    this.velocityY = this.jumpV;

    if (Math.random() > 0.8 && !this.isBackFlipping) {
      this.isBackFlipping = true;
      const sound = new Audio(backflipSound);
      sound.play();
    } else {
      const sound = new Audio(jumpSound);
      sound.play();
    }
  }

  render () {
    if (this.isBackFlipping) {
      if (this.backflipTick >= 30) {
        this.backflipTick = 0;
        this.isBackFlipping = false;
      }

      this.game.ctx.save();
      this.game.ctx.translate(
        this.x + this.width / 2,
        this.y + this.height / 2
      );
      this.game.ctx.rotate((20 * Math.PI) / 180 - this.backflipTick / 5);
      this.game.ctx.translate(
        -(this.x + this.width / 2),
        -(this.y + this.height / 2)
      );

      this.sprite.render();

      this.game.ctx.resetTransform();
      this.game.ctx.restore();

      this.backflipTick++;
    } else {
      this.sprite.render();
    }
  }

  update () {
    this.velocityY += this.game.physics.gravity;
    this.y += this.velocityY;

    // Player has hit the ceiling
    if (this.checkCeilingCollision()) {
      this.y = this.game.scene.top;
      this.velocityY = 0;
    }

    // Player has hit the floor
    if (this.checkGroundCollision()) {
      this.y = this.game.scene.bottom - this.height;
      this.velocityY = 0;
    }

    this.sprite.update({ x: this.x, y: this.y });
  }

  checkCeilingCollision () {
    return this.y <= this.game.scene.top;
  }

  checkGroundCollision () {
    return this.y >= this.game.scene.bottom - this.height;
  }
}
