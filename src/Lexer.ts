import Token from "./Token";
import { tokenTypeList } from "./TokenType";

export default class Lexer {
	code: string;
	pos: number = 0;
	tokenList: Token[] = [];

	constructor(code: string) {
		this.code = code;
	}

	lexAnalysis(): Token[] {
		while (this.nextToken()) {
			console.log("token: ", this.tokenList);
		}
		this.tokenList = this.tokenList.filter(token => token.type.name !== "SPACE");
		return this.tokenList;
	}

	nextToken(): boolean {
		if (this.pos > this.code.length - 1) return false;
		const tokenTypeValues = Object.values(tokenTypeList);
		for (let i = 0; i < tokenTypeValues.length; i++) {
			const tokenType = tokenTypeValues[i];
			const regex = new RegExp("^" + tokenType.regex);
			const match = this.code.substr(this.pos).match(regex);
			if (match && match[0]) {
				const token = new Token(tokenType, match[0], this.pos);
				this.pos += match[0].length;
				this.tokenList.push(token);
				return true;
			}
		}
		throw new Error(`Неизвестный символ в позиции ${this.pos}`);
	}
}
