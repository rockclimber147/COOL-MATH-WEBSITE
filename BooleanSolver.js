/**
 * Language GRAMMAR:
 * 
 * expression = Term (op Term)? -> One or more terms separated by BINARY OPERATORS
 *  
 * Term = !* Value (1 or 0)     -> A value preceded by 0 or more unary operators
 *        ( Expression )        -> Another expression inside parentheses
 *        
 * Handling OPERATOR PRECEDENCE
 * 
 * parentheses () 4
 * Not          ! 3
 * And          * 2
 * Or           + 1
 * 
 * Parenthses > Not > And > Or
 * 
 * Operators of greater or equal precedence of the next operator are evaluated from LEFT TO RIGHT
 * 
 * A and B or c
 *    +
 *   / \
 *   *  C
 *  / \
 * A   B
 * 
 * A or B or C
 *     +
 *    / \
 *   +   C
 *  / \ 
 * A   B
 * 
 * When evaluating left to right: A+B+C+D => (((A+B)+C)+D)
 * 
 * 
 * When the next operator has a higher precedence:
 * A or B and C
 *    +
 *   / \
 *  A   *
 *     / \
 *    B   C
 * 
 * COLORING EXPRESSIONS:
 * 
 * Example expression:
 * 1+0*(1*!0+1)
 * 1+
 *   0*
 *     (1*!0+1)
 */


/*
OPERATOR PRECEDENCES:

parentheses () 4
Not          ! 3
And          * 2
Or           + 1

*/

class Token {
    tokenType;
    lexeme;

    constructor(tokenType, lexeme) {
        this.tokenType = tokenType;
        this.lexeme = lexeme;
    }
}

class Tokenizer {
    debug = false;
    binaryOperators = ['*', '+'];
    values = ['0', '1'];

    inputString;
    stringIndex = 0;

    constructor(inputString, debug) {
        this.inputString = inputString;
        this.debug = debug;
    }

    advance() {
        // Return special value when end of input string reached
        if (this.stringIndex >= this.inputString.length){
            return null;
        }

        let currentChar = this.inputString[this.stringIndex];
        let tokenType;

        if (currentChar == '!') {
            tokenType = 'unaryOperator';
        } else if (this.binaryOperators.includes(currentChar)) {
            tokenType = 'binaryOperator';
        } else if (this.values.includes(currentChar)) {
            tokenType = 'binaryConstant';
        } else if (currentChar == '(') {
            tokenType = 'openParenthesis';
        } else if (currentChar == ')') {
            tokenType = 'closeParenthesis';
        } else {
            throw new Error(`unknown symbol: ${currentChar} at position ${this.stringIndex}`);
        }
        this.debugLog(`${currentChar}: ${tokenType}`);

        this.stringIndex++;
        return new Token(tokenType, currentChar)
    }

    debugLog(input) {
        if (this.debug) {
            console.log(input);
        }
    }
}

class BinaryNode {
    operator;
    leftBranch;
    rightBranch;

    constructor(nodeValue) {
        this.operator = nodeValue;
    }
    evaluate() {
        if (this.operator == '+') {
            if (this.leftBranch.evaluate() == '1' || this.rightBranch.evaluate() == '1') {
                return '1';
            }
        } else if (this.operator == '*') {
            if (this.leftBranch.evaluate() == '0' || this.rightBranch.evaluate() == '0') {
                return '0';
            }
        } else {
            throw new Error(`BinaryNode contains unknown operator: ${this.operator}`)
        }
    }
}

class UnaryNode {
    operator;
    child;
    constructor(nodeValue) {
        if (nodeValue != '!') {
            throw new Error(`UnaryNode contains operator other than '!': ${nodeValue}`)
        }
        this.operator = nodeValue;
    }
    evaluate() {
        if (this.value == '1') {
            return '0';
        }
        return '1';
    }
    addChild(node){
        this.child = node;
    }
}

class TerminalNode {
    value;
    constructor(value) {
        if (value != '1' && value != '0') {
            throw new Error(`TerminalNode contains illegal value: ${value}`)
        }
        this.value = value;
    }
    evaluate() {
        return this.value;
    }
}

class Parser {
    tokenizer;
    currentToken;
    operatorPrecedences = {
        '*': 2,
        '+': 1
    }
    tokenArray;

    constructor(expressionString, debug) {
        // load tokenizer
        this.tokenizer = new Tokenizer(expressionString, debug);
    }
    /**
     * 
     */
    parseExpression(previousPrecedence){

    }

    /**
     * Implements the
     */
    parseUnaryTerm(){
        this.currentToken = this.tokenizer.advance();
        switch (this.currentToken.tokenType){
            case 'unaryOperator': {
                let childNode = new UnaryNode(this.currentToken.lexeme);
                childNode.addChild(this.parseUnaryTerm());
                return childNode;
            } case 'binaryConstant': {
                return new TerminalNode(this.currentToken.lexeme);
            }
        }
    }
}

let parser = new Parser('!!!!!!1', true);
console.log(parser.parseUnaryTerm())