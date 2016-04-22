/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
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
 * @fileoverview Music blocks for Blockly.
 * @author sll@google.com (Sean Lip)
 */
'use strict';

goog.provide('Blockly.Blocks.music');

goog.require('Blockly.Blocks');


var MUSIC_DUMMY_TOOLTIP = 'Dummy tooltip';
var MUSIC_DUMMY_HELPURL = 'Dummy help URL';
var MSG_CREATE_CHORD_WITH = 'create chord with';
var MSG_MUSIC_CHORD_TITLE = 'chord';
var MSG_MUSIC_NOTE = 'note';

/**
 * Common HSV hue for all blocks in this category.
 */
Blockly.Blocks.music.HUE = 20;

Blockly.Blocks.music.NOTE_OPTIONS = [
  ["C3", "36"],
  ["D3", "38"],
  ["E3", "40"],
  ["F3", "41"],
  ["G3", "43"],
  ["A3", "45"],
  ["B3", "47"],
  ["C4", "48"],
  ["D4", "50"],
  ["E4", "52"],
  ["F4", "53"],
  ["G4", "55"],
  ["A4", "57"],
  ["B4", "59"]
];

Blockly.Blocks['music_play_note'] = {
  /**
   * Block for playing a music note.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": "play note %1",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "PITCH",
          "options": Blockly.Blocks.music.NOTE_OPTIONS
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Blocks.music.HUE,
      "tooltip": MUSIC_DUMMY_TOOLTIP,
      "helpUrl": MUSIC_DUMMY_HELPURL
    });
  }
};

Blockly.Blocks['music_play_note_with_duration'] = {
  /**
   * Block for playing a note with a specified duration.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": "play note %1 for %2 beat(s)",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "PITCH",
          "options": Blockly.Blocks.music.NOTE_OPTIONS
        },
        {
          "type": "field_dropdown",
          "name": "DURATION",
          "options": [
            ["1", "1"],
            ["2", "2"],
            ["4", "4"],
            ["1/2", "0.5"],
            ["1/4", "0.25"]
          ]
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Blocks.music.HUE,
      "tooltip": MUSIC_DUMMY_TOOLTIP,
      "helpUrl": MUSIC_DUMMY_HELPURL
    });
  }
};

Blockly.Blocks['music_play_chord'] = {
  /**
   * Block for creating a chord made up of any number of notes.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(MUSIC_DUMMY_HELPURL);
    this.itemCount_ = 3;
    this.updateShape_();
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(Blockly.Blocks.music.HUE);
    this.setMutator(new Blockly.Mutator(['music_create_join_note']));
    this.setTooltip(MUSIC_DUMMY_TOOLTIP);
  },
  /**
   * Create XML to represent number of note inputs.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },
  /**
   * Parse XML to restore the text inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function(workspace) {
    var containerBlock = workspace.newBlock('music_create_join_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = workspace.newBlock('music_create_join_note');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    // Count number of inputs.
    var connections = [];
    while (itemBlock) {
      connections.push(itemBlock.valueConnection_);
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
    this.itemCount_ = connections.length;
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 0; i < this.itemCount_; i++) {
      if (connections[i]) {
        this.getInput('PITCH' + i).connection.connect(connections[i]);
      }
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @private
   * @this Blockly.Block
   */
  updateShape_: function() {
    // Delete everything.
    var i = 0;
    while (this.getInput('PITCH' + i)) {
      this.removeInput('PITCH' + i);
      i++;
    }

    // Rebuild block.
    for (var i = 0; i < this.itemCount_; i++) {
      var input = this.appendDummyInput('PITCH' + i).setAlign(
          Blockly.ALIGN_RIGHT);

      if (i == 0) {
        input.appendField(MSG_CREATE_CHORD_WITH);
      }

      input.appendField(
          new Blockly.FieldDropdown(Blockly.Blocks.music.NOTE_OPTIONS),
          'PITCH' + i);
    }
  }
};

Blockly.Blocks['music_create_join_container'] = {
  /**
   * Mutator block for container.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.texts.HUE);
    this.appendDummyInput()
        .appendField(MSG_MUSIC_CHORD_TITLE);
    this.appendStatementInput('STACK');
    this.setTooltip(MUSIC_DUMMY_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['music_create_join_note'] = {
  /**
   * Mutator block for adding notes to a chord.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.texts.HUE);
    this.appendDummyInput()
        .appendField(MSG_MUSIC_NOTE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(MUSIC_DUMMY_TOOLTIP);
    this.contextMenu = false;
  }
};
