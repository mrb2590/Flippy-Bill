export class Background {
  constructor (game) {
    this.game = game;
  }

  render () {
    this.game.engine.renderer.ctx.fillStyle = '#000000';
    this.game.engine.renderer.ctx.fillRect(
      this.game.engine.scene.top,
      this.game.engine.scene.left,
      this.game.engine.scene.right,
      this.game.engine.scene.bottom
    );
  }

  update () {}
}
