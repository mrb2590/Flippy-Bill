export class Sprite {
  constructor ({
    game,
    src,
    x,
    y,
    width,
    height,
    row,
    frames,
    frameIndex = 0,
    ticksPerFrame = 1,
    tickCount = 0
  }) {
    this.game = game;
    this.image = new Image();
    this.image.src = src;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.row = row;
    this.frames = frames;
    this.frameIndex = frameIndex;
    this.ticksPerFrame = ticksPerFrame;
    this.tickCount = tickCount;
  }

  update ({ x, y }) {
    this.tickCount += 1;

    if (this.tickCount > this.ticksPerFrame) {
      this.tickCount = 0;

      if (this.frameIndex < this.frames - 1) {
        this.frameIndex += 1;
      } else {
        this.frameIndex = 0;
      }
    }

    this.x = x;
    this.y = y;
  }

  render () {
    this.game.ctx.drawImage(
      this.image,
      this.frameIndex * this.width,
      this.row * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}
