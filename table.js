class TruthTable {

    varNames;
    tableInputs = [];
    tableMinTerms = []
    tableMaxTerms = []
    tableFunctions = {'functionNames':[]}

    constructor(varNameArray) {
        this.varNames = varNameArray;
        // For each possible combination of variables
        for (let i = 0; i < 2 ** this.varNames.length; i++) {
            // add an empty list
            let binaryList = []
            // get the binary representation with bits equal to the amount of variables
            let binaryString = i.toString(2).padStart(this.varNames.length, '0');
            // Add the individual bits in order
            for (let i = 0; i < binaryString.length; i++) {
                binaryList.push(binaryString[i])
            }
            // add binary list to the main list
            this.tableInputs.push(binaryList);
        }
    }

    addMinTerm() {
        for (let i = 0; i < this.tableInputs.length; i++) {
            let minTermHTMLString = '';
            for (let j = 0; j < this.varNames.length; j++) {
                let symbol = this.varNames[j];
                if (this.tableInputs[i][j] == '0') {
                    minTermHTMLString += `<span class="overline">${symbol}</span>` // overline the symbols to NOT
                } else {
                    minTermHTMLString += symbol // add regular symbol otherwise
                }
                if (j != this.varNames.length - 1) {
                    minTermHTMLString += '*';
                }

            }
            this.tableMinTerms.push(minTermHTMLString)
        }
    }

    addMaxTerm() {
        for (let i = 0; i < this.tableInputs.length; i++) {
            let HTMLString = '';
            for (let j = 0; j < this.varNames.length; j++) {
                let symbol = this.varNames[j];
                if (this.tableInputs[i][j] == '1') {
                    HTMLString += `<span class="overline">${symbol}</span>` // overline the symbols to NOT
                } else {
                    HTMLString += symbol // add regular symbol otherwise
                }
                if (j != this.varNames.length - 1) {
                    HTMLString += '+';
                }

            }
            this.tableMaxTerms.push(HTMLString)
        }
    }

    addFunction(booleanFunction) {
        this.tableFunctions['functionNames'].push(booleanFunction)
        this.tableFunctions[booleanFunction] = []
        let tableValuesDict = {} // make varNames keys in a dictionary
        for (let i = 0; i < this.tableInputs.length; i++) {
            for (let j = 0; j < this.varNames.length; j++) {
                tableValuesDict[this.varNames[j]] = this.tableInputs[i][j];
            }

            let formattedFunction = booleanFunction
            for (const key in tableValuesDict){
                formattedFunction = formattedFunction.replace(key, tableValuesDict[key])
            }
            console.log(formattedFunction);
            this.tableFunctions[booleanFunction].push(eval(formattedFunction))
        }
    }

    getMinTermsOfFunction(functionString){
        console.log(functionString)
        console.log(this.tableFunctions)
        let currentFunctionArray = this.tableFunctions[functionString];
        console.log(`getting minterms of: ${currentFunctionArray}`)
        let minTermString = '';
        for (let i = 1; i < currentFunctionArray.length; i++){
            if (currentFunctionArray[i] == 1){
                minTermString += this.tableMinTerms[i - 1] + '+';
            }
        }
        return minTermString.slice(0, minTermString.length - 1)
    }

    getMaxTermsOfFunction(functionString) {
        let currentFunctionArray = this.tableFunctions[functionString];
        let maxTermString = '';
        for (let i = 1; i < currentFunctionArray.length; i++) {
            if (currentFunctionArray[i] == 0) {
                maxTermString += `(${this.tableMaxTerms[i - 1]})*`;
            }
        }
        return maxTermString.slice(0, maxTermString.length - 1)
    }

    getTableHTML() {                                                  //TODO make functions display with new dictionary structure
        let tableHTML = '<table>\n';
        tableHTML += '<tr>\n'
        for (let i = 0; i < this.varNames.length; i++) {
            tableHTML += `<th>${this.varNames[i]}</th>\n`
        }
        if (this.tableFunctions.length > 0){
            for (let i = 0; i < this.tableFunctions.length; i++){
                tableHTML += `<th>${this.tableFunctions[i][0]}</th>`
            }
        }
        if (this.tableMinTerms.length != 0) {
            tableHTML += '<th>min</th>';
        }
        if (this.tableMaxTerms.length != 0) {
            tableHTML += '<th>Max</th>';
        }
        tableHTML += '</tr>\n'
        for (let i = 0; i < this.tableInputs.length; i++) {
            tableHTML += '<tr>\n'
            for (let j = 0; j < this.tableInputs[i].length; j++) {
                tableHTML += `<td>${this.tableInputs[i][j]}</td>\n`
            }
            if (this.tableFunctions.length != 0){
                for (let j = 0; j < this.tableFunctions.length; j++){
                    tableHTML += `<td>${this.tableFunctions[j][i + 1]}</td>\n`
                }
            }
            if (this.tableMinTerms.length != 0) {
                tableHTML += `<td>${this.tableMinTerms[i]}</td>`;
            }
            if (this.tableMaxTerms.length != 0) {
                tableHTML += `<td>${this.tableMaxTerms[i]}</td>`;
            }
            tableHTML += '</tr>\n'
        }
        tableHTML += '</table>\n'
        return tableHTML;
    }

    logTable() {
        // start with an empty string
        let displayString = ''
        // Write headers to displayString
        for (let i = 0; i < this.varNames.length; i++) {
            displayString += this.varNames[i] + ' ';
        }
        // Add a newline to start the table
        displayString += '\n';
        for (let i = 0; i < this.tableInputs.length; i++) {
            for (let j = 0; j < this.tableInputs[i].length; j++) {
                displayString += this.tableInputs[i][j] + " "
            }
            displayString += '\n'
        }
        return displayString
    }
}

table = new TruthTable(['a', 'b', 'c'])
table.addMinTerm()
table.addMaxTerm()
console.log('adding function a&&b')
table.addFunction('a&&b')
console.log(table.getTableHTML())
console.log(table.getMinTermsOfFunction('a&&b'))
document.getElementById('test_div').innerHTML += table.getTableHTML()
document.getElementById('test_div').innerHTML += `<div>MinTerms of f(0): ${table.getMinTermsOfFunction('a&&b')}</div>`
document.getElementById('test_div').innerHTML += `<div>MaxTerms of f(0): ${table.getMaxTermsOfFunction('a&&b')}</div>`
