/**
 * @license
 * Visual Blocks Language
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
 * @fileoverview Generating JavaScript for apps blocks.
 * @author sll@google.com (Sean Lip)
 */
'use strict';

goog.provide('Blockly.JavaScript.apps');

goog.require('Blockly.JavaScript');

Blockly.JavaScript.AppsLibrary = {
  RangeObject: [
    'function ' + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
      '(topLeftCell, bottomRightCell) {',
    '  this.topLeftCell = topLeftCell.trim().toUpperCase();',
    '  this.bottomRightCell = bottomRightCell.trim().toUpperCase();',
    '}',
    Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
      '.prototype.getFirstRowNumber = function() {',
    '  var topLeftCoords = this.topLeftCell.match(/([A-Z]+)([0-9]+)/);',
    '  return Number(topLeftCoords[2]);',
    '};',
    Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
      '.prototype.getLastRowNumber = function() {',
    '  var bottomRightCoords = ' +
      'this.bottomRightCell.match(/([A-Z]+)([0-9]+)/);',
    '  return Number(bottomRightCoords[2]);',
    '};',
    Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
      '.prototype.getFirstColumnLetter = function() {',
    '  var topLeftCoords = this.topLeftCell.match(/([A-Z]+)([0-9]+)/);',
    '  return String(topLeftCoords[1]);',
    '};',
    Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
      '.prototype.getLastColumnLetter = function() {',
    '  var bottomRightCoords = ' +
      'this.bottomRightCell.match(/([A-Z]+)([0-9]+)/);',
    '  return String(bottomRightCoords[1]);',
    '};'
  ],
  getNextColumnLetter: [
    'function ' + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
      '(columnLetters) {',
    '  var reversedString = columnLetters.split("").reverse().join("");',
    '  var newReversedString = "";',
    '  var carry = 1;',
    '  for (var i = 0; i < reversedString.length; i++) {',
    '    var newCharCode = reversedString.charCodeAt(i) + carry;',
    '    if (newCharCode === "Z".charCodeAt(0) + 1) {',
    '      newReversedString += "A";',
    '      carry = 1;',
    '    } else {',
    '      newReversedString += String.fromCharCode(newCharCode);',
    '      carry = 0;',
    '    }',
    '  }',
    '  if (carry) {',
    '    newReversedString += "A";',
    '  }',
    '  return newReversedString.split("").reverse().join("");',
    '}'
  ],
  getRangeFromColumnHeaderAndRowNumber: [
    'function ' + Blockly.JavaScript.FUNCTION_NAME_PLACEHOLDER_ +
      '(sheet, columnHeader, rowNumber) {',
    '  var allHeaders = sheet.getDataRange().getValues()[0];',
    '  var columnIndex = allHeaders.indexOf(columnHeader) + 1;',
    '  return sheet.getRange(rowNumber, columnIndex);',
    '}'
  ]
};


Blockly.JavaScript['apps_on_click'] = function(block) {
  var funcName = Blockly.JavaScript.variableDB_.getName(
    block.getFieldValue('FUNCNAME'), Blockly.Procedures.NAME_TYPE);

  var onClickBody = Blockly.JavaScript.statementToCode(block, 'DO');
  onClickBody = Blockly.JavaScript.addLoopTrap(onClickBody, block.id);
  return (
    'function ' + funcName + '() {\n' +
    onClickBody +
    '}');
};


