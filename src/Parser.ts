import ExpressionNode from "./AST/ExpressionNode";
import StatementNode from "./AST/StatementNode";
import Token from "./Token";
import TokenType, { tokenTypeList } from "./TokenType";

export default class Parser {
  tokens: Token[];
  pos: number = 0;
  scope: any = {};

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  match(...expected: TokenType[]): Token | null {
    if (this.pos < this.tokens.length) {
      const currentToken = this.tokens[this.pos];
      if (expected.some((type) => type === currentToken.type)) {
        this.pos++;
        return currentToken;
      }
    }
    return null;
  }

  require(...expected: TokenType[]): Token {
    const token = this.match(...expected);
    if (!token)
      throw new Error(
        `На позиции ${this.pos} ожидался токен ${expected.join(", ")}`
      );
    return token;
  }

  parsePrint() {}

  parseVariableOrNumber() {}

  parseExpression(): ExpressionNode {
    if (this.match(tokenTypeList.VARIABLE) === null) return this.parsePrint();
    this.pos--;
    let variableNode = this.parseVariableOrNumber();
    const assignOperator = this.match(tokenTypeList.ASSIGN);
    if (assignOperator !== null) {
    }
    throw new Error(
      `После переменной ожидался оператор присваивания на позиции ${this.pos}`
    );
  }

  parseCode(): ExpressionNode {
    const root = new StatementNode();
    while (this.pos < this.tokens.length) {
      const codeStringNode = this.parseExpression();
      this.require(tokenTypeList.SEMICOLON);
      root.addNode(codeStringNode);
    }
  }
}
