import { Event } from '../../Event';
import wooshSound from './woosh.mp3';

export class Player {
  constructor (game) {
    this.game = game;
    this.dim = {
      body: {
        width: 100,
        height: 100,
        x: 200,
        y: 100
      }
    };
    this.physics = {
      velocity: 0,
      velocityDirection: 'down',
      jumpVelocity: 40
    };

    this.game.events.push(
      new Event({
        event: 'onkeydown',
        eventKey: 'Space',
        callback: function () {
          return this.jump();
        }.bind(this)
      })
    );
  }

  jump () {
    this.physics.velocity = this.physics.jumpVelocity;
    this.physics.velocityDirection = 'up';
    const sound = new Audio(wooshSound);
    sound.play();
  }

  render () {
    // Body
    this.game.engine.renderer.ctx.fillStyle = '#FFFFFF';
    this.game.engine.renderer.ctx.fillRect(this.dim.body.x, this.dim.body.y, this.dim.body.width, this.dim.body.height);
  }

  update () {
    if (this.physics.velocityDirection === 'up') {
      this.physics.velocity -= this.game.engine.physics.gravity;
      this.dim.body.y -= this.physics.velocity;

      // PLayer is at peak of jump
      if (this.physics.velocity <= 0) {
        this.physics.velocityDirection = 'down';
      }
    } else {
      this.physics.velocity += this.game.engine.physics.gravity;
      this.dim.body.y += this.physics.velocity;
    }

    // Player has hit the ceiling
    if (this.dim.body.y <= this.game.engine.scene.top) {
      this.dim.body.y = this.game.engine.scene.top;
      this.physics.velocity = 0;
      this.physics.velocityDirection = 'down';
    }

    // Player has hit the floor
    if (this.dim.body.y >= this.game.engine.scene.bottom - this.dim.body.height) {
      this.dim.body.y = this.game.engine.scene.bottom - this.dim.body.height;
      this.physics.velocity = 0;
    }
  }
}