Blockly.JavaScript['apps_cell'] = function(block) {
  // TODO(sll): Check the format. It should be a string of letters, followed by
  // a string of numbers. It returns a string that represents a cell reference
  // in Sheet1!A1 notation.
  return [
    'SpreadsheetApp.getActiveSheet().getRange(\'' +
    block.getFieldValue('TEXT') + '\')',
    Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['apps_cell_by_header_and_row_number'] = function(block) {
  var columnHeader = block.getFieldValue('COLUMNHEADER');
  var rowNumber = Blockly.JavaScript.valueToCode(
    block, 'ROWNUMBER', Blockly.JavaScript.ORDER_COMMA) || '';

  var functionName = Blockly.JavaScript.provideFunction_(
      'apps_get_range_from_column_header_and_row_number',
      Blockly.JavaScript.AppsLibrary.getRangeFromColumnHeaderAndRowNumber);

  return [
    functionName + "(SpreadsheetApp.getActiveSheet(), '" +
    columnHeader + "', " +
    rowNumber + ')',
    Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['apps_cell_by_coords'] = function(block) {
  var columnLetter = Blockly.JavaScript.valueToCode(
    block, 'COLUMNLETTER', Blockly.JavaScript.ORDER_COMMA) || '';
  var rowNumber = Blockly.JavaScript.valueToCode(
    block, 'ROWNUMBER', Blockly.JavaScript.ORDER_COMMA) || '';

  return [
    'SpreadsheetApp.getActiveSheet().getRange(\n' +
    '  ' + columnLetter + ' + ' + rowNumber + ')',
    Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['apps_cell_by_coords_and_sheet_name'] = function(block) {
  var columnLetter = Blockly.JavaScript.valueToCode(
    block, 'COLUMNLETTER', Blockly.JavaScript.ORDER_COMMA) || '';
  var rowNumber = Blockly.JavaScript.valueToCode(
    block, 'ROWNUMBER', Blockly.JavaScript.ORDER_COMMA) || '';
  var sheetName = block.getFieldValue('SHEETNAME');

  return [
    'SpreadsheetApp.getActiveSpreadsheet().getSheetByName(\'' +
      sheetName + '\').getRange(\n' +
    '  ' + columnLetter + ' + ' + rowNumber + ')',
    Blockly.JavaScript.ORDER_ATOMIC];
};


Blockly.JavaScript['apps_get_cell_value'] = function(block) {
  var cellRange = Blockly.JavaScript.valueToCode(
    block, 'CELL', Blockly.JavaScript.ORDER_COMMA) || '';
  return [
    cellRange + '.getValues()[0][0]',
    Blockly.JavaScript.ORDER_ATOMIC
  ];
};

Blockly.JavaScript['apps_set_cell_value'] = function(block) {
  var cellRange = Blockly.JavaScript.valueToCode(
    block, 'CELL', Blockly.JavaScript.ORDER_COMMA) || '';
  var value = Blockly.JavaScript.valueToCode(
    block, 'CELLVALUE', Blockly.JavaScript.ORDER_ASSIGNMENT) || '';
  return cellRange + '.setValue(String(' + value + '));\n';
};

Blockly.JavaScript['apps_set_cell_background_colour'] = function(block) {
  var cellRange = Blockly.JavaScript.valueToCode(
    block, 'CELL', Blockly.JavaScript.ORDER_COMMA) || '';
  var colour = Blockly.JavaScript.valueToCode(
    block, 'COLOUR', Blockly.JavaScript.ORDER_ASSIGNMENT) || '';
  return cellRange + '.setBackground(' + colour + ');\n';
};

Blockly.JavaScript['apps_entire_range'] = function(block) {
  var fromCell = '\'A1\'';
  var toCell = (
    'SpreadsheetApp.getActiveSheet().getRange(\n' +
    '  1, 1,\n' +
    '  SpreadsheetApp.getActiveSheet().getLastRow(),\n' +
    '  SpreadsheetApp.getActiveSheet().getLastColumn()\n' +
    ').getA1Notation().substr(3)');

  var functionName = Blockly.JavaScript.provideFunction_(
      'apps_range_object',
      Blockly.JavaScript.AppsLibrary.RangeObject);

  return [
    'new ' + functionName + '(' + fromCell + ', ' + toCell + ')',
    Blockly.JavaScript.ORDER_ATOMIC
  ];
};

Blockly.JavaScript['apps_range'] = function(block) {
  var fromCell = Blockly.JavaScript.valueToCode(
    block, 'FROM', Blockly.JavaScript.ORDER_COMMA) + '.getA1Notation()';
  var toCell = Blockly.JavaScript.valueToCode(
    block, 'TO', Blockly.JavaScript.ORDER_COMMA) + '.getA1Notation()';

  var functionName = Blockly.JavaScript.provideFunction_(
      'apps_range_object',
      Blockly.JavaScript.AppsLibrary.RangeObject);

  return [
    'new ' + functionName + '(\n' +
    '  ' + fromCell + ',\n' +
    '  ' + toCell + ')',
    Blockly.JavaScript.ORDER_ATOMIC
  ];
};


Blockly.JavaScript['apps_create_sheet'] = function(block) {
  var newSheetName = Blockly.JavaScript.valueToCode(
    block, 'NAME', Blockly.JavaScript.ORDER_COMMA) || "'New Sheet'";
  // TODO(sll): Replace OLD_SHEET with a randomly-generated placeholder.
  return (
    'var OLD_SHEET = SpreadsheetApp.getActiveSheet();\n' +
    'SpreadsheetApp.getActiveSpreadsheet().insertSheet(' +
      newSheetName + ');\n' +
    'SpreadsheetApp.setActiveSheet(OLD_SHEET);\n');
};


Blockly.JavaScript['apps_for_each_range'] = function(block) {
  // For loop.
  var variable0 = Blockly.JavaScript.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var range = Blockly.JavaScript.valueToCode(
    block, 'LIST', Blockly.JavaScript.ORDER_ASSIGNMENT);
  var increment = '1';
  var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  branch = Blockly.JavaScript.addLoopTrap(branch, block.id);

  var axis = block.getFieldValue('AXIS');

  var getNextColumnLetterFunctionName = Blockly.JavaScript.provideFunction_(
      'apps_get_next_column_letter',
      Blockly.JavaScript.AppsLibrary.getNextColumnLetter);

  var code = '';

  // Cache non-trivial values to variables to prevent repeated look-ups.
  var startVar = Blockly.JavaScript.variableDB_.getDistinctName(
    variable0 + '_start', Blockly.Variables.NAME_TYPE);
  var firstFunc = (
    axis === APPS_FOR_EACH_RANGE_ROW_NUMBER ?
    'getFirstRowNumber()' : 'getFirstColumnLetter()');
  code += (
    'var ' + startVar + ' = ' + range + '.' + firstFunc + ';\n');

  var endVar = Blockly.JavaScript.variableDB_.getDistinctName(
    variable0 + '_end', Blockly.Variables.NAME_TYPE);
  var lastFunc = (
    axis === APPS_FOR_EACH_RANGE_ROW_NUMBER ?
    'getLastRowNumber()' : 'getLastColumnLetter()');
  code += 'var ' + endVar + ' = ' + range + '.' + lastFunc + ';\n';

  var incCode = (
    axis === APPS_FOR_EACH_RANGE_ROW_NUMBER ?
    variable0 + ' += 1' :
    variable0 + ' = ' + getNextColumnLetterFunctionName +
      '(' + variable0 + ')');

  // The != is to handle the column case.
  // TODO(sll): this is wrong; it needs to be <
  code += 'for (' + variable0 + ' = ' + startVar + ';\n' +
      '     ' + variable0 + ' != ' + endVar + ';\n' +
      '     ' + incCode + ') {\n' +
      branch + '}\n';
  return code;
};

Blockly.JavaScript['apps_send_email'] = function(block) {
  var recipient = Blockly.JavaScript.valueToCode(
    block, 'RECIPIENT', Blockly.JavaScript.ORDER_COMMA) || "''";
  var subject = Blockly.JavaScript.valueToCode(
    block, 'SUBJECT', Blockly.JavaScript.ORDER_COMMA) || "''";
  var message = Blockly.JavaScript.valueToCode(
    block, 'MESSAGE', Blockly.JavaScript.ORDER_COMMA) || "''";
  return (
    'MailApp.sendEmail(' + recipient + ', ' + subject + ', ' + message +
    ');\n');
};
