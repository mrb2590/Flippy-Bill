export class Entity {
  constructor ({ game, x, y, velocityX, velocityY, sprite }) {
    this.game = game;
    this.events = [];
    this.x = x;
    this.y = y;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.sprite = sprite;
  }

  update () {}

  render () {}
}
