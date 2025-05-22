import TokenType from "./TokenType";

export default class Token {
	type: TokenType;
	text: string;
	post: number;
	constructor(type: TokenType, text: string, post: number) {
		this.type = type;
		this.text = text;
		this.post = post;
	}
}
