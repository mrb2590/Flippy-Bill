import { Entity } from '../../Engine/Entity';
import { Sprite } from '../../Engine/Sprite';
import jumpSound from './jump.mp3';
import splatSound from './splat.mp3';
import backflipSound from './backflip.mp3';
import crashSound from './crash.mp3';
import spriteSrc from './player.png';
import { Pipe } from '../Pipe/Pipe';

export class Player extends Entity {
  static resetVals = {
    x: 200,
    y: 300,
    velocityX: 0,
    velocityY: 0
  };

  constructor (game) {
    super({
      game,
      x: Player.resetVals.x,
      y: Player.resetVals.y
    });

    this.width = 64;
    this.height = 64;
    this.jumpV = -15;
    this.sprite = new Sprite({
      src: spriteSrc,
      game: this.game,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      frames: 3,
      frameIndex: 0,
      row: 0,
      ticksPerFrame: 10
    });
    this.jumpTick = 0;
    this.isJumping = false;
    this.totalJumpTicks = 12 * this.sprite.ticksPerFrame;
    this.backflipTick = 0;
    this.isSplatting = false;
    this.isBackFlipping = false;
    this.totalBackflipTicks = this.game.gravity * this.sprite.ticksPerFrame;
    this.backFlipAngle = 0;
    this.backFlipChance = 0.8;

    this.game.eventListeners.push(() => {
      return document.body.addEventListener('mousedown', (event) => {
        this.handleJumpEvent();
      });
    });
    this.game.eventListeners.push(() => {
      return document.body.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
          this.handleJumpEvent();
        }
      });
    });
  }

  reset () {
    this.isSplatting = false;
    this.spriteFlying();
    this.x = Player.resetVals.x;
    this.y = Player.resetVals.y;
    this.velocityX = Player.resetVals.velocityX;
  }

  spriteFlying () {
    this.sprite.frames = 3;
    this.sprite.frameIndex = 0;
    this.sprite.row = 0;
  }

  spriteSplat () {
    this.sprite.frames = 1;
    this.sprite.frameIndex = 0;
    this.sprite.row = 1;
  }

  jump () {
    if (this.game.gameOver || this.game.inMenu) {
      return;
    }

    this.isJumping = true;
    this.jumpTick = 0;
    this.velocityY = this.jumpV;

    if (Math.random() > this.backFlipChance && !this.isBackFlipping) {
      this.isBackFlipping = true;
      const sound = new Audio(backflipSound);
      sound.play();
    } else {
      const sound = new Audio(jumpSound);
      sound.play();
    }
  }

  handleJumpEvent () {
    if (this.game.isPaused) {
      return;
    }

    this.jump();
  }

  splat () {
    this.spriteSplat();
    this.isSplatting = true;
    const sound = new Audio(splatSound);
    sound.play();
  }

  crash () {
    const sound = new Audio(crashSound);
    sound.play();
  }

  render () {
    if (this.isBackFlipping) {
      this.game.ctx.save();
      this.game.ctx.translate(
        this.x + this.width / 2,
        this.y + this.height / 2
      );
      this.game.ctx.rotate(this.backFlipAngle);
      this.game.ctx.translate(
        -(this.x + this.width / 2),
        -(this.y + this.height / 2)
      );

      this.sprite.render();

      this.game.ctx.resetTransform();
      this.game.ctx.restore();
    } else {
      this.sprite.render();
    }
  }

  update () {
    if (this.game.inMenu) {
      this.sprite.update({ x: this.x, y: this.y });
      return;
    }

    this.velocityY += this.game.gravity;
    this.y += this.velocityY;

    // Player has hit the ceiling
    if (this.checkCeilingCollision()) {
      this.y = this.game.scene.y;
      this.velocityY = 0;
    }

    // Player has hit the floor
    if (this.checkGroundCollision()) {
      this.y = this.game.scene.floor - this.height;
      this.velocityY = 0;

      if (!this.isSplatting) {
        this.splat();
      }
    }

    if (this.isJumping) {
      if (this.jumpTick >= this.totalJumpTicks) {
        this.isJumping = false;
        this.jumpTick = 0;
      }

      this.jumpTick++;
    }

    if (this.isBackFlipping) {
      if (this.backflipTick >= this.totalBackflipTicks) {
        this.backflipTick = 0;
        this.isBackFlipping = false;
      }

      this.backFlipAngle =
        -(((360 / this.totalBackflipTicks) * Math.PI) / 180) *
        (this.backflipTick + 1);

      this.backflipTick++;
    }

    this.sprite.update({ x: this.x, y: this.y });
  }

  checkCeilingCollision () {
    return this.y <= this.game.scene.y;
  }

  checkGroundCollision () {
    return this.y >= this.game.scene.floor - this.height;
  }

  checkPipeCollision () {
    for (let i = 0; i < Pipe.queue.length; i++) {
      if (
        this.x + this.width > Pipe.queue[i].x &&
        this.x < Pipe.queue[i].x + Pipe.width &&
        (this.y < Pipe.queue[i].topPipeY + Pipe.height ||
          this.y + this.height > Pipe.queue[i].bottomPipeY)
      ) {
        this.crash();

        return true;
      }
    }

    return false;
  }
}
