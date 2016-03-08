/**
 * @license
 * Visual Blocks Editor
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
 * @fileoverview Apps blocks for Blockly.
 * @author sll@google.com (Sean Lip)
 */
'use strict';

goog.provide('Blockly.Blocks.apps');

goog.require('Blockly.Blocks');


/**
 * Common HSV hue for all blocks in this category.
 */
Blockly.Blocks.apps.HUE = 20;
Blockly.Blocks.apps.EMAIL_HUE = 55;

// DRAFT MESSAGES
Blockly.Msg.APPS_DUMMY_TOOLTIP = 'Dummy Tooltip';
Blockly.Msg.APPS_DUMMY_HELPURL = '';

var MSG_APPS_CELL_BY_COORDS_TOOLTIP =
  'Coordinates of a cell in the active sheet, set by entering the column ' +
  'letter and the row number separately. Variables can be used.';
var MSG_APPS_CELL_BY_COORDS_AND_SHEET_NAME_TOOLTIP =
  'Coordinates of a cell, set by entering the column letter and the row ' +
  'number separately. Variables can be used.';
var MSG_APPS_CELL_BY_HEADER_AND_ROW_NUMBER_TOOLTIP =
  'Coordinates of a cell in the active sheet, set by entering the column ' +
  'header and the row number separately.';
var MSG_APPS_CELL_COLUMN_HEADER_DROPDOWN = 'Choose Column...';
var MSG_APPS_CELL_TOOLTIP =
  'Coordinates of a cell in the active sheet.';
var MSG_APPS_CREATE_SHEET_TOOLTIP = 'Create a new sheet.';
var MSG_APPS_GET_CELL_VALUE_TOOLTIP =
  'Get the value contained in a spreadsheet cell.';
var MSG_APPS_GET_ENTIRE_RANGE_TOOLTIP =
  'Get the range of non-empty cells in the spreadsheet.';
var MSG_APPS_GET_RANGE_TOOLTIP =
  'Get a range of cells in the spreadsheet.';
var MSG_APPS_ON_CLICK_TOOLTIP =
  'Perform an action when the  ▶  button is clicked.';
var MSG_APPS_SEND_EMAIL_TOOLTIP =
  'Send an email to the given email address with the given subject and ' +
  'message.';
var MSG_APPS_SET_CELL_BACKGROUND_COLOUR_TOOLTIP =
  'Sets the background colour of a cell in a spreadsheet.';
var MSG_APPS_SET_CELL_VALUE_TOOLTIP =
  'Sets the value of a cell in a spreadsheet.';
var MSG_INVALID_COLUMN_HEADER_WARNING =
  'Please select a valid column header from the dropdown menu.';

var EMPTY_COLUMN_HEADER = '';

var APPS_FOR_EACH_RANGE_ROW_NUMBER = 'row number';
var APPS_FOR_EACH_RANGE_COLUMN_LETTER = 'column letter';
var MSG_APPS_ON_CLICK_DO = ': when  ▶  button is clicked, do:';

Blockly.Blocks['apps_on_click'] = {
  /**
   * Block for executing a procedure when the 'Run' button is clicked.
   * @this Blockly.Block
   */
  init: function() {
    var nameField = new Blockly.FieldTextInput(
        'run',
        Blockly.Procedures.rename);
    nameField.setSpellcheck(false);

    this.setHelpUrl(Blockly.Msg.APPS_DUMMY_HELPURL);
    this.setTooltip(MSG_APPS_ON_CLICK_TOOLTIP);
    this.setColour(Blockly.Blocks.procedures.HUE);
    this.appendDummyInput()
        .appendField(nameField, 'FUNCNAME')
        .appendField(MSG_APPS_ON_CLICK_DO);
    this.appendStatementInput('DO')
        .appendField(Blockly.Msg.PROCEDURES_DEFNORETURN_DO);
  },
  /**
   * Initialization of the block has completed, clean up anything that may be
   * inconsistent as a result of the XML loading.
   * @this Blockly.Block
   */
  validate: function () {
    var name = Blockly.Procedures.findLegalName(
        this.getFieldValue('FUNCNAME'), this);
    this.setFieldValue(name, 'FUNCNAME');
  }
};

