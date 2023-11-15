import {Parser} from './classes/expressionParser.js';

document.getElementById('inputExpressionButton').addEventListener('click', ()=>{
    let expression = document.getElementById('inputExpression').value
    console.log(expression)
    try {
        let parserHTML = new Parser(expression).parseExpression(0).getHTML(0);
        document.getElementById('treeContainer').innerHTML = parserHTML;
    } catch (err) {
        document.getElementById("treeContainer").innerHTML = err.message;
    }
})