import {Parser} from './classes/expressionParser.js';

document.getElementById('inputExpressionButton').addEventListener('click', ()=>{
    let expression = document.getElementById('inputExpression').value
    console.log(expression)
    let parser = new Parser(expression);
    let resultHTML;
    try {
        parser.constructAST()
        resultHTML = parser.tree.getHTML(0, '  ');
    } catch (err) {
        resultHTML = err.message;
    } finally {
        document.getElementById('treeContainer').innerHTML = resultHTML;
    }
})