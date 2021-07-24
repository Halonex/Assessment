

Blockly.Blocks['text'] = {
  // Text value.
  category: 'Text',
  helpUrl: Blockly.Msg.LANG_TEXT_TEXT_HELPURL,
  init: function () {
    var textInput = new Blockly.FieldTextInput('');
    textInput.onFinishEditing_ = Blockly.Blocks.text
        .bumpBlockOnFinishEdit.bind(this);

    this.setColour(Blockly.TEXT_CATEGORY_HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.LANG_TEXT_TEXT_LEFT_QUOTE)
        .appendField(textInput, 'TEXT')
        .appendField(Blockly.Msg.LANG_TEXT_TEXT_RIGHT_QUOTE);
    this.setOutput(true, [Blockly.Blocks.text.connectionCheck]);
    this.setTooltip(Blockly.Msg.LANG_TEXT_TEXT_TOOLTIP);
  },
  errors: [{name:"checkInvalidNumber"}],
  typeblock: [{translatedName: Blockly.Msg.LANG_CATEGORY_TEXT}]
};

Blockly.Blocks.text.connectionCheck = function (myConnection, otherConnection, opt_value) {
  var otherTypeArray = otherConnection.check_;
  if (!otherTypeArray) {  // Other connection accepts everything.
    return true;
  }

  var block = myConnection.sourceBlock_;
  var shouldIgnoreError = Blockly.mainWorkspace.isLoading;
  var value = opt_value || block.getFieldValue('TEXT');

  for (var i = 0; i < otherTypeArray.length; i++) {
    if (otherTypeArray[i] == "String") {
      return true;
    } else if (otherTypeArray[i] == "Number") {
      if (shouldIgnoreError) {
        // Error may be noted by WarningHandler's checkInvalidNumber
        return true;
      } else if (Blockly.Blocks.Utilities.NUMBER_REGEX.test(value)) {
        // Value passes a floating point regex
        return !isNaN(parseFloat(value));
      }
    } else if (otherTypeArray[i] == "Key") {
      return true;
    }
  }
  return false;
};

/**
 * Bumps the text block out of its connection iff it is connected to a number
 * input and it no longer contains a number.
 * @param {string} finalValue The final value typed into the text input.
 * @this Blockly.Block
 */
Blockly.Blocks.text.bumpBlockOnFinishEdit = function(finalValue) {
  var connection = this.outputConnection.targetConnection;
  if (!connection) {
    return;
  }
  // If the connections are no longer compatible.
  if (!Blockly.Blocks.text.connectionCheck(
      this.outputConnection, connection, finalValue)) {
    connection.disconnect();
    connection.sourceBlock_.bumpNeighbours_();
  }
}

Blockly.Blocks['text_join'] = {
  // Create a string made up of any number of elements of any type.
  // TODO: (Andrew) Make this handle multiple arguments.
  category: 'Text',
  helpUrl: Blockly.Msg.LANG_TEXT_JOIN_HELPURL,
  init: function () {
    this.setColour(Blockly.TEXT_CATEGORY_HUE);
    this.setOutput(true, Blockly.Blocks.Utilities.YailTypeToBlocklyType("text", Blockly.Blocks.Utilities.OUTPUT));
    this.appendValueInput('ADD0')
        .appendField(Blockly.Msg.LANG_TEXT_JOIN_TITLE_JOIN);
    this.appendValueInput('ADD1');
    this.setTooltip(Blockly.Msg.LANG_TEXT_JOIN_TOOLTIP);
    this.setMutator(new Blockly.Mutator(['text_join_item']));
    this.emptyInputName = 'EMPTY';
    this.repeatingInputName = 'ADD';
    this.itemCount_ = 2;
  },
  mutationToDom: Blockly.mutationToDom,
  domToMutation: Blockly.domToMutation,
  decompose: function (workspace) {
    return Blockly.decompose(workspace, 'text_join_item', this);
  },
  compose: Blockly.compose,
  saveConnections: Blockly.saveConnections,
  addEmptyInput: function () {
    this.appendDummyInput(this.emptyInputName)
        .appendField(Blockly.Msg.LANG_TEXT_JOIN_TITLE_JOIN);
  },
  addInput: function (inputNum) {
    var input = this.appendValueInput(this.repeatingInputName + inputNum).setCheck(Blockly.Blocks.Utilities.YailTypeToBlocklyType("text", Blockly.Blocks.Utilities.INPUT));
    if (inputNum === 0) {
      input.appendField(Blockly.Msg.LANG_TEXT_JOIN_TITLE_JOIN);
    }
    return input;
  },
  updateContainerBlock: function (containerBlock) {
    containerBlock.inputList[0].fieldRow[0].setText(Blockly.Msg.LANG_TEXT_JOIN_TITLE_JOIN);
  },
  typeblock: [{translatedName: Blockly.Msg.LANG_TEXT_JOIN_TITLE_JOIN}]

};

Blockly.Blocks['text_join_item'] = {
  // Add items.
  init: function () {
    this.setColour(Blockly.TEXT_CATEGORY_HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.LANG_TEXT_JOIN_ITEM_TITLE_ITEM);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.LANG_TEXT_JOIN_ITEM_TOOLTIP);
    this.contextMenu = false;
  }
};