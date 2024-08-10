/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-underscore-dangle */

export class DeadlandsRollParser extends foundry.dice.RollParser {
  /**
   * Handle a dice term.
   * @param {NumericRollParseNode|ParentheticalRollParseNode|null} number  The number of dice.
   * @param {string|NumericRollParseNode|ParentheticalRollParseNode|null} faces  The number of die faces or a string
   *                                                                             denomination like "c" or "f".
   * @param {string|null} modifiers                                        The matched modifiers string.
   * @param {string|null} flavor                                           Associated flavor text.
   * @param {string} formula                                               The original matched text.
   * @returns {DiceRollParseNode}
   * @internal
   * @protected
   */
  _onDiceTerm(number, faces, modifiers, flavor, formula) {
    if (CONFIG.debug.rollParsing) {
      // eslint-disable-next-line no-console
      console.debug(
        this.constructor.formatDebug(
          'onDiceTerm',
          number,
          faces,
          modifiers,
          flavor,
          formula
        )
      );
    }

    // We're going to manipulate modifiers, make sure it's defined.
    const sanitisedModifiers = modifiers === null ? '' : modifiers;

    const loc = sanitisedModifiers?.indexOf('!');
    const useDeadlands = loc !== -1;

    if (useDeadlands) {
      // Remove the ! since it has been used to change the type of Die
      const alteredModifiers =
        sanitisedModifiers.slice(0, loc) + sanitisedModifiers.slice(loc + 1);

      return {
        class: 'DeadlandsDiceTerm',
        formula,
        modifiers: alteredModifiers,
        number,
        faces,
        evaluated: false,
        options: { flavor },
      };
    }

    return {
      class: 'DiceTerm',
      formula,
      modifiers: sanitisedModifiers,
      number,
      faces,
      evaluated: false,
      options: { flavor },
    };
  }
}
