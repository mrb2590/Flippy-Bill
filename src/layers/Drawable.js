export class Drawable {
  constructor (engine) {
    this.engine = engine;
  }

  draw () {}

  updated () { }

  getEvents () {
    return [];
  }
}
