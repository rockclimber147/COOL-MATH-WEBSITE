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
        document.getElementById('treeContainer').innerHTML = `<div id="main_table" class="table_container">${resultHTML}</div>`;
        document.getElementById('treePartsContainer').innerHTML = '';
        for (let i = 0; i < parser.nodeArray.length; i++){
            let subnodeTitle = `<p>${parser.nodeArray[i].getExpressionString()}</p>\n`
            let subNodeHTML = `<div id="sub_table${i}" class="table_container">${parser.nodeArray[i].getHTML(0, '  ')}</div>`;
            document.getElementById('treePartsContainer').innerHTML += subnodeTitle + subNodeHTML;
            console.log(`HTML for subNode ${i}:\n${subNodeHTML}`);
        }
    }
})