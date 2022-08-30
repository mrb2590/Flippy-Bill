import { EntityAnimation } from '../../../Engine/EntityAnimation';
import { Player } from '../Player';

export class Backflip extends EntityAnimation {
  constructor ({ game, player }) {
    super({
      game,
      ticks: 20
    });

    this.player = player;
    this.angle = 0;
    this.chance = 0.2;
  }

  render () {
    super.render();

    this.game.ctx.save();
    this.game.ctx.translate(
      this.player.x + Player.width / 2,
      this.player.y + Player.height / 2
    );
    this.game.ctx.rotate(this.angle);
    this.game.ctx.translate(
      -(this.player.x + Player.width / 2),
      -(this.player.y + Player.height / 2)
    );

    this.player.sprite.render();

    this.player.game.ctx.resetTransform();
    this.player.game.ctx.restore();
  }

  update () {
    super.update();

    if (this.isRunning) {
      this.angle =
        -(((360 / this.totalTicks) * Math.PI) / 180) * (this.currentTick + 1);
    }
  }

  start () {
    super.start();
    this.angle = 0;
  }
}
