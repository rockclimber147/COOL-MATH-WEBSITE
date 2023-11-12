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

    constructor (tokenType, lexeme){
        this.tokenType = tokenType;
        this.lexeme = lexeme;
    }
}

class Tokenizer {
    debug = false;
    binaryOperators = ['*', '+'];
    values = ['0', '1'];
    parentheses = ['(', ')'];

    constructor (debug) {
        this.debug = debug;
    }

    tokenize(inputString){
        let tokenArray = [];
        for (let i = 0; i < inputString.length; i++){
            let currentChar = inputString[i];
            let tokenType;

            if (currentChar == '!'){
                tokenType = 'unaryOperator'
            } else if (this.binaryOperators.includes(currentChar)){
                tokenType = 'binaryOperator'
            } else if (this.values.includes(currentChar)){
                tokenType = 'binaryConstant'
            } else if (this.parentheses.includes(currentChar)){
                tokenType = 'parenthesis'
            } else {
                throw new Error(`unknown symbol: ${currentChar} at position ${i}`);
            }
            this.debugLog(`${currentChar}: ${tokenType}`);
            tokenArray.push(new Token(tokenType, currentChar))
        }
        return tokenArray;
    }

    debugLog(input){
        if (this.debug){
            console.log(input);
        }
    }
}

class BinaryNode {
    nodeValue;
    leftBranch;
    rightBranch;

    constructor (nodeType, nodeValue){
        this.nodeType = nodeType;
        this.nodeValue = nodeValue;
    }
    evaluate() {
        if (this.nodeValue == '+'){
            if (this.leftBranch.evaluate() == 1 || this.rightBranch.evaluate() == 1){
                return 1;
            }
        } else if (this.nodeValue == '*'){
            if (this.leftBranch.evaluate() == 0 || this.rightBranch.evaluate() == 0){
                return 0;
            }
        } else {
            throw new Error(`BinaryNode contains unknown operator: ${this.nodeValue}`)
        }
    }
}

class Parser {
    operatorPrecedences = {
        '!': 3,
        '*': 2,
        '+': 1
    }
}

let tokenizer = new Tokenizer(true);
console.log(tokenizer.tokenize('1*0+1*!(0+1)'));