Blockly.Blocks['apps_cell'] = {
  /**
   * Block representing a cell in the active sheet.
   * @this Blockly.Block
   */
  init: function() {
    // TODO: update cellValidator to allow references to sheet names.
    this.setHelpUrl(Blockly.Msg.APPS_DUMMY_HELPURL);
    this.setColour(Blockly.Blocks.apps.HUE);
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput(
          '', Blockly.FieldTextInput.cellValidator), 'TEXT');
    // The real output is Cell, but we set this to null here and handle the
    // check manually in onchange().
    this.setOutput(true, null);
    this.setTooltip(MSG_APPS_CELL_TOOLTIP);
  },
  /**
   * Called whenever anything on the workspace changes.
   * Adds a "get value of" adapter if the output is connected to something
   * which doesn't expect a Cell.
   * @this Blockly.Block
   */
  onchange: function() {
    var parentConnection = this.outputConnection.targetConnection;
    // We are looking for an explicit connection from the parent to a Cell
    // object. If this does not exist, and String is a valid connection, we
    // insert a "get value of cell" block in the middle.
    if (parentConnection && parentConnection != this.prevParentConnection_) {
      if (parentConnection.check_ &&
          parentConnection.check_.indexOf('Cell') != -1) {
        this.prevParentConnection_ = parentConnection;
        return;
      }

      // If the parent block does not accept String input, bump the block.
      if (parentConnection.check_ &&
          parentConnection.check_.indexOf('String') == -1) {
        this.setParent(null);
        parentConnection.sourceBlock_.bumpNeighbours_();
        this.prevParentConnection_ = null;
        return;
      }

      // The parent block accepts String and not Cell input, so insert a
      // "get value of cell" block in the middle.
      var workspace = this.workspace;
      this.setParent(null);

      var adapterBlock = workspace.newBlock('apps_get_cell_value');
      adapterBlock.outputConnection.connect(parentConnection);
      this.outputConnection.connect(adapterBlock.inputList[0].connection);

      adapterBlock.initSvg();
      adapterBlock.render(true);

      this.prevParentConnection_ = this.outputConnection.targetConnection;
    }
  }
};

Blockly.Blocks['apps_cell_by_header_and_row_number'] = {
  /**
   * Block representing a cell in the active sheet, specified by providing the
   * column header and the row number.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": "%1 %2",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "COLUMNHEADER",
          "options": function() {
            var optionsArray = GLOBALS.COLUMN_HEADERS.map(function(header) {
              return [header, header];
            });

            /*
              Add a dummy column header at the top, if no choice has been
              selected yet.
            */
            if (!this.value_) {
              optionsArray.unshift([
                MSG_APPS_CELL_COLUMN_HEADER_DROPDOWN, EMPTY_COLUMN_HEADER
              ]);
            }

            return optionsArray;
          }
        },
        {
          "type": "input_value",
          "name": "ROWNUMBER",
          "check": "Number"
        }
      ],
      "inputsInline": true,
      // The real output is Cell, but we set this to null here and handle the
      // check manually in onchange().
      "output": null,
      "colour": Blockly.Blocks.apps.HUE,
      "tooltip": MSG_APPS_CELL_BY_HEADER_AND_ROW_NUMBER_TOOLTIP,
      "helpUrl": Blockly.Msg.APPS_DUMMY_HELPURL
    });
  },
  /**
   * Called whenever anything on the workspace changes. Just like apps_cell,
   * this adds a "get value of" adapter if the output is connected to something
   * which doesn't expect a Cell. Also adds a warning if the column header used
   * is invalid.
   * @this Blockly.Block
   */
  onchange: function() {
    Blockly.Blocks['apps_cell'].onchange.apply(this);

    var fieldOptions = this.getField('COLUMNHEADER').getOptions_().map(
      function(optionPair) {
        return optionPair[1];
      }
    );

    var fieldValueIsInvalid = (
        this.getFieldValue('COLUMNHEADER') == EMPTY_COLUMN_HEADER ||
        fieldOptions.indexOf(this.getFieldValue('COLUMNHEADER')) == -1);

    var warningMessage = (
        fieldValueIsInvalid ?
        MSG_INVALID_COLUMN_HEADER_WARNING : null);
    this.setWarningText(warningMessage);
  }
};

