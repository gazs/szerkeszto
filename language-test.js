//import PEG from 'pegjs';
const fs = require('fs');
const assert = require('assert');
const PEG = require('./node_modules/pegjs-loader/node_modules/pegjs/lib/peg');

const szerk_src = fs.readFileSync('./szerk2.pegjs').toString();
const szerk = PEG.buildParser(szerk_src);




function testMath (testString, expectedResult) {
	var result = szerk.parse(testString);
	try {
		assert(result[result.length-1].variable[1] === expectedResult)
		console.log('🌲 pass', testString, '==', expectedResult);
	} catch (e) {
		console.warn('😡 FAIL', testString, expectedResult, result[result.length-1].variable[1]);
	}
}

testMath('var a = 2 + 2', 4);
testMath('var b = 2; var a = b + 2', 4);
testMath('var b = 2; var a = 1 + b * 2', 5);
testMath('var b = 2; var a = (1 + b) * 2', 6);
testMath('var b = 2; var a = b / 2', 1);
testMath('var b = 5.5; var a = b * 2', 11);
testMath('var b = 11; var a = b / 2', 5.5);
testMath('var db = 44; var mb = 50; var a = db / 10 + ((mb / 10) * 0.5) - 5', 1.9000000000000004);

