class KarnaughMap {
    expression;
    varNames;
    functionValues;

    kMapValues;
    rowLabels = [];
    colLabels = [];

    /**
     * Creates a Karnaugh Map
     * @param {String} expression A string representing the expression the K map is based on
     * @param {Array[String]} varNames The names of the input variables as a list
     * @param {Array[number]} functionValues A list of numbers corresponding to the output of the function
     * @throws Error o n invalid variable count (< 2 or > 4)
     */
    constructor(expression, varNames, functionValues) {
        if (varNames.length < 2 || varNames.length > 4) {
            throw new Error('Karnaugh Maps are currently supported for 2-4 variables, inclusive. You gave:' + varNames.length)
        }
        this.expression = expression;
        this.varNames = varNames;
        this.functionValues = functionValues;

        if (functionValues.length != 2 ** varNames.length) {
            throw new Error('The number of function values must be equal to 2 ^ the number of variables')
        }

        this.kMapValues = this.getKMapValues()
        this.generateLabels()

    }
    /**
     * Creates a list of lists of function values corresponding to the Karnaugh Map
     * @returns A list of lists of function values corresponding to the Karnaugh Map
     */
    getKMapValues() {
        let kMapValues = []
        if (this.varNames.length == 2) { // base case, 2x2 map
            kMapValues = [this.functionValues.slice(0, 2), this.functionValues.slice(2, 4)]
        } else {
            for (let n = 0; n < this.functionValues.length; n += 4) {
                kMapValues.push(this.functionValues.slice(n, n + 4))
            }
            // Handle Gray code
            for (let row in kMapValues) {
                // switch indexes 2 and 3
                let temp = kMapValues[row][2]
                kMapValues[row][2] = kMapValues[row][3]
                kMapValues[row][3] = temp
            }
            if (kMapValues.length == 4) {
                // switch indexes 2 and 3
                let temp = kMapValues[2]
                kMapValues[2] = kMapValues[3]
                kMapValues[3] = temp
            }
        }
        return kMapValues
    }

    generateLabels() {
        // set index breakpoint to account for 2,3,4 variable cases
        let colVars = Math.floor(this.kMapValues.length / 2);
        console.log('colVars', colVars)
        for (let i = 0; i < 2 ** colVars; i++) {
            let binaryString = i.toString(2).padStart(colVars, '0');
            let grayString = this.convertBinaryStringToGrayCode(binaryString)
            this.rowLabels.push(grayString)
        }
        let rowVars = this.varNames.length - colVars;
        console.log('rowVars', rowVars)
        for (let i = 0; i < 2 ** rowVars; i++) {
            let binaryString = i.toString(2).padStart(rowVars, '0');
            let grayString = this.convertBinaryStringToGrayCode(binaryString)
            this.colLabels.push(grayString)
        }
    }

    getHTMLString(spacing) {
        if (!spacing){
            spacing = ''
        }
    }

    /**
     * Logs a representation of the Karnaugh Map Values to the console
     */
    logKMapValues() {
        console.log(this.expression, this.colLabels)
        for (let row in this.kMapValues) {
            console.log(this.rowLabels[row], this.kMapValues[row])
        }
    }

    /**
     * Converts a binary string to a gray code string
     * @param {String} binaryString The binary string to convert to gray code 
     * @returns string of gray code
     */
    convertBinaryStringToGrayCode(binaryString) {
        // Start with most significant bit
        let grayString = binaryString[0]

        // Append result of nth XOR (nth - 1) bit starting at n = 1
        for (let i = 1; i < binaryString.length; i++) {
            grayString += (parseInt(binaryString[i]) + parseInt(binaryString[i - 1])) % 2
        }

        return grayString
    }
}

map = new KarnaughMap('test', ['a', 'b', 'c', 'd'], [0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1])
map.logKMapValues()