/**
 * @file BayeuxRunner.js
 * @description The Runner for the Bayeux test framework.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

const child = require("child_process");
const path = require("path");
const tinter = require("tinter");

class BayeuxRunner {
    constructor() {

    }

    _reportJSON(unitReport) {

        console.log("");
        console.log(`Unit Report`);

        let reports = unitReport.tests;

        let testsTotal = 0;
        let testsFailed = 0;
        let testsPassed = 0;

        for(let testIdx = 0; testIdx < reports.length; testIdx++) {
            // Extract each report.
            let report = reports[testIdx];
            testsTotal += report.cases.length;

            console.log("");
            console.log(`  Test: ${report.name} (${report.cases.length} tests).`);
            for(let i = 0; i < report.cases.length; i++) {
                let result = report.cases[i];

                let name = result.message;
                let filename = result.file;
                let line = result.line;
                let column = result.column;

                if(result.ok === true) {
                    // e.g. {"id":0,"ok":true,"name":"it should have assigned the right height.","operator":"equal","objectPrintDepth":5,"actual":210,"expected":210,"test":0,"type":"assert"}
                    testsPassed++;
                    console.log(`    ${tinter.green("✓")} ${name}`);
                } else {
                    // e.g. {"id":2,"ok":false,"name":"it should have assigned the right area.","operator":"equal","objectPrintDepth":5,"actual":44100,"expected":441100,"error":{},"functionName":"Test.<anonymous>","file":"/Users/kasargeant/dev/projects/warhorse/test/data/client_test/js/tape.js:17:8","line":17,"column":"8","at":"Test.<anonymous> (/Users/kasargeant/dev/projects/warhorse/test/data/client_test/js/tape.js:17:8)","test":0,"type":"assert"}
                    testsFailed++;
                    console.log(`    ${tinter.red("✕")} FAILED: ${name}`);
                    console.log(`        Testing: '${result.operator}'`);
                    console.log(`        at line: ${line} col: ${column} in '${filename}'.`);
                    console.log(`        - expected: '${result.expected}'`);
                    console.log(`        - actual  : '${result.actual}'`);
                    console.log("");
                }
            }
        }
        console.log("");
        console.log(`Summary:`);
        console.log(`   \x1b[32mTests passed: (${testsPassed}/${testsTotal})\x1b[0m`);
        if(testsFailed) {
            console.log(`   \x1b[31mTests failed: (${testsFailed}/${testsTotal})\x1b[0m`);
        }
        console.log("");
    }


    runTest(pathname) {

        // Execute test file and capture output
        let cmdLine = `node ${pathname}`;
        let stdout = "{}";
        try {
            stdout = child.execSync(cmdLine);
        } catch(ex) {
            stdout = ex.stdout;
        }

        this._reportJSON(JSON.parse(stdout));
    }

}

// Exports
module.exports = BayeuxRunner;

let bay = new BayeuxRunner();
bay.runTest("/Users/kasargeant/dev/projects/bayeux/test/js/samples/Tinter16.test.js");
// bay.runTest("/Users/kasargeant/dev/projects/bayeux/test/js/samples/bayeuxSnapshots.test.js");
