class TruthTable {

    varNames;
    tableInputs = [];
    tableMinTerms = []
    tableMaxTerms = []
    tableFunctions = []

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

    addColumn(columnType) {
        switch (columnType) {
            case 'minTerm': {
                this.addMinTerm();
                break;
            } case 'addMaxTerm': {
                this.addMaxTerm();
                break;
            }
        }
    }

    addMinTerm() {
        for (let i = 0; i < this.tableInputs.length; i++) {
            let minTermHTMLString = '<td>';
            for (let j = 0; j < this.varNames.length; j++) {
                let symbol = this.varNames[j];
                if (this.tableInputs[i][j] == '0') {
                    minTermHTMLString += `<span class="overline">${symbol}</span>` // overline the symbols to NOT
                } else {
                    minTermHTMLString += symbol // add regular symbol otherwise
                }
                if (j != this.varNames.length - 1){
                    minTermHTMLString += '*';
                }
                
            }
            minTermHTMLString += '</td>'
            this.tableMinTerms.push(minTermHTMLString + '\n')
        }
    }

    addMaxTerm() {
        for (let i = 0; i < this.tableInputs.length; i++) {
            let minTermHTMLString = '<td>';
            for (let j = 0; j < this.varNames.length; j++) {
                let symbol = this.varNames[j];
                if (this.tableInputs[i][j] == '1') {
                    minTermHTMLString += `<span class="overline">${symbol}</span>` // overline the symbols to NOT
                } else {
                    minTermHTMLString += symbol // add regular symbol otherwise
                }
                if (j != this.varNames.length - 1) {
                    minTermHTMLString += '+';
                }

            }
            minTermHTMLString += '</td>'
            this.tableMaxTerms.push(minTermHTMLString + '\n')
        }
    }

    getTableHTML() {
        let tableHTML = '<table>\n';
        tableHTML += '<tr>\n'
        for (let i = 0; i < this.varNames.length; i++) {
            tableHTML += `<th>${this.varNames[i]}</th>\n`
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
            if (this.tableMinTerms.length != 0){
                tableHTML += this.tableMinTerms[i];
            }
            if (this.tableMaxTerms.length != 0) {
                tableHTML += this.tableMaxTerms[i];
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
console.log(table.getTableHTML())
document.getElementById('test_div').innerHTML = table.getTableHTML()