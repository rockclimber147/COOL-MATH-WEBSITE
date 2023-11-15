import {Parser} from 'scripts/classes/expressionParser.js';

console.log(new Parser('1+1').parseExpression(0).getHTML(0));