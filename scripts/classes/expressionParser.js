
/**
 * Describes a token
 */
class Token {
    tokenType;
    lexeme;

    /**
     * Construct a Token
     * @param {string} tokenType The type of the token
     * @param {string} lexeme the character representing the token
     */
    constructor(tokenType, lexeme) {
        this.tokenType = tokenType;
        this.lexeme = lexeme;
    }
}

/**
 * Carries out the actioons of a Tokenizer or Lexer
 */
class Tokenizer {
    debug = false;
    binaryOperators = ['*', '+'];
    binaryValues = ['0', '1'];

    inputString;
    stringIndex = 0;

    /**
     * Construct a Tokenizer instance
     * @param {string} inputString String to tokenize
     * @param {boolean} debug Sets debug logging state
     */
    constructor(inputString, debug) {
        this.inputString = inputString;
        this.debug = debug;
    }

    /**
     * Read the next character of the input string and constructs a token
     * @returns A valid Token instance
     */
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
        } else if (this.binaryValues.includes(currentChar)) {
            tokenType = 'binaryConstant';
        } else if (currentChar == '(') {
            tokenType = 'openParenthesis';
        } else if (currentChar == ')') {
            tokenType = 'closeParenthesis';
        } else if ((currentChar >= '2' && currentChar <= '9')){
            this.stringIndex++;
            throw new Error(`Invalid symbol: ${currentChar}${this.getTokenPointerString()}`)
        } else if (currentChar.length == 1) {
            tokenType = 'identifier';
        } else {
            this.stringIndex++;
            throw new Error(`unknown symbol: ${currentChar} at position ${this.stringIndex}${this.getTokenPointerString()}`);
        }

        this.stringIndex++;
        return new Token(tokenType, currentChar)
    }

    /**
     * Make an HTML string to point out the location of the current token in the input expression
     * @returns An HTML string pointing out the current token from the input expression
     */
    getTokenPointerString() {
        let paddingLeft = this.stringIndex - 1;
        let paddingRight = this.inputString.length - paddingLeft - 1;
        console.log(`Token pointer: pLeft:${paddingLeft} pRight:${paddingRight}`)
        let errorString = `<br>${this.inputString}<br>${'&#160'.repeat(paddingLeft)}^${'&#160'.repeat(paddingRight)}<br>`
        console.log(errorString)
        return errorString
    }

    /**
     * Log message when debugmode is true
     * @param {string} message Message to log
     */
    debugLog(message){
        if (this.debugLog){
            console.log(message);
        }
    }
}

/**
 * Represents a binary operation in an abstract syntax tree
 */
class BinaryNode {
    operator;
    leftBranch;
    rightBranch;

    parser;

    /**
     * Construct a BinaryNode instance with a reference to the parent Parser instance
     * @param {string} nodeValue The operation string to store
     * @param {Parser} parser The parent Parser instance
     */
    constructor(nodeValue, parser) {
        this.operator = nodeValue;
        this.parser = parser;
    }

    /**
     * Recursively evaluates itself and all child nodes based on stored operators
     * @returns A string representing the result of the evaluation
     */
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

    /**
     * Recursively constructs an HYML table string of itself and all child nodes
     * @param {number} indentCount The amount of times to indent
     * @param {number} padding The type of padding to indent with
     * @returns a string representing an HTML table
     */
    getHTML(indentCount, padding) {
        return `${padding.repeat(indentCount)}<table cellpadding="1" cellspacing="1">
        ${padding.repeat(indentCount + 1)}<tr>
        ${padding.repeat(indentCount + 2)}<th class="operator" colspan="2">${this.operator}</th>
        ${padding.repeat(indentCount + 1)}</tr>
        ${padding.repeat(indentCount + 1)}<tr>
        ${padding.repeat(indentCount + 2)}<td valign="top">
        ${this.leftBranch.getHTML(indentCount + 3, padding)}
        ${padding.repeat(indentCount + 2)}</td>
        ${padding.repeat(indentCount + 2)}<td valign="top">
        ${this.rightBranch.getHTML(indentCount + 3, padding)}
        ${padding.repeat(indentCount + 2)}</td>
        ${padding.repeat(indentCount + 1)}</tr>
        ${padding.repeat(indentCount)}</table>`
    }
}

