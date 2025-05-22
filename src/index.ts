import Lexer from "./Lexer";
import Parser from "./Parser";

const code = `
код РАВНО 5 ПЛЮС 9 МИНУС (4 МИНУС 6);
КОНСОЛЬ код;
переменная РАВНО код ПЛЮС 3;
КОНСОЛЬ переменная;
КОНСОЛЬ переменная ПЛЮС код;
`;
const lexer = new Lexer(code);
lexer.lexAnalysis();

const parser = new Parser(lexer.tokenList);
const rootNode = parser.parseCode();
parser.run(rootNode);
