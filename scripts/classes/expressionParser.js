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
        if (this.stringIndex >= this.inputString.length) {
            this.debugLog('End of token reached.')
            return new Token('EOF', null);
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
        // this.debugLog(`${currentChar}: ${tokenType}`);

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
            return '0'
        } else if (this.operator == '*') {
            if (this.leftBranch.evaluate() == '0' || this.rightBranch.evaluate() == '0') {
                return '0';
            }
            return '1';
        } else {
            throw new Error(`BinaryNode contains unknown operator: ${this.operator}`)
        }
    }
    getHTML(indentCount) {
        return `${'    '.repeat(indentCount)}<table cellpadding="1" cellspacing="1">
        ${'    '.repeat(indentCount + 1)}<tr>
        ${'    '.repeat(indentCount + 2)}<th class="operator" colspan="2">${this.operator}</th>
        ${'    '.repeat(indentCount + 1)}</tr>
        ${'    '.repeat(indentCount + 1)}<tr>
        ${'    '.repeat(indentCount + 2)}<td>
        ${this.leftBranch.getHTML(indentCount + 3)}
        ${'    '.repeat(indentCount + 2)}</td>
        ${'    '.repeat(indentCount + 2)}<td>
        ${this.rightBranch.getHTML(indentCount + 3)}
        ${'    '.repeat(indentCount + 2)}</td>
        ${'    '.repeat(indentCount + 1)}</tr>
        ${'    '.repeat(indentCount)}</table>`
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
        if (this.child.evaluate() == '1') {
            return '0';
        }
        return '1';
    }
    addChild(node) {
        this.child = node;
    }
    getHTML(indentCount) {
        return `${'    '.repeat(indentCount)}<table cellpadding="1" cellspacing="1">
        ${'    '.repeat(indentCount + 1)}<tr>
        ${'    '.repeat(indentCount + 2)}<th class="operator">${this.operator}</th>
        ${'    '.repeat(indentCount + 1)}</tr>
        ${'    '.repeat(indentCount + 1)}<tr>
        ${'    '.repeat(indentCount + 2)}<td>
        ${this.child.getHTML(indentCount + 3)}
        ${'    '.repeat(indentCount + 2)}</td>
        ${'    '.repeat(indentCount + 1)}</tr>
        ${'    '.repeat(indentCount)}</table>`
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
    getHTML(indentCount) {
        return `${'    '.repeat(indentCount)}<span class="constant">${this.value}</span>`
    }
}

class Parser {
    debug = false;
    tokenizer;
    currentToken;
    operatorPrecedences = {
        '*': 2,
        '+': 1
    }
    tokenArray;

    constructor(expressionString, debug) {
        this.debug = debug;
        // load tokenizer
        this.tokenizer = new Tokenizer(expressionString, debug);
        // load first token
        this.advance()
    }

    advance(expectedLexeme){
        if (typeof expectedLexeme !== 'undefined'){
            if (this.currentToken.lexeme != expectedLexeme){
                throw new Error(`Unexpected symbol at index ${this.tokenizer.stringIndex} (expected:'${expectedLexeme}', received: '${this.currentToken.lexeme}'`)
            }
        }
        this.currentToken = this.tokenizer.advance(); 
    }
    /**
     * 
     */
    parseExpression(previousPrecedence) {
        // Token is already loaded, first term in a valid expression will never be a binary operator
        let child = this.parseUnaryTerm();
        if (this.currentToken.tokenType == 'EOF') { // return if 
            return child;
        }
        let currentOperator = this.currentToken.lexeme;
        this.debugLog(`Parser current token from parseExpression: ${currentOperator}`);

        let currentPrecedence = this.operatorPrecedences[currentOperator]
        this.debugLog(`Parser current precedence: ${currentPrecedence}`);

        while (currentPrecedence != undefined){
            if (currentPrecedence <= previousPrecedence){
                break;
            } else {
                this.debugLog(`Parser current precedence greater than previous precedence`);
                this.advance();
                this.debugLog(`Parser current token from parseExpression: ${this.currentToken.lexeme}`);
                child = this.parseBinaryTerm(currentOperator, child);
                currentOperator = this.currentToken.lexeme;
                this.debugLog(`Parser current token from parseExpression: ${currentOperator}`);
                currentPrecedence = this.operatorPrecedences[currentOperator]
                this.debugLog(`Parser current precedence: ${currentPrecedence}`);
            }
        }
        return child;
    }

    parseBinaryTerm(currentOperator, leftChild){
        let currentNode = new BinaryNode(currentOperator);
        currentNode.leftBranch = leftChild;
        currentNode.rightBranch = this.parseExpression(this.operatorPrecedences[currentOperator]);
        return currentNode;
    }

    /**
     * parses NOT until a binary value OR OPEN PARENTHESIS is encountered and returns a UnaryNode
     */
    parseUnaryTerm() {
        // Current Token is already set
        this.debugLog(`current Token from parseUnaryTerm(): ${this.currentToken.lexeme}`)
        let childNode;

        switch (this.currentToken.tokenType) {
            case 'unaryOperator': {
                // make a child unaryNode
                childNode = new UnaryNode(this.currentToken.lexeme);
                // load token for unaryNode
                this.advance()
                // add results of recursive call to unary node
                childNode.addChild(this.parseUnaryTerm());
                break;
            } case 'binaryConstant': {
                // end of branch reached, return terminalNode
                childNode = new TerminalNode(this.currentToken.lexeme);
                // advance to next token
                this.advance();
                break;
            } case 'openParenthesis': {
                // load first token of expression
                this.advance('(')
                // recursively call parseExpression with op precedence of 0
                childNode = this.parseExpression(0);
                this.advance(')');
                break;
            }
            default: {
                throw new Error(`Unexpected tokenType in unary term: ${this.currentToken.tokenType}`)
            }
        }
        return childNode;
    }


    debugLog(input){
        if (this.debugLog){
            console.log(input);
        }
    }
}

export {Parser}