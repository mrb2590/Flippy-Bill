export class Physics {
  static gravity = 1;

  applyGravity (entity) {
    entity.velocityY += Physics.gravity;
    entity.y += entity.velocityY;
  }
}
