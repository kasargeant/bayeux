/**
 * @file BayeuxRunner.js
 * @description The Runner for the Bayeux test framework.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

const child = require("child_process");
const path = require("path");

class Bayeux {
    constructor() {

    }

    _reportJSON(unitReport) {

        let reports = unitReport.tests;

        let testsTotal = 0;
        let testsFailed = 0;
        let testsPassed = 0;

        for(let testIdx = 0; testIdx < reports.length; testIdx++) {
            // Extract each report.
            let report = reports[testIdx];
            testsTotal += report.cases.length;

            console.log("");
            console.log(`  Test Report: ${report.name} (${report.cases.length} tests).`);
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
        console.log(`Test Report Summary:`);
        console.log(`   \x1b[32mTests passed: (${testsPassed}/${testsTotal})\x1b[0m`);
        if(testsFailed) {
            console.log(`   \x1b[31mTests failed: (${testsFailed}/${testsTotal})\x1b[0m`);
        }
        console.log("");
    }

    _reportTape(reports) {
        let testsTotal = 0;
        let testsFailed = 0;
        let testsPassed = 0;

        for(let testIdx = 0; testIdx < reports.length; testIdx++) {
            // Extract each report.
            let report = reports[testIdx];
            testsTotal += report.tests.length;

            console.log("");
            console.log(`  Test Report: ${report.name} (${report.tests.length} tests).`);
            for(let i = 0; i < report.tests.length; i++) {
                let result = report.tests[i];

                let filename = result.file;
                let line = result.line;
                let column = result.column;

                if(result.ok === true) {
                    // e.g. {"id":0,"ok":true,"name":"it should have assigned the right height.","operator":"equal","objectPrintDepth":5,"actual":210,"expected":210,"test":0,"type":"assert"}
                    testsPassed++;
                    console.log(`    \x1b[32m✓\x1b[0m ${result.name}`);
                } else {
                    // e.g. {"id":2,"ok":false,"name":"it should have assigned the right area.","operator":"equal","objectPrintDepth":5,"actual":44100,"expected":441100,"error":{},"functionName":"Test.<anonymous>","file":"/Users/kasargeant/dev/projects/warhorse/test/data/client_test/js/tape.js:17:8","line":17,"column":"8","at":"Test.<anonymous> (/Users/kasargeant/dev/projects/warhorse/test/data/client_test/js/tape.js:17:8)","test":0,"type":"assert"}
                    testsFailed++;
                    console.log(`    \x1b[31m✕\x1b[0m FAILED: ${result.name}`);
                    console.log(`        Testing: '${result.operator}'`);
                    console.log(`        at line: ${line} col: ${column} in '${filename}'.`);
                    console.log(`        - expected: '${result.expected}'`);
                    console.log(`        - actual  : '${result.actual}'`);
                    console.log("");
                }
            }
        }
        console.log(`Test Report Summary:`);
        console.log(`   \x1b[32mTests passed: (${testsPassed}/${testsTotal})\x1b[0m`);
        if(testsFailed) {
            console.log(`   \x1b[31mTests failed: (${testsFailed}/${testsTotal})\x1b[0m`);
        }
        console.log("");
    }

    _parseFail(lines, i) {
        let line = lines[i];
        line = line.slice(7);

        let idxEndPtr = line.indexOf(" ");
        let idxStr = line.slice(0, idxEndPtr);
        let id = parseInt(idxStr);
        let name = line.slice(idxEndPtr + 1);

        i++;
        line = lines[++i];
        let operator = line.slice(14);
        line = lines[++i];
        let expected = line.slice(14);
        line = lines[++i];
        let actual = line.slice(14);

        line = lines[++i];
        let at = line.slice(7);
        let idxFnEnd = at.indexOf("/");
        let fn = at.slice(0, idxFnEnd - 2);
        at = at.slice(idxFnEnd - 2);
        let idxFileEnd = at.indexOf(":");

        let file = at.slice(idxFnEnd, idxFileEnd);
        let location = at.slice(idxFileEnd + 1, at.length - 1);
        let [lineNo, colNo] = location.split(":");
        lineNo = parseInt(lineNo);
        colNo = parseInt(colNo);
        return {
            id: id,
            name: name,
            ok: false,
            operator: operator,
            expected: expected,
            actual: actual,
            fn: fn,
            file: file,
            line: lineNo,
            column: colNo
        };
    }

    _parsePass(line) {
        line = line.slice(3);

        let idxEndPtr = line.indexOf(" ");
        let idxStr = line.slice(0, idxEndPtr);
        line = line.slice(idxEndPtr + 1);

        return {
            id: parseInt(idxStr),
            name: line,
            ok: true
        };
    }

    runTests(file) {
        // Determine test file
        // let file = "tapeSimple.js";
        file = path.resolve(file);
        console.log("FILE: " + file);

        // Execute test file and capture output
        let cmdLine = `node ${file}`;
        let stdout = "{}";
        try {
            stdout = child.execSync(cmdLine);
        } catch(ex) {
            stdout = ex.stdout;
        }

        console.log("REPORTS - TAP");
        console.log(stdout.toString());


        // Split output into lines
        let reportLines = stdout.toString().split("\n");
        console.log(`Report has ${reportLines.length} lines.`);

        function emptyReport() {
            return {
                name: "",
                tests: []
            };
        }

        let reports = [];
        let report = emptyReport();
        let record = {};
        let i = 0;
        while(i < reportLines.length) {
            let reportLine = reportLines[i];
            if(reportLine !== "") {
                switch(reportLine[0]) {
                    case "T":
                        if(reportLine !== "TAP version 13") {
                            throw new Error(`This is not a TAP test file.`);
                        }
                        break;
                    case "#":
                        if(reports.length === 0 && report.name !== "") {

                        } else {
                            reports.push(report);
                            report = emptyReport();
                        }
                        console.log(`${i}: name: ${reportLine.slice(2)}`);
                        console.log(`LENGTH REPORTS: ${reports.length}`);
                        report.name = reportLine.slice(2);
                        break;
                    case "n":
                        //console.log(`${i}: fail: ${reportLine.slice(7)}`);
                        record = this._parseFail(reportLines, i);
                        report.tests.push(record);
                        i += 6; // step over fail report
                        break;
                    case "o":
                        //console.log(`${i}: pass: ${reportLine.slice(3)}`);
                        record = this._parsePass(reportLine);
                        report.tests.push(record);
                        record = {};
                        break;
                    case "1":
                        //console.log(`${i}: No. tests: ${reportLine.slice(3)}`);
                        // report.total = parseInt(reportLine.slice(3));

                        break;
                    default:
                        console.warn(`Warning didn't find a match for '${reportLine[0]}'`);
                        console.log(`${i}: !!!: ${reportLine}`);

                }
            }
            i++;
        }

        this._reportTape(reports);

        // DEBUG ONLY - outputs full JSON report to screen.
        console.log("REPORTS - JSON");
        console.log(JSON.stringify(reports, null, 2));
    }


}

// Exports
module.exports = Bayeux;

