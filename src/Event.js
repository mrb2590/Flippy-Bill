export class Event {
  constructor ({ event, callback, eventKey }) {
    this.event = event;
    this.callback = callback;
    this.eventKey = eventKey;
  }

  bind () {
    document.body[this.event] = function (event) {
      if (this.event === 'onkeydown') {
        const keyPressed = event.key || event.keyCode || event.code;

        switch (this.eventKey) {
          case 'Space':
            if (keyPressed === 32 || keyPressed === ' ' || keyPressed === 'Space') {
              this.callback();
            }
            break;
        }
      }
    }.bind(this);
  }
}
