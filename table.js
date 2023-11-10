class TruthTable{
    
    varNames;
    tableInputs = [];

    constructor (varNameArray){
        this.varNames = varNameArray;
        // For each possible combination of variables
        for (let i = 0; i < 2 ** this.varNames.length; i++){
            // add an empty list
            let binaryList = []
            // get the binary representation with bits equal to the amount of variables
            let binaryString = i.toString(2).padStart(this.varNames.length, '0');
            // Add the individual bits in order
            for (let i = 0; i < binaryString.length; i++){
                binaryList.push(binaryString[i])
            }
            // Add a symbolic divider
            binaryList.push('|');
            // add binary list to the main list
            this.tableInputs.push(binaryList);
        }
    }

    logTable(){
        // start with an empty string
        let displayString = ''
        // Write headers to displayString
        for (let i = 0; i < this.varNames.length; i++){
            displayString += this.varNames[i] + ' ';
        }
        // Add a newline to start the table
        displayString += '\n';
        for (let i = 0; i < this.tableInputs.length; i++){
            for (let j = 0; j < this.tableInputs[i].length; j++){
                displayString += this.tableInputs[i][j] + " "
            }
            displayString += '\n'
        }
        return displayString
    }
}

table = new TruthTable(['a', 'b', 'c'])
console.log(table.logTable())