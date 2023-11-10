class Number {
    debugMode = false
    numberBase;
    integerPartValues = [];           // list of decimal values of the symbol characters making the INTEGER part of the input number
    fractionalPartValues = [];        // list of decimal values of the symbol characters making the FRACTIONAL part of the input number
    fractionalRepeatingSlice = [];    // slice representing the repeating part of the fractional section
    processString;                    // used to store the steps executed when applying methods to itself

    /**
     * Construct a new number object with optional debug logging
     * @param {*} numString A string representing a number of any positive integer base greater than 2
     * @param {*} debugMode Sets debug logging when true
     */
    constructor(numString, base, debugMode) {
        this.debugMode = debugMode
        this.numberBase = base;
        let separatedNumber = numString.toUpperCase().split('.'); // split at decimal point
        this.debugLog(`${numString} => ${numString.split('.')}`)

        this.populateNumberLists(separatedNumber);
        this.debugLog(`Integer part: ${this.integerPartValues}\nFractional part: ${this.fractionalPartValues}`)
    }

    /**
     *                                                                                                                                                                                                        TODO 
     */
    convertToBaseTen(){
        this.processString = "";

        currentDigitSignificance = 0;
    }

    /**
     * Convert integer and fractional number lists to a symbol string
     * @returns symbolic representation of number lists as a string
     */
    getRepresentation(){
        let symbolString = "";
        for (let i = 0; i < this.integerPartValues.length; i++){
            symbolString += this.getModifiedChar(this.integerPartValues[i])
        }
        if (this.fractionalPartValues.length > 0){
            symbolString += '.'
            for (let i = 0; i < this.integerPartValues.length; i++) {
                symbolString += this.getModifiedChar(this.fractionalPartValues[i]);
            }
        }
        return symbolString;
    }

    /**
     * Translate input string into lists of decimal integers representing the decimal value of each symbol
     * @param {*} separatedNumber A list containing either the integer string or both the integer and fractional strings of the input number
     */
    populateNumberLists(separatedNumber){
        // Integer part will always come first so populate it
        if (separatedNumber[0].length == 0){
            this.integerPartValues.push(0); // Add a leading 0 if none was given
        }
        for (let i = 0; i < separatedNumber[0].length; i++) {
            this.integerPartValues.push(this.getModifiedOrdinal(separatedNumber[0][i]));
        }

        if (separatedNumber.length == 1) {
            this.debugLog('Integer');
        } else {
            if (separatedNumber[1].length == 0){
                this.fractionalPartValues.push(0); // Add a trailing zero if none was given
            }
            this.debugLog('Fractional');
            // Populate number values of fractional part
            for (let i = 0; i < separatedNumber[1].length; i++) {
                this.fractionalPartValues.push(this.getModifiedOrdinal(separatedNumber[1][i]));
            }
        }
    }
    /**
     * Translate input character to a decimal integer based on the character value
     * @param {*} character Input character
     * @returns Decimal representation of the input symbol mapped to hexadecimal standards and beyond
     */
    getModifiedOrdinal(character) {
        let charValue = character.charCodeAt();
        if (charValue >= 48 && charValue <= 57) {  // '0' == 48, map '0' - '9' to 0 - 9
            charValue -= 48;
        } else if (charValue >= 65 && charValue <= 90) { // 'A' == 65, map 'A' - 'Z' to 10 - 35
            charValue -= 55;
        } else {
            charValue -= 160;  // map any char higher than 'Z' to 36 +
        }
        return charValue;

    }

    /**
     * Translate a decimal integer to a symbol based on hexadecimal notation and beyond
     * @param {*} modifiedOrdinal The input integer
     * @returns String character representation of the integer
     */
    getModifiedChar(modifiedOrdinal){
        let charValue = modifiedOrdinal
        if (modifiedOrdinal <= 9){
            charValue += 48;
        } else if (modifiedOrdinal <= 35){
            charValue += 55;
        } else {
            charValue += 160;
        }
        return String.fromCharCode(charValue);
    }

    /**
     * Log input string to console if this.debugMode is true
     * @param {*} string The string to log
     */
    debugLog(string) {
        if (this.debugMode) {
            console.log(string);
        }
    }
}

// myNum = new Number('123abC.XYZ233', true);
// console.log(myNum.getRepresentation())
