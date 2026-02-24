import { Audio, AVPlaybackStatus } from 'expo-av';

const LOCAL_TRACK = require('../../../assets/audio/sleep-track.mp3');

class LocalAudioPlayer {
  private sound: Audio.Sound | null = null;

  async play(onStatus?: (status: AVPlaybackStatus) => void): Promise<void> {
    if (!this.sound) {
      const { sound } = await Audio.Sound.createAsync(LOCAL_TRACK, { shouldPlay: true }, onStatus);
      this.sound = sound;
      return;
    }

    await this.sound.playAsync();
  }

  async stop(): Promise<void> {
    if (this.sound) {
      await this.sound.stopAsync();
    }
  }
}

export const localAudioPlayer = new LocalAudioPlayer();
