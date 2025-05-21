import Token from "../Token";
import ExpressionNode from "./ExpressionNode";

export default class UnarOperationNode {
  operator: Token;
  node: ExpressionNode;

  constructor(operator: Token, node: ExpressionNode) {
    this.operator = operator;
    this.node = node;
  }
}