Blockly.Blocks['apps_cell_by_coords'] = {
  /**
   * Block representing a cell in the active sheet, specified by providing the
   * row and column separately.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": "%1 %2",
      "args0": [
        {
          "type": "input_value",
          "name": "COLUMNLETTER",
          "check": "String"
        },
        {
          "type": "input_value",
          "name": "ROWNUMBER",
          "check": "Number"
        }
      ],
      "inputsInline": true,
      // The real output is Cell, but we set this to null here and handle the
      // check manually in onchange().
      "output": null,
      "colour": Blockly.Blocks.apps.HUE,
      "tooltip": MSG_APPS_CELL_BY_COORDS_TOOLTIP,
      "helpUrl": Blockly.Msg.APPS_DUMMY_HELPURL
    });
  },
  /**
   * Called whenever anything on the workspace changes. Just like apps_cell,
   * this adds a "get value of" adapter if the output is connected to something
   * which doesn't expect a Cell.
   * @this Blockly.Block
   */
  onchange: Blockly.Blocks['apps_cell'].onchange
};

Blockly.Blocks['apps_cell_by_coords_and_sheet_name'] = {
  /**
   * Block representing a cell in a spreadsheet, specified by providing the
   * sheet name, row and column separately.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": "%1 %2 in sheet %3",
      "args0": [
        {
          "type": "input_value",
          "name": "COLUMNLETTER",
          "check": "String"
        },
        {
          "type": "input_value",
          "name": "ROWNUMBER",
          "check": "Number"
        },
        {
          "type": "field_input",
          "name": "SHEETNAME",
          "text": "Sheet1",
          "check": "String"
        }
      ],
      "inputsInline": true,
      // The real output is Cell, but we set this to null here and handle the
      // check manually in onchange().
      "output": null,
      "colour": Blockly.Blocks.apps.HUE,
      "tooltip": Blockly.Msg.APPS_CELL_BY_COORDS_AND_SHEET_NAME_TOOLTIP,
      "helpUrl": Blockly.Msg.APPS_DUMMY_HELPURL
    });
  },
  onchange: Blockly.Blocks['apps_cell'].onchange
};

Blockly.Blocks['apps_get_cell_value'] = {
  /**
   * Block for getting element at index.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": "value of cell %1",
      "args0": [
        {
          "type": "input_value",
          "name": "CELL",
          "check": "Cell"
        }
      ],
      "colour": Blockly.Blocks.apps.HUE,
      "helpUrl": Blockly.Msg.APPS_DUMMY_HELPURL,
      "output": "String",
    });
    this.setTooltip(MSG_APPS_GET_CELL_VALUE_TOOLTIP);
  }
};

Blockly.Blocks['apps_set_cell_value'] = {
  /**
   * Block for setting the value of a cell.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": "set cell %1 to %2",
      "args0": [
        {
          "type": "input_value",
          "name": "CELL",
          "check": "Cell"
        },
        {
          "type": "input_value",
          "name": "CELLVALUE",
          "check": ["Boolean", "Number", "String"]
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Blocks.apps.HUE,
      "helpUrl": Blockly.Msg.APPS_DUMMY_HELPURL
    });
    this.setTooltip(MSG_APPS_SET_CELL_VALUE_TOOLTIP);
  }
};

Blockly.Blocks['apps_set_cell_background_colour'] = {
  /**
   * Block for setting the background colour of a cell.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": "set background of cell %1 to %2",
      "args0": [
        {
          "type": "input_value",
          "name": "CELL",
          "check": "Cell"
        },
        {
          "type": "input_value",
          "name": "COLOUR",
          "check": ["Colour"]
        }
      ],
      "inputsInline": true,
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Blocks.apps.HUE,
      "helpUrl": Blockly.Msg.APPS_DUMMY_HELPURL
    });
    this.setTooltip(MSG_APPS_SET_CELL_BACKGROUND_COLOUR_TOOLTIP);
  }
};

Blockly.Blocks['apps_entire_range'] = {
  /**
   * Block representing the range of all cells in a spreadsheet that have
   * content.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": "range of all cells with content",
      "args0": [],
      "output": "Range",
      "colour": Blockly.Blocks.apps.HUE,
      "tooltip": MSG_APPS_GET_ENTIRE_RANGE_TOOLTIP,
      "helpUrl": Blockly.Msg.APPS_DUMMY_HELPURL
    });
  }
};

Blockly.Blocks['apps_range'] = {
  /**
   * Block representing a range of cells in a spreadsheet.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": "range from cell %1 to cell %2",
      "args0": [
        {
          "type": "input_value",
          "name": "FROM",
          "check": "Cell"
        },
        {
          "type": "input_value",
          "name": "TO",
          "check": "Cell"
        }
      ],
      "inputsInline": true,
      "output": "Range",
      "colour": Blockly.Blocks.apps.HUE,
      "tooltip": MSG_APPS_GET_RANGE_TOOLTIP,
      "helpUrl": Blockly.Msg.APPS_DUMMY_HELPURL
    });
  }
};

Blockly.Blocks['apps_create_sheet'] = {
  /**
   * Block for creating a new sheet.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": "create new sheet called %1",
      "args0": [
        {
          "type": "input_value",
          "name": "NAME",
          "check": "String"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Blocks.apps.HUE,
      "helpUrl": Blockly.Msg.APPS_DUMMY_HELPURL
    });
    this.setTooltip(MSG_APPS_CREATE_SHEET_TOOLTIP);
  }
};

Blockly.Blocks['apps_for_each_range'] = {
  /**
   * Block for "for each" loop over the rows/columns of a spreadsheet range.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": "for each %1 %2 in range %3",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "AXIS",
          "options": [
            [
              APPS_FOR_EACH_RANGE_ROW_NUMBER,
              APPS_FOR_EACH_RANGE_ROW_NUMBER
            ],
            [
              APPS_FOR_EACH_RANGE_COLUMN_LETTER,
              APPS_FOR_EACH_RANGE_COLUMN_LETTER
            ]
          ]
        },
        {
          "type": "field_variable",
          "name": "VAR",
          "variable": 'i'
        },
        {
          "type": "input_value",
          "name": "LIST",
          "check": "Range"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Blocks.loops.HUE,
      "helpUrl": Blockly.Msg.APPS_DUMMY_HELPURL
    });
    this.appendStatementInput('DO')
        .appendField(Blockly.Msg.CONTROLS_FOREACH_INPUT_DO);
    // Assign "this" to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var tooltipTemplate = (
        'For each row in a range, set the variable \'%1\' to the row ' +
        'number, and then do some statements.');
      return tooltipTemplate.replace('%1', thisBlock.getFieldValue('VAR'));
    });
  },
  /**
   * Return all variables referenced by this block.
   * @return {!Array.<string>} List of variable names.
   * @this Blockly.Block
   */
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  /**
   * Notification that a variable is renaming.
   * If the name matches one of this block's variables, rename it.
   * @param {string} oldName Previous name of variable.
   * @param {string} newName Renamed variable.
   * @this Blockly.Block
   */
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setFieldValue(newName, 'VAR');
    }
  },
  customContextMenu: Blockly.Blocks['controls_for'].customContextMenu
};

Blockly.Blocks['apps_send_email'] = {
  /**
   * Block for sending an email.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": (
        "send an email to email address %1 with subject %2 and message %3"),
      "args0": [
        {
          "type": "input_value",
          "name": "RECIPIENT",
          "check": "String"
        },
        {
          "type": "input_value",
          "name": "SUBJECT",
          "check": "String"
        },
        {
          "type": "input_value",
          "name": "MESSAGE",
          "check": "String"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Blocks.apps.EMAIL_HUE,
      "helpUrl": Blockly.Msg.APPS_DUMMY_HELPURL
    });
    this.setTooltip(MSG_APPS_SEND_EMAIL_TOOLTIP);
  }
};
