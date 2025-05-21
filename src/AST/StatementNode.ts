import ExpressionNode from "./ExpressionNode";

export default class StatementNode extends ExpressionNode {
  codeString: ExpressionNode[] = [];

  constructor() {
    super();
  }

  addNode(node: ExpressionNode) {
    this.codeString.push(node);
  }
}
