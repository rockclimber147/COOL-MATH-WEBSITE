import {Parser} from './classes/expressionParser.js';

document.getElementById('inputExpressionButton').addEventListener('click', ()=>{
    let expression = document.getElementById('inputExpression').value
    console.log(expression)
    let parser = new Parser(expression);
    let resultHTML;
    try {
        parser.constructAST()
        resultHTML = parser.tree.getHTML(0, '  ', 'MainRoot');
    } catch (err) {
        resultHTML = err.message;
    } finally {
        addSVG(parser.tree, 'treeContainer', 'Main')

        // document.getElementById('treePartsContainer').innerHTML = '';
        // for (let i = 0; i < parser.nodeArray.length; i++){
        //     let subnodeTitle = `<p>${parser.nodeArray[i].getExpressionString()}</p>\n`
        //     let subNodeHTML = `<div id="sub_table${i}" class="table_container">${parser.nodeArray[i].getHTML(0, '  ', `subRoot${i}`)}</div>`;
        //     document.getElementById('treePartsContainer').innerHTML += subnodeTitle + subNodeHTML;

        // }
    }
})

function addSVG(tree, containerId, tableId){
    // Construct table
    let treeContainer = document.getElementById(containerId)
    treeContainer.innerHTML = tree.getHTML(0, ' ', tableId)
    console.log(treeContainer.innerHTML)

    let tableBounds = treeContainer.firstChild.getBoundingClientRect()
    console.log(tableBounds)
    let lineCoordinatePairs = []

    addCoordinatePairs(tableId, lineCoordinatePairs)
    formatCoordinatePairs(tableBounds, lineCoordinatePairs)
    console.log(lineCoordinatePairs)

    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute('width', tableBounds.width)
    svg.setAttribute('height', tableBounds.height)
    svg.innerHTML = getSVGLines(lineCoordinatePairs)
    svg.style.backgroundColor = 'green'
    treeContainer.appendChild(svg)
}

function addCoordinatePairs(nodeId, lineCoordinatePairs){
    let currentNode = document.getElementById(nodeId)
    let currentNodecenter = getCenterOfNode(nodeId)

    switch (currentNode.className){
        case 'unary_operator': {
            let childID = nodeId + 'D'
            let childNodeCenter = getCenterOfNode(childID)
            lineCoordinatePairs.push([currentNodecenter, childNodeCenter])
            addCoordinatePairs(childID, lineCoordinatePairs)
            console.log(childID)
            break;
        } case 'binary_operator': {
            let leftChildID = nodeId + 'L'
            let leftChildNodeCenter = getCenterOfNode(leftChildID)
            lineCoordinatePairs.push([currentNodecenter, leftChildNodeCenter])
            addCoordinatePairs(leftChildID, lineCoordinatePairs)

            let rightChildID = nodeId + 'R'
            let rightChildNodeCenter = getCenterOfNode(rightChildID)
            lineCoordinatePairs.push([currentNodecenter, rightChildNodeCenter])
            addCoordinatePairs(rightChildID, lineCoordinatePairs)
            break;
        }
    }
}

function getCenterOfNode(nodeId){
    console.log('getting center of id: ' + nodeId)
    let bounds = document.getElementById(nodeId).getBoundingClientRect()
    console.log(bounds)
    return [bounds.x + bounds.width / 2, bounds.y + bounds.y / 2]
}

function formatCoordinatePairs(tableBounds, pairsArray){
    let tableOffsets = [tableBounds.x, tableBounds.y]

    for (let i = 0; i < pairsArray.length; i++){
        for (let j = 0; j < pairsArray[i].length; j++){
            for (let k = 0; k < pairsArray[i][j].length; k++){
                pairsArray[i][j][k] -= tableOffsets[k]
            }
        }
    }

}

function getSVGLines(lineCoordinatePairs){
    let svgText = ""
    for (let i = 0; i < lineCoordinatePairs.length; i++){
        svgText += `<line x1="${lineCoordinatePairs[i][0][0]}" y1="${lineCoordinatePairs[i][0][1]}" x2="${lineCoordinatePairs[i][1][0]}" y2="${lineCoordinatePairs[i][1][1]}" stroke="black" />`
    }
    return svgText
}