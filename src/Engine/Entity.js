export class Entity {
  constructor ({ game, x, y, velocityX = 0, velocityY = 0, sprite = null }) {
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
