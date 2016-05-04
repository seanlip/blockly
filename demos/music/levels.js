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
 * @fileoverview Level sets for the Accessible Blockly music game.
 *
 * @author sll@google.com (Sean Lip)
 */

/**
 * This file is organized as follows:
 * - First, there are a few stock level sets that can be used as levels. You
 *     can create your own level packs, too!
 * - The LEVELS constant at the bottom collects all the sets that are actually
 *     used in index.html.
 */

 var LEVEL_SETS = {
  TUTORIAL: [{
    htmlInstructions: 'Play a single note, C3.',
    expectedLine: [
      [[36], 1]
    ],
    beatsPerMinute: 80,
    accompaniment: null
  }, {
    htmlInstructions: 'Modify the note to become E3 instead.',
    expectedLine: [
      [[40], 1]
    ],
    beatsPerMinute: 80,
    accompaniment: null
  }, {
    htmlInstructions: 'Play the sequence G3-A3-F3 in order.',
    expectedLine: [
      [[43], 1],
      [[45], 1],
      [[41], 1]
    ],
    beatsPerMinute: 80,
    accompaniment: null
  }, {
    htmlInstructions: 'Play the chord C3-E3-G3.',
    expectedLine: [
      [[36, 40, 43], 1]
    ],
    beatsPerMinute: 80,
    accompaniment: null
  }, {
    htmlInstructions: 'Play the chord C3-F3-A3, then the chord C3-E3-G3.',
    expectedLine: [
      [[36, 41, 45], 1],
      [[36, 40, 43], 1]
    ],
    beatsPerMinute: 80,
    accompaniment: null
  }],

  BEGINNER: [{
    htmlInstructions: 'Play Mary Had a Little Lamb: E4-D4-C4-D4-E4-E4-E4. Try to use only six blocks.',
    expectedLine: [
      [[52], 1],
      [[50], 1],
      [[48], 1],
      [[50], 1],
      [[52], 1],
      [[52], 1],
      [[52], 1]
    ],
    beatsPerMinute: 100,
    accompaniment: null
  }, {
    htmlInstructions: 'Play Can You Feel the Love Tonight: G4--E4D4-G4E4--C4A3----',
    expectedLine: [
      [[55], 3],
      [[52], 1],
      [[50], 2],
      [[55], 1],
      [[52], 3],
      [[48], 1],
      [[45], 4]
    ],
    beatsPerMinute: 120,
    accompaniment: null
  }, {
    htmlInstructions: 'Play The Entertainer: D4E4C4A3-B3G3',
    expectedLine: [
      [[50], 0.5],
      [[52], 0.5],
      [[48], 0.5],
      [[45], 1],
      [[47], 0.5],
      [[43], 0.5]
    ],
    beatsPerMinute: 80,
    accompaniment: null
  }, {
    htmlInstructions: 'Play Happy Birthday: G3..G3 A3 G3 C4 B3 - G3..G3 A3 G3 D4 C4 -',
    expectedLine: [
      [[43], 0.75],
      [[43], 0.25],
      [[45], 1],
      [[43], 1],
      [[48], 1],
      [[47], 2],
      [[43], 0.75],
      [[43], 0.25],
      [[45], 1],
      [[43], 1],
      [[50], 1],
      [[48], 2]
    ],
    beatsPerMinute: 100,
    accompaniment: null
  }, {
    htmlInstructions: 'Mary Had a Little Lamb: Play the chord C3-E3-G3 seven times. Use only two blocks!',
    expectedLine: [
      [[36, 41, 45], 1],
      [[36, 41, 45], 1],
      [[36, 41, 45], 1],
      [[36, 41, 45], 1],
      [[36, 41, 45], 1],
      [[36, 41, 45], 1],
      [[36, 41, 45], 1]
    ],
    beatsPerMinute: 100,
    accompaniment: [
      [[52], 1],
      [[50], 1],
      [[48], 1],
      [[50], 1],
      [[52], 1],
      [[52], 1],
      [[52], 1]
    ]
  }, {
    htmlInstructions: 'Lion King: Play C4 then G3 then A3 then F3. Make each note 4 beats long.',
    expectedLine: [
      [[48], 4],
      [[43], 4],
      [[45], 4],
      [[41], 4]
    ],
    beatsPerMinute: 120,
    accompaniment: [
      [[67], 3],
      [[64], 1],
      [[62], 2],
      [[67], 1],
      [[64], 3],
      [[60], 1],
      [[57], 4]
    ]
  }, {
    htmlInstructions: 'Lion King (reprise): Play C4 for 2 beats then G4 for 2 beats; repeat for the other three.',
    expectedLine: [
      [[48], 2],
      [[55], 2],
      [[43], 2],
      [[50], 2],
      [[45], 2],
      [[52], 2],
      [[41], 2],
      [[48], 2],
    ],
    beatsPerMinute: 120,
    accompaniment: [
      [[67], 3],
      [[64], 1],
      [[62], 2],
      [[67], 1],
      [[64], 3],
      [[60], 1],
      [[57], 4]
    ]
  }, {
    htmlInstructions: 'Edelweiss: Play C4 - E4/G4 - E4/G4 (1 beat each), ditto for the other three.',
    expectedLine: [
      [[48], 1],
      [[52, 55], 1],
      [[52, 55], 1],
      [[43], 1],
      [[47, 50], 1],
      [[47, 50], 1],
      [[45], 1],
      [[49, 52], 1],
      [[49, 52], 1],
      [[41], 1],
      [[45, 48], 1],
      [[45, 48], 1]
    ],
    beatsPerMinute: 120,
    accompaniment: [
      [[64], 2],
      [[67], 1],
      [[74], 3],
      [[72], 2],
      [[67], 1],
      [[65], 3]
    ]
  }, {
    htmlInstructions: 'Frozen: Play C4/E4-G4 four times quickly (half-beat each) then B3/D4-G4 then A3/C4-E4 then A3/C4-F4.',
    expectedLine: [
      [[60, 64], 0.5],
      [[55], 0.5],
      [[60, 64], 0.5],
      [[55], 0.5],
      [[60, 64], 0.5],
      [[55], 0.5],
      [[60, 64], 0.5],
      [[55], 0.5],

      [[59, 62], 0.5],
      [[55], 0.5],
      [[59, 62], 0.5],
      [[55], 0.5],
      [[59, 62], 0.5],
      [[55], 0.5],
      [[59, 62], 0.5],
      [[55], 0.5],

      [[57, 60], 0.5],
      [[52], 0.5],
      [[57, 60], 0.5],
      [[52], 0.5],
      [[57, 60], 0.5],
      [[52], 0.5],
      [[57, 60], 0.5],
      [[52], 0.5],

      [[57, 60], 0.5],
      [[53], 0.5],
      [[57, 60], 0.5],
      [[53], 0.5],
      [[57, 60], 0.5],
      [[53], 0.5],
      [[57, 60], 0.5],
      [[53], 0.5]
    ],
    beatsPerMinute: 140,
    accompaniment: [
      [[72], 2.5],
      [[67], 0.5],
      [[76], 0.5],
      [[74], 3.5],
      [[72], 1],
      [[69], 1],
      [[69], 0.5],
      [[69], 0.5],
      [[69], 0.5],
      [[71], 1],
      [[72], 1],
      [[74], 0.5],
      [[72], 3]
    ]
  }, {
    htmlInstructions: 'Play anything you like.',
    expectedLine: null,
    beatsPerMinute: 120,
    accompaniment: null
  }]
};

var LEVELS = [{
  name: 'tutorial',
  levelSet: LEVEL_SETS.TUTORIAL
}, {
  name: 'beginner',
  levelSet: LEVEL_SETS.BEGINNER
}];
