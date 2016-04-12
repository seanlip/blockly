/**
 * Blockly Demos: Accessible Blockly
 *
 * Copyright 2016 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Utility functions for a music game for screen-reader users.
 * @author sll@google.com (Sean Lip)
 */

var CONSTANTS = {
  // Change this value to change the tempo.
  MILLISECS_PER_BEAT: 2000.0,
  LINE_BASS: 'bass',
  LINE_MELODY: 'melody'
};

var MusicPlayer = function() {
  // Initialize the MIDI player.
  MIDI.loadPlugin({
    soundfontUrl: '../../../MIDI.js/examples/soundfont/',
    instrument: 'acoustic_grand_piano',
    callback: function() {}
  });

  this.reset();
};

MusicPlayer.prototype.reset = function() {
  MIDI.Player.stop();
  if (this.activeTimeouts_ && this.activeTimeouts_.length > 0) {
    this.activeTimeouts_.forEach(function(timeout) {
      clearTimeout(timeout);
    });
  }

  this.activeTimeouts_ = [];

  this.lines_ = {};
  this.lines_[CONSTANTS.LINE_BASS] = {
    chords: [],
    currentBeat: 0.0
  };
  this.lines_[CONSTANTS.LINE_MELODY] = {
    chords: [],
    currentBeat: 0.0
  };
};

MusicPlayer.prototype.getBassLineDurationInMsecs = function() {
  return (
      this.lines_[CONSTANTS.LINE_BASS].currentBeat *
      CONSTANTS.MILLISECS_PER_BEAT);
};

MusicPlayer.prototype.getBassLine = function() {
  // Returns a deep clone.
  return JSON.parse(JSON.stringify(this.lines_[CONSTANTS.LINE_BASS].chords));
};

MusicPlayer.prototype.addChord_ = function(
    lineName, midiPitches, durationInBeats) {
  if (!this.lines_.hasOwnProperty(lineName)) {
    throw Error('Invalid line name: ' + lineName);
  }

  this.lines_[lineName].chords.push({
    midiPitches: midiPitches,
    durationInBeats: durationInBeats,
    delayInBeats: this.lines_[lineName].currentBeat
  });

  this.lines_[lineName].currentBeat += durationInBeats;
};

MusicPlayer.prototype.addRest_ = function(lineName, durationInBeats) {
  if (!this.lines_.hasOwnProperty(lineName)) {
    throw Error('Invalid line name: ' + lineName);
  }

  this.lines_[lineName].currentBeat += durationInBeats;
};

MusicPlayer.prototype.addBassChord = function(
    midiPitches, durationInBeats) {
  this.addChord_(CONSTANTS.LINE_BASS, midiPitches, durationInBeats);
};

MusicPlayer.prototype.playNote = function(midiPitches, durationInBeats) {
  var _MIDI_CHANNEL = 0;
  var _MIDI_VELOCITY = 127;

  MIDI.chordOn(_MIDI_CHANNEL, midiPitches, _MIDI_VELOCITY, 0);
  MIDI.chordOff(_MIDI_CHANNEL, midiPitches, durationInBeats);
};

MusicPlayer.prototype.playLines_ = function(linesToPlay) {
  var that = this;
  linesToPlay.forEach(function(lineName) {
    var line = that.lines_[lineName];
    line.chords.forEach(function(chord) {
      that.activeTimeouts_.push(setTimeout(function() {
        that.playNote(chord.midiPitches, chord.durationInBeats);
      }, chord.delayInBeats * CONSTANTS.MILLISECS_PER_BEAT));
    });
  });
};

MusicPlayer.prototype.playBassLine = function() {
  this.playLines_([CONSTANTS.LINE_BASS]);
};

MusicPlayer.prototype.playAllLines = function() {
  this.playLines_([CONSTANTS.LINE_BASS, CONSTANTS.LINE_MELODY]);
};

MusicPlayer.prototype.setMelody = function(melody) {
  var that = this;
  melody.forEach(function(pitchesAndDuration) {
    if (pitchesAndDuration[0] === null) {
      that.addRest_(
          CONSTANTS.LINE_MELODY, pitchesAndDuration[1]);
    } else {
      that.addChord_(
          CONSTANTS.LINE_MELODY, pitchesAndDuration[0], pitchesAndDuration[1]);
    }
  });
};
