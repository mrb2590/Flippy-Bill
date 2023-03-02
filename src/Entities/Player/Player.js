import { AudioPlayer } from '../../Engine/AudioPlayer';
import { Backflip } from './Animations/Backflip';
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
      game,
      x: this.x,
      y: this.y,
      width: Player.width,
      height: Player.height,
      frames: 3,
      frameIndex: 0,
      row: 0,
      ticksPerFrame: 10
    });
    this.backflipAnimation = new Backflip({ game, player: this });
    this.isSplatting = false;

    this.game.eventListeners.push(() => {
      return document.body.addEventListener('mousedown', (event) => {
        this.jump();
      });
    });
    this.game.eventListeners.push(() => {
      return document.body.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
          this.jump();
        }
      });
    });
  }

  render () {
    if (this.backflipAnimation.isRunning) {
      this.backflipAnimation.render();
    } else {
      this.sprite.render();
    }
  }

  update () {
    if (this.game.inMenu) {
      this.sprite.update({ x: this.x, y: this.y });
      return;
    }

    this.game.physics.applyGravity(this);

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

    this.backflipAnimation.update();

    this.sprite.update({ x: this.x, y: this.y });
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
    if (this.game.gameOver || this.game.inMenu || this.game.isPaused) {
      return;
    }

    this.velocityY = Player.jumpVelocity;
    this.audioPlayer.playFromStart('wingFlap', 0.3);

    if (this.backflipAnimation.shouldBackflip()) {
      this.backflipAnimation.start();
      this.audioPlayer.playFromStart('backflip');
    }
  }

  splat () {
    this.spriteSplat();
    this.isSplatting = true;
    this.audioPlayer.playFromStart('splat', 0.5);
  }

  crash () {
    this.audioPlayer.playFromStart('crash');
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
