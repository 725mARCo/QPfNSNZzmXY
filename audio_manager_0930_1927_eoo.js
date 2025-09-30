// 代码生成时间: 2025-09-30 19:27:35
import { Meteor } from 'meteor/meteor';
import { EJSON } from 'meteor/ejson';

// AudioManager is a class responsible for managing audio files in a Meteor application.
class AudioManager {
  // Initializes the AudioManager with a list of audio files.
  constructor(audioFiles) {
    this.audioFiles = audioFiles;
    this.sounds = {};
  }

  // Loads an audio file and returns a promise that resolves when the audio is ready to play.
  loadAudio(filename) {
    try {
      if (!filename || typeof filename !== 'string') {
        throw new Error('Filename must be a valid string.');
      }

      if (!this.audioFiles.includes(filename)) {
        throw new Error(`File ${filename} not found in audio files list.`);
      }

      const sound = new Audio(`/audio/${filename}`);
      this.sounds[filename] = sound;
      return new Promise((resolve, reject) => {
        sound.addEventListener('canplaythrough', () => resolve(sound), { once: true });
        sound.addEventListener('error', () => reject(new Error(`Failed to load audio file ${filename}`)), { once: true });
        sound.load();
      });
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  // Plays a loaded audio file.
  playAudio(filename) {
    try {
      if (!this.sounds[filename]) {
        throw new Error(`Audio file ${filename} is not loaded.`);
      }

      this.sounds[filename].play();
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  // Stops a playing audio file.
  stopAudio(filename) {
    try {
      if (!this.sounds[filename]) {
        throw new Error(`Audio file ${filename} is not loaded.`);
      }

      this.sounds[filename].pause();
      this.sounds[filename].currentTime = 0;
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }
}

// Example usage:
// const audioManager = new AudioManager(['sound1.mp3', 'sound2.mp3']);
// audioManager.loadAudio('sound1.mp3').then(sound => {
//   console.log('Sound is ready to play.');
//   sound.play();
// }).catch(error => {
//   console.error(error.message);
// });
