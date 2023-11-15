import {Parser} from './classes/expressionParser.js';

document.getElementById('inputExpressionButton').addEventListener('click', ()=>{
    let expression = document.getElementById('inputExpression').value
    console.log(expression)
    try {
        let parser = new Parser(expression);
        parser.constructAST()
        let parserHTML = parser.tree.getHTML(0);
        document.getElementById('treeContainer').innerHTML = parserHTML;
    } catch (err) {
        document.getElementById("treeContainer").innerHTML = err.message;
    }
})