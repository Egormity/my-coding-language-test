import BinOperationNode from "./AST/BinOperationNode";
import ExpressionNode from "./AST/ExpressionNode";
import NumberNode from "./AST/NumberNode";
import StatementNode from "./AST/StatementNode";
import UnarOperationNode from "./AST/UnarOperationNode";
import VariableNode from "./AST/VariableNode";
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
			if (expected.some(type => type === currentToken.type)) {
				this.pos++;
				return currentToken;
			}
		}
		return null;
	}

	require(...expected: TokenType[]): Token {
		const token = this.match(...expected);
		if (!token) throw new Error(`На позиции ${this.pos} ожидался токен ${expected.join(", ")}`);
		return token;
	}

	parseVariableOrNumber(): ExpressionNode {
		const number = this.match(tokenTypeList.NUMBER);
		if (number !== null) return new NumberNode(number);

		const variable = this.match(tokenTypeList.VARIABLE);
		if (variable !== null) return new VariableNode(variable);

		throw new Error(`После переменной ожидался оператор присваивания на позиции ${this.pos}`);
	}

	parseParantheses(): ExpressionNode {
		if (this.match(tokenTypeList.LPAR) !== null) {
			const node = this.parseFormula();
			this.require(tokenTypeList.RPAR);
			return node;
		} else {
			return this.parseVariableOrNumber();
		}
	}

	parseFormula(): ExpressionNode {
		let leftNode = this.parseParantheses();
		let operator = this.match(tokenTypeList.PLUS, tokenTypeList.MINUS);
		while (operator !== null) {
			const rightNode = this.parseParantheses();
			leftNode = new BinOperationNode(operator, leftNode, rightNode);
			operator = this.match(tokenTypeList.PLUS, tokenTypeList.MINUS);
		}
		return leftNode;
	}

	parsePrint(): ExpressionNode {
		const token = this.match(tokenTypeList.LOG);
		if (token !== null) return new UnarOperationNode(token, this.parseFormula());
		throw new Error(`Ожидается унарный оператор на позиции ${this.pos}`);
	}

	parseExpression(): ExpressionNode {
		if (this.match(tokenTypeList.VARIABLE) === null) return this.parsePrint();
		this.pos--;

		let variableNode = this.parseVariableOrNumber();
		const assignOperator = this.match(tokenTypeList.ASSIGN);
		if (assignOperator !== null) {
			const rightFormulaNode = this.parseFormula();
			return new BinOperationNode(assignOperator, variableNode, rightFormulaNode);
		}

		throw new Error(`После переменной ожидался оператор присваивания на позиции ${this.pos}`);
	}

	parseCode(): ExpressionNode {
		const root = new StatementNode();
		while (this.pos < this.tokens.length) {
			const codeStringNode = this.parseExpression();
			this.require(tokenTypeList.SEMICOLON);
			root.addNode(codeStringNode);
		}
		return root;
	}

	run(node: ExpressionNode): any {
		if (node instanceof NumberNode) return node.number.text;
		if (node instanceof UnarOperationNode) {
			switch (node.operator.type) {
				case tokenTypeList.LOG:
					return console.log(this.run(node.operator));
				default:
					throw new Error(`Неизвестный оператор ${node.operator.text} на позиции ${this.pos}`);
			}
		}
		if (node instanceof BinOperationNode) {
			switch (node.operator.type.name) {
				case tokenTypeList.PLUS.name:
					return this.run(node.leftNode) + this.run(node.rightNode);
				case tokenTypeList.MINUS.name:
					return this.run(node.leftNode) - this.run(node.rightNode);
				case tokenTypeList.ASSIGN.name: {
					const result = this.run(node.rightNode);
					const variableNode = <VariableNode>node.leftNode;
					this.scope[variableNode.variable.text] = result;
					return result;
				}
			}
		}
		if (node instanceof VariableNode) {
			const variable = this.scope[node.variable.text];
			if (variable) return variable;
			throw new Error(`Переменная ${node.variable.text} не определена`);
		}
		if (node instanceof StatementNode) {
			node.codeString.forEach(codeStringNode => this.run(codeStringNode));
		}
		throw new Error(`Неизвестный тип узла на позиции ${this.pos}`);
	}
}