class UnaryNode {
    operator;
    child;

    parser;

    /**
     * Constructs an instanc of a UnaryNode
     * @param {string} nodeValue The unary operator to store
     * @param {Parser} parser A reference to the parent Parser instance
     */
    constructor(nodeValue, parser) {
        if (nodeValue != '!') {
            throw new Error(`UnaryNode contains operator other than '!': ${nodeValue}`)
        }
        this.operator = nodeValue;
        this.parser = parser;
    }

    /**
     * Recursively evaluates itself and all child nodes based on stored operators
     * @returns A string representing the result of the evaluation
     */
    evaluate() {
        if (this.child.evaluate() == '1') {
            return '0';
        }
        return '1';
    }

    /**
     * Recursively constructs an HYML table string of itself and all child nodes
     * @param {number} indentCount The amount of times to indent
     * @param {number} padding The type of padding to indent with
     * @returns a string representing an HTML table
     */
    getHTML(indentCount, padding) {
        return `${'    '.repeat(indentCount)}<table cellpadding="1" cellspacing="1">
        ${'    '.repeat(indentCount + 1)}<tr>
        ${'    '.repeat(indentCount + 2)}<th class="operator">${this.operator}</th>
        ${'    '.repeat(indentCount + 1)}</tr>
        ${'    '.repeat(indentCount + 1)}<tr>
        ${'    '.repeat(indentCount + 2)}<td valign="top">
        ${this.child.getHTML(indentCount + 3, padding)}
        ${'    '.repeat(indentCount + 2)}</td>
        ${'    '.repeat(indentCount + 1)}</tr>
        ${'    '.repeat(indentCount)}</table>`
    }
}

class TerminalNode {
    value;

    parser;

    constructor(value, parser) {
        this.value = value;
        this.parser = parser;
    }

    /**
     * Returns the stored value or symbol value given the symbol table of the parent Parser instance
     * @returns A number
     */
    evaluate() {
        let returnValue;
        switch (this.value){
            case '1': {
                returnValue = '1';
                break;
            } case '0': {
                returnValue = '0';
                break;
            } default: {
                returnValue = this.parser.symbolTable[this.value];
                break;
            }
        }
        if (returnValue === undefined){
            throw new Error(`Runtime Error: ${this.value} is not defined`)
        }
        return returnValue;
    }

    /**
     * Recursively constructs an HYML table string of itself and all child nodes
     * @param {number} indentCount The amount of times to indent
     * @param {number} padding The type of padding to indent with
     * @returns a string representing an HTML table
     */
    getHTML(indentCount, padding) {
        return `${padding.repeat(indentCount)}<span class="constant">${this.value}</span>`
    }
}

class Parser {
    debug = false;

    tokenizer;
    currentToken;
    tree;

    operatorPrecedences = {
        '*': 2,
        '+': 1
    }

    /**
     * Constructs an instance of a Parser
     * @param {string} expressionString THe expression to parse as a string
     * @param {boolean} debug Sets debug logging state
     */
    constructor(expressionString, debug) {
        this.debug = debug;
        // load tokenizer
        this.tokenizer = new Tokenizer(expressionString, debug);
        // load first token
        this.advance()
    }

    /**
     * Verifies the current token lexeme and advances the stored Tokenizer instance
     * @param {string} expectedLexeme the lexeme of the current Token instance to check
     */
    advanceGivenLexeme(expectedLexeme){
        if (this.currentToken.lexeme != expectedLexeme) {
           this.throwSyntaxErrorSymbolExpected(expectedLexeme)
        }
        this.currentToken = this.tokenizer.advance(); 
    }

    /**
     * Verifies the current token type and advances the stored Tokenizer instance
     * @param {*} expectedType the tokenType of the current Token instance to check
     */
    advanceGivenType(expectedType){
        if (this.currentToken.tokenType != expectedType) {
            this.throwSyntaxErrorTypeExpected(expectedType);
        }
        this.currentToken = this.tokenizer.advance();
    }

