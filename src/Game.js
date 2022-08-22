import { Engine } from './Engine/Engine';
import { Player } from './Entities/Player/Player';
import { Hoop } from './Entities/Hoop/Hoop';

export class Game extends Engine {
  constructor () {
    super({
      canvasId: 'gameCanvas',
      canvasWidth: 1920,
      canvasHeight: 1080
    });

    this.player = new Player(this);
    this.hoopQueue = [];
  }

  update () {
    super.update();
    this.player.update();
    let shift = false;

    if (
      this.hoopQueue.length === 0 ||
      (this.hoopQueue.length > 0 &&
        this.hoopQueue[this.hoopQueue.length - 1].x <
          this.scene.right - Hoop.width - 300)
    ) {
      this.hoopQueue.push(new Hoop(this));
    }

    for (let i = 0; i < this.hoopQueue.length; i++) {
      this.hoopQueue[i].update();

      if (this.hoopQueue[i].x + Hoop.width <= 0) {
        shift = true;
      }
    }

    if (shift) {
      this.hoopQueue.shift();
    }
  }

  render () {
    super.render();

    for (let i = 0; i < this.hoopQueue.length; i++) {
      this.hoopQueue[i].renderLeft();
    }

    this.player.render();

    for (let i = 0; i < this.hoopQueue.length; i++) {
      this.hoopQueue[i].renderRight();
    }
  }
}
