/**
 * @file BayeuxRunner.js
 * @description The Runner for the Bayeux test framework.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

// Imports
const child = require("child_process");
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const tinter = require("tinter");
const reflector = require("./Reflector");

// Component
class BayeuxRunner {
    constructor() {
    }

    _reportJSON(unitReport, reportType="unit") {

        let reportTitle, testTitle;
        switch(reportType) {
            case "spec":
                reportTitle = "Specification Test Report";
                testTitle = "Requirement";
                break;
            default:
                // i.e. "unit" case
                reportTitle = "Unit Test Report";
                testTitle = "Test";
        }

        console.log("");
        console.log(`${reportTitle.toUpperCase()}: ${unitReport.name}`);

        let reports = unitReport.tests;

        let testsTotal = 0;
        let testsFailed = 0;
        let testsPassed = 0;

        for(let testIdx = 0; testIdx < reports.length; testIdx++) {
            // Extract each report.
            let report = reports[testIdx];
            testsTotal += report.cases.length;

            console.log("");
            console.log(`  ${testTitle}: ${report.name} (${report.cases.length} tests).`);
            for(let i = 0; i < report.cases.length; i++) {
                let result = report.cases[i];

                let name = result.description;
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
            throw new Error();
        }
        console.log("");
    }


    _resolvePaths(args) {
        // Resolve test file path(s)
        let paths;
        if(args._ !== undefined && args._.constructor === Array) {
            //console.log(`Using path array: ${JSON.stringify(args._)}`);   // DEBUG ONLY
            paths = args._;
        } else {
            //console.log(`Using path glob: ${args._[0]}`);                 // DEBUG ONLY
            paths = glob.sync(args._[0]);
        }
        //console.log(`  have paths: ${JSON.stringify(paths)}`);            // DEBUG ONLY
        return paths;
    }

    _generateTest(moduleDirectory, workingDirectory, fileName) {
        let unit = require(fileName);
        return reflector(unit);
    }

    generateTests(moduleDirectory, workingDirectory, args) {
        console.log(`Given args: ${JSON.stringify(args)}`);

        // Resolve test file path(s)
        let paths = this._resolvePaths(args);

        // Generate test unit
        let count = 0;
        for(let filePath of paths) {
            console.log(`Generating unit: ${filePath}`);
            let unitTestScript = this._generateTest(moduleDirectory, workingDirectory, filePath);
            let unitTestScriptPath = path.join(workingDirectory, filePath) + ".test.js";
            fs.writeFileSync(unitTestScriptPath, unitTestScript);
            count++;
        }
        console.log(`Generated ${count} files.`);
    }
    _runTest(moduleDirectory, workingDirectory, fileName) {

        // Switch to directory that contains the test.
        let absolutePath = path.resolve(fileName);
        let newWorkingDirectory = path.dirname(absolutePath);
        console.log("Switching directory from: " + process.cwd());
        try {
            process.chdir(newWorkingDirectory);
            console.log("to new directory: " + process.cwd());
        }
        catch(err) {
            throw err;
        }
        fileName = path.basename(absolutePath);

        let fileExtIdx = fileName.indexOf(".");
        let fileExt = (fileExtIdx !== -1) ? fileName.slice(fileExtIdx) : null;
        //console.log("EXT: " + fileExt);
        let reportType = (fileExt === ".spec.js") ? "spec" : "unit";

        // Execute test file and capture output
        let cmdLine = `node ${fileName}`;
        let stdout = "{}";
        try {
            stdout = child.execSync(cmdLine);
        } catch(ex) {
            stdout = ex.stdout;
        }

        this._reportJSON(JSON.parse(stdout), reportType);
    }

    runTests(moduleDirectory, workingDirectory, args) {
        //console.log(`Given args: ${JSON.stringify(args)}`);   // DEBUG ONLY

        // Resolve test file path(s)
        let paths = this._resolvePaths(args);

        // Execute test units
        let count = 0;
        for(let filePath of paths) {
            console.log(`Testing unit: ${filePath}`);
            this._runTest(moduleDirectory, workingDirectory, filePath);
            count++;
        }
        console.log(`Tested ${count} files.`);
    }

}

// Exports
module.exports = BayeuxRunner;

// let bay = new BayeuxRunner();
// bay.runTests("/Users/kasargeant/dev/projects/bayeux/test/js/samples/*.test.js");
// bay._runTest("/Users/kasargeant/dev/projects/bayeux/test/js/samples/Tinter16.test.js");
// bay._runTest("/Users/kasargeant/dev/projects/bayeux/test/js/samples/bayeuxSnapshots.test.js");
