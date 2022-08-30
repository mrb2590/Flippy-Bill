export class EntityAnimation {
  constructor ({ game, seconds = null, ticks = null }) {
    this.game = game;
    this.isRunning = false;
    this.totalTicks = seconds ? Math.round(game.tickRate * seconds) : ticks;
    this.currentTick = 0;
  }

  render () {}

  update () {
    if (this.isRunning) {
      if (this.currentTick > this.totalTicks) {
        this.isRunning = false;
        this.currentTick = 0;
      } else {
        this.currentTick++;
      }
    }
  }

  start () {
    this.isRunning = true;
    this.currentTick = 0;
  }
}
