import TokenType from "./TokenType";

export default class Token {
  type: TokenType;
  text: string;
  post: string;
  constructor(type: TokenType, text: string, post: string) {
    this.type = type;
    this.text = text;
    this.post = post;
  }
}
