import { AudioPlayer } from '../../Engine/AudioPlayer';
import { Entity } from '../../Engine/Entity';
import { Sprite } from '../../Engine/Sprite';
import { Pipe } from '../Pipe/Pipe';
import wingFlapSound from './wing-flap.mp3';
import splatSound from './splat.mp3';
import backflipSound from './backflip.mp3';
import crashSound from './crash.mp3';
import spriteSrc from './player.png';

export class Player extends Entity {
  static width = 64;
  static height = 64;
  static jumpVelocity = -12;

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

    this.audioPlayer = new AudioPlayer({
      audioFiles: {
        wingFlap: wingFlapSound,
        splat: splatSound,
        backflip: backflipSound,
        crash: crashSound
      }
    });
    this.sprite = new Sprite({
      src: spriteSrc,
      game: this.game,
      x: this.x,
      y: this.y,
      width: Player.width,
      height: Player.height,
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
    this.isBackflipping = false;
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
    this.velocityY = Player.jumpVelocity;

    if (Math.random() > this.backFlipChance && !this.isBackflipping) {
      this.isBackflipping = true;
      this.audioPlayer.playFromStart('backflip');
    }

    this.audioPlayer.playFromStart('wingFlap', 0.3);
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
    this.audioPlayer.playFromStart('splat', 0.5);
  }

  crash () {
    this.audioPlayer.playFromStart('crash');
  }

  render () {
    if (this.isBackflipping) {
      this.game.ctx.save();
      this.game.ctx.translate(
        this.x + Player.width / 2,
        this.y + Player.height / 2
      );
      this.game.ctx.rotate(this.backFlipAngle);
      this.game.ctx.translate(
        -(this.x + Player.width / 2),
        -(this.y + Player.height / 2)
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
      this.y = this.game.scene.floor - Player.height;
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

    if (this.isBackflipping) {
      if (this.backflipTick >= this.totalBackflipTicks) {
        this.backflipTick = 0;
        this.isBackflipping = false;
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
    return this.y >= this.game.scene.floor - Player.height;
  }

  checkPipeCollision () {
    for (let i = 0; i < Pipe.queue.length; i++) {
      if (
        this.x + Player.width > Pipe.queue[i].x &&
        this.x < Pipe.queue[i].x + Pipe.width &&
        (this.y < Pipe.queue[i].topPipeY + Pipe.height ||
          this.y + Player.height > Pipe.queue[i].bottomPipeY)
      ) {
        this.crash();

        return true;
      }
    }

    return false;
  }
}
