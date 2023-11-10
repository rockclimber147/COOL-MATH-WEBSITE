class Number {
    debugMode = false
    numString;
    integerPartValues = [];
    fractionalPartValues = [];
    fractionalRepeatingSlice = [];

    constructor(numString, debugMode) {
        this.debugMode = debugMode
        let separatedNumber = numString.toUpperCase().split('.');
        this.debugLog(`${numString} => ${numString.split('.')}`)

        this.populateNumberLists(separatedNumber);
        this.debugLog(`Integer part: ${this.integerPartValues}\nFractional part: ${this.fractionalPartValues}`)
    }

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

    debugLog(string) {
        if (this.debugMode) {
            console.log(string);
        }
    }
}

// myNum = new Number('123abC.XYZ233', true);
// console.log(myNum.getRepresentation())