    /**
     * Advances the stored Tokenizer instance
     */
    advance(){
        this.currentToken = this.tokenizer.advance(); 
    }

    /**
     * Constructs an abstract syntax tree and stores it as an instance variable
     */
    constructAST(){
        this.tree = this.parseExpression(0);
    }

    /**
     * Recursively parses Tokens and constructs an abstract syntax tree
     * @param {number} previousPrecedence the operator precedence value to start at
     * @returns A UnaryNode or BinaryNode
     */
    parseExpression(previousPrecedence) {
        // Token is already loaded, first term in a valid expression will never be a binary operator
        let child = this.parseUnaryTerm();

        if (this.currentToken.tokenType == 'EOF' || this.currentToken.lexeme == ')') {
            return child;
        }

        if (this.currentToken.tokenType != 'binaryOperator'){
            this.throwSyntaxErrorTypeExpected('binaryOperator');
        }
        let currentOperator = this.currentToken.lexeme;
        this.debugLog(`Parser current token from parseExpression: ${currentOperator}`);

        let currentPrecedence = this.operatorPrecedences[currentOperator]
        this.debugLog(`Parser current precedence: ${currentPrecedence}`);

        while (currentPrecedence != undefined){
            if (currentPrecedence <= previousPrecedence){
                break;
            } else {
                this.advance();
                child = this.parseBinaryTerm(currentOperator, child);
                currentOperator = this.currentToken.lexeme;

                currentPrecedence = this.operatorPrecedences[currentOperator]
            }
        }
        return child;
    }

    /**
     * Parses a binary term
     * @param {string} currentOperator The current operator
     * @param {BinaryNode, UnaryNode} leftChild Part of an abstract sybtax tree
     * @returns A BinaryNode
     */
    parseBinaryTerm(currentOperator, leftChild){
        let currentNode = new BinaryNode(currentOperator);
        currentNode.leftBranch = leftChild;
        currentNode.rightBranch = this.parseExpression(this.operatorPrecedences[currentOperator]);
        return currentNode;
    }

    /**
     * Parses a unary term
     * @returns Part of an abstract sybtax tree
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
                childNode.child =this.parseUnaryTerm();
                break;
            } case 'binaryConstant': {
                // end of branch reached, return terminalNode
                childNode = new TerminalNode(this.currentToken.lexeme);
                // advance to next token
                this.advance();
                break;
            } case 'identifier': {
                // end of branch reached, return terminalNode
                childNode = new TerminalNode(this.currentToken.lexeme);
                // advance to next token
                this.advance();
                break;
            } case 'openParenthesis': {
                // load first token of expression
                this.advanceGivenLexeme('(')
                // recursively call parseExpression with op precedence of 0
                childNode = this.parseExpression(0);
                this.advanceGivenLexeme(')');
                break;
            }
            default: {
                this.throwSyntaxErrorGeneric();
            }
        }
        return childNode;
    }

    /**
     * Throws an Error if the current Token instance type doesn't match the argument
     * @param {string} expectedType The expected token type
     */
    throwSyntaxErrorTypeExpected(expectedType){
        throw new Error(`Unexpected token: ${this.currentToken.lexeme} ${this.tokenizer.getTokenPointerString()} Expected type: ${expectedType}, Received: ${this.currentToken.tokenType}`)
    }

    /**
     * Throws an Error if the current Token instance lexeme doesn't match the argument
     * @param {string} expectedSymbol The expected symbol
     */
    throwSyntaxErrorSymbolExpected(expectedSymbol) {
        throw new Error(`Unexpected symbol: ${this.currentToken.lexeme} ${this.tokenizer.getTokenPointerString()} Expected: ${expectedSymbol}`)
    }

    /**
     * Throws a syntax error
     */
    throwSyntaxErrorGeneric(){
        throw new Error(`Syntax Error:${this.tokenizer.getTokenPointerString()}`)
    }

    /**
     * Log message when debugmode is true
     * @param {string} message Message to log
     */
    debugLog(message){
        if (this.debugLog){
            console.log(message);
        }
    }
}

export {Parser}