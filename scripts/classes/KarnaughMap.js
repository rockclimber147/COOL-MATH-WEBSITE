class KarnaughMap {
    expression;
    varNames;
    functionValues;

    /**
     * Creates a Karnaugh Map
     * @param {String} expression A string representing the expression the K map is based on
     * @param {Array[String]} varNames The names of the input variables as a list
     * @param {Array[number]} functionValues A list of numbers corresponding to the output of the function
     * @throws Error o n invalid variable count (< 2 or > 4)
     */
    constructor(expression, varNames, functionValues){
        if (varNames.length < 2 || varNames.length > 4){
            throw new Error('Karnaugh Maps are currently supported for 2-4 variables, inclusive. You gave:' + varNames.length)
        }
        this.expression = expression;
        this.varNames = varNames;
        this.functionValues = functionValues;

    }

    /**
     * Converts a binary string to a gray code string
     * @param {String} binaryString The binary string to convert to gray code 
     * @returns string of gray code
     */
    convertBinaryStringToGrayCode(binaryString){
        // Start with most significant bit
        let grayString = binaryString[0]

        // Append result of nth XOR (nth - 1) bit starting at n = 1
        for (let i = 1; i < binaryString.length; i++){
            console.log(grayString)
            grayString += (parseInt(binaryString[i]) + parseInt(binaryString[i - 1])) % 2
        }
        
        return grayString
    }
}

map = new KarnaughMap('a+b', ['a', 'b'], [1, 1, 1, 0])
console.log(map.convertBinaryStringToGrayCode('1001'))