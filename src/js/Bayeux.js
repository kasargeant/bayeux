/**
 * @file Bayeux.js
 * @description The Bayeux test framework.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

// Imports
const assert = require("assert");
const series = require("async-series");

class Bayeux {
    constructor() {
        this.testReports = [];
        this.reports = [];
        this.fnArray = [];
    }

    _displayJSON(unitReport) {

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
                    console.log(`    \x1b[32m✓\x1b[0m ${name}`);
                } else {
                    // e.g. {"id":2,"ok":false,"name":"it should have assigned the right area.","operator":"equal","objectPrintDepth":5,"actual":44100,"expected":441100,"error":{},"functionName":"Test.<anonymous>","file":"/Users/kasargeant/dev/projects/warhorse/test/data/client_test/js/tape.js:17:8","line":17,"column":"8","at":"Test.<anonymous> (/Users/kasargeant/dev/projects/warhorse/test/data/client_test/js/tape.js:17:8)","test":0,"type":"assert"}
                    testsFailed++;
                    console.log(`    \x1b[31m✕\x1b[0m FAILED: ${name}`);
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

    report() {
        // Clean-up sequential report into a useful object.
        let unitReport = {
            tests: []
        };
        let testReport = null;
        for(let i = 0; i < this.reports.length; i++) {
            let report = this.reports[i];
            switch(report.type) {
                case "unit":
                    unitReport.name = report.message;
                    break;
                case "test":
                    if(testReport !== null) {
                        unitReport.tests.push(testReport);
                    }
                    testReport = {
                        name: report.message,
                        cases: []
                    };
                    break;
                case "case":
                    testReport.cases.push(report);
                    break;
                default:
                    throw new Error("Unrecognisable test output.");
            }
        }


        //console.log(JSON.stringify(this.reports, null, 2));
        console.log(JSON.stringify(unitReport, null, 2));
        this._displayJSON(unitReport);
        return this.reports;
    }

    _report(desc, fn) {
        try {
            console.log(desc + ": starting...");
            fn();
            this.reports.push({
                type: "case",
                ok: true,
                title: desc,
                message: desc
            });
        } catch(err) {
            let errorReport = {
                type: "case",
                ok: false,
                title: desc,
                name: err.name,
                message: err.message,
                generatedMessage: err.generatedMessage,
                code: err.code,
                actual: err.actual,
                expected: err.expected,
                operator: err.operator,
                stack: err.stack
            };
            // console.log(desc + ": " + JSON.stringify(errorReport, null, 2));
            this.reports.push(errorReport);
        }
    }

    // is.equal(square.height, 2110, "it should have assigned the right height.");
    equal(a, b, msg) {
        this._report(msg, function() {
            assert.equal(a, b);
        });
    }

    // is.equal(square.height, 2110, "it should have assigned the right height.");
    notEqual(a, b, msg) {
        this._report(msg, function() {
            assert.notEqual(a, b);
        });
    }

    // is.equal(square.height, 2110, "it should have assigned the right height.");
    ifError(a, b, msg) {
        this._report(msg, function() {
            assert.ifError(a, b);
        });
    }


    // is.equal(square.height, 2110, "it should have assigned the right height.");
    _executeTests() {

        series(this.fnArray, function() {
            this.fnArray = [];
            console.log("SUPERDONE!");
            this.report(); // Indicate the test has finished
        }.bind(this));

    }

    // is.equal(square.height, 2110, "it should have assigned the right height.");
    test(message, fn) {
        this.fnArray.push(function(done) {
            this.reports.push({type: "test", message: message});
            fn(done);
        }.bind(this));
    }

    unit(message, fn) {
        this.reports = [{type: "unit", message: message}];
        fn();
        this._executeTests();
    }
}


// Exports
module.exports = Bayeux;