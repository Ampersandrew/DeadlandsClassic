/* eslint-disable no-underscore-dangle */
/* eslint-disable new-cap */
/* eslint-disable radix */

export class DeadlandsDie extends foundry.dice.terms.Die {
  original = '';

  /** @inheritdoc */
  get expression() {
    return this.original;
  }

  /* -------------------------------------------- */
  /*  Dice Term Methods                           */
  /* -------------------------------------------- */

  /**
   * Roll the DiceTerm by mapping a random uniform draw against the faces of the dice term.
   * @param {object} [options={}]                 Options which modify how a random result is produced
   * @param {boolean} [options.minimize=false]    Minimize the result, obtaining the smallest possible value.
   * @param {boolean} [options.maximize=false]    Maximize the result, obtaining the largest possible value.
   * @returns {Promise<DiceTermResult>}           The produced result
   */
  async roll({ minimize = false, maximize = false, ...options } = {}) {
    const roll = { result: undefined, active: true };
    roll.result = await this._roll(options);

    if (minimize) {
      roll.result = Math.min(1, this.faces);
    } else if (maximize) {
      roll.result = this.faces;
    } else if (roll.result === undefined) {
      let result = this.randomFace();
      roll.result = result;

      while (result === this.faces) {
        result = this.randomFace();
        roll.result += result;
      }
    }

    this.results.push(roll);
    return roll;
  }

  /* -------------------------------------------- */
  /*  Factory Methods                             */
  /* -------------------------------------------- */

  /** @override */
  static fromParseNode(node) {
    let { number, faces } = node;

    if (!number) {
      number = 1;
    }

    if (number.class) {
      number = Roll.defaultImplementation.fromTerms(
        Roll.defaultImplementation.instantiateAST(number)
      );
    }

    if (faces.class) {
      faces = Roll.defaultImplementation.fromTerms(
        Roll.defaultImplementation.instantiateAST(faces)
      );
    }

    const modifiers = Array.from(
      (node.modifiers || '').matchAll(this.MODIFIER_REGEXP)
    ).map(([m]) => m);

    const cls = CONFIG.Dice.terms.l;

    const data = { ...node, number, faces, modifiers, class: cls.name };

    return this.fromData(data);
  }
}
