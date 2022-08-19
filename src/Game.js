import { Background } from './layers/Background';
import { Player } from './layers/player/Player';

export class Game {
  constructor (engine) {
    this.engine = engine;
    this.events = [];

    this.player = new Player(this);
    this.background = new Background(this);
  }

  update () {
    this.player.update();
  }

  renderFrame () {
    this.background.render();
    this.player.render();
  }

  start () {
    this.engine.start(this);
  }
}
