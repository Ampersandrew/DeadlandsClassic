import { DeadlandsDie } from './dlc-die.mjs';

export class DeadlandsRoll extends foundry.dice.Roll {
  /**
   * Instantiate the nodes in an AST sub-tree into RollTerm instances.
   * @param {RollParseNode} ast  The root of the AST sub-tree.
   * @returns {RollTerm[]}
   */
  static instantiateAST(ast) {
    return CONFIG.Dice.parser.flattenTree(ast).map((node) => {
      if (node.class === 'DeadlandsDiceTerm') {
        const { formula } = node;
        const dD = DeadlandsDie.fromParseNode(node);
        dD.original = formula;
        return dD;
      }

      const cls = foundry.dice.terms[node.class] ?? foundry.dice.terms.RollTerm;
      return cls.fromParseNode(node);
    });
  }
}
