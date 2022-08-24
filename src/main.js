import './style.css';
import { Game } from './Game';

window.onload = () => {
  const game = new Game();
  game.start();
};
