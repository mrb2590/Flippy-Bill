import './style.css';
import { Engine } from './Engine.js';
import { Game } from './Game';

window.onload = function () {
  const engine = new Engine();
  const game = new Game(engine);

  game.start(game);
};
