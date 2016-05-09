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
 * @fileoverview Controller for the index page.
 *
 * @author sll@google.com (Sean Lip)
 */

var abMusicDemo = angular.module('abMusicDemo', []);

abMusicDemo.controller('Index', [
  '$scope', '$timeout', function($scope, $timeout) {
    $scope.levelSets = LEVEL_SETS;
    if ($scope.levelSets.length === 0) {
      throw 'Error: no level sets found.';
    }

    $scope.currentLevelSetIndex = 0;
    $scope.currentLevels = $scope.levelSets[$scope.currentLevelSetIndex].levels;
    $scope.currentLevelIndex = 0;
    $scope.currentLevel = $scope.currentLevels[$scope.currentLevelIndex];

    $scope.grade = '';

    $scope.setLevel = function(levelIndex) {
      $scope.currentLevelIndex = levelIndex;
      $scope.currentLevel = $scope.currentLevels[$scope.currentLevelIndex];
    };

    $scope.setLevelSet = function(levelSetIndex) {
      $scope.currentLevelSetIndex = levelSetIndex;
      $scope.currentLevels = $scope.levelSets[levelSetIndex].levels;
      $scope.setLevel(0);
    };

    $scope.isBlockAvailable = function(blockName) {
      return $scope.currentLevel.blocks.indexOf(blockName) !== -1;
    };

    var setGrade = function() {
      if (!$scope.currentLevel.expectedLine) {
        $scope.grade = 'Nice tune!';
        Blockly.getMainWorkspace().playAudio('applause');
      } else {
        var expectedLine = new MusicLine();
        expectedLine.setFromChordsAndDurations(
          $scope.currentLevel.expectedLine);

        $scope.grade = (
          musicPlayer.doesPlayerLineEqual(expectedLine) ?
          'Correct!' : 'Incorrect.');
        if (musicPlayer.doesPlayerLineEqual(expectedLine)) {
          Blockly.getMainWorkspace().playAudio('applause');
        }
      }

      $scope.$apply();
    };

    var resetPlayer = function() {
      musicPlayer.reset();
    };

    var populatePlayerLine = function() {
      // Generate JavaScript code and run it.
      window.LoopTrap = 1000;
      Blockly.JavaScript.INFINITE_LOOP_TRAP =
          'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';

      var code = Blockly.JavaScript.workspaceToCode(workspace);
      Blockly.JavaScript.INFINITE_LOOP_TRAP = null;

      try {
        eval(code);
      } catch (e) {
        alert(e);
      }
    };

    $scope.playAndGrade = function() {
      $scope.grade = '';
      resetPlayer();

      populatePlayerLine();

      var millisecsPerBeat = 60000.0 / $scope.currentLevel.beatsPerMinute;
      $timeout(function() {
        Blockly.getMainWorkspace().playAudio('countoff');
      }, 0);
      $timeout(function() {
        Blockly.getMainWorkspace().playAudio('countoff');
      }, millisecsPerBeat);
      $timeout(function() {
        musicPlayer.playPlayerLine(
            $scope.currentLevel.beatsPerMinute, setGrade);
      }, 2.0 * millisecsPerBeat);
    };

    $scope.playWithAccompanimentAndGrade = function() {
      $scope.grade = '';
      resetPlayer();

      musicPlayer.setAccompaniment($scope.currentLevel.accompaniment);
      populatePlayerLine();

      var millisecsPerBeat = 60000.0 / $scope.currentLevel.beatsPerMinute;
      $timeout(function() {
        Blockly.getMainWorkspace().playAudio('countoff');
      }, 0);
      $timeout(function() {
        Blockly.getMainWorkspace().playAudio('countoff');
      }, millisecsPerBeat);
      $timeout(function() {
        musicPlayer.playAllLines($scope.currentLevel.beatsPerMinute, setGrade);
      }, 2.0 * millisecsPerBeat);
    };

    $scope.playExpectedLine = function() {
      resetPlayer();
      musicPlayer.setAccompaniment($scope.currentLevel.expectedLine);
      musicPlayer.playAllLines($scope.currentLevel.beatsPerMinute);
    };
  }
]);
