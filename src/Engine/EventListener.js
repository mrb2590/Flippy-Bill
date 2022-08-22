export class EventListener {
  constructor ({ eventName, callback, eventKey }) {
    this.eventName = eventName;
    this.callback = callback;
    this.eventKey = eventKey;
  }

  bind () {
    document.body[this.eventName] = function (event) {
      if (this.eventName === 'onkeydown') {
        const keyPressed = event.key || event.keyCode;

        switch (this.eventKey) {
          case 'Space':
            if (keyPressed === 32 || keyPressed === ' ') {
              this.callback();
            }
            break;
        }
      }
    }.bind(this);
  }
}
