export class AudioPlayer {
  constructor ({ audioFiles = {} }) {
    this.tracks = {};

    for (const track in audioFiles) {
      this.tracks[track] = new Audio(audioFiles[track]);
    }
  }

  play (track, volume = 1) {
    this.tracks[track].volume = volume;
    this.tracks[track].play();
  }

  playFromStart (track, volume = 1) {
    this.tracks[track].currentTime = 0;
    this.play(track, volume);
  }

  pause (track) {
    this.tracks[track].pause();
  }

  pauseAll () {
    for (const track in this.tracks) {
      this.pause(track);
    }
  }
}
