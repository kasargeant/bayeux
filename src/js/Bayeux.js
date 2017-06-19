/**
 * @file Bayeux.js
 * @description The Bayeux test framework.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const child = require("child_process");
const fs = require("fs");
const path = require("path");
const assert = require("assert");
const series = require("async-series");

// Component

/**
 * @class
 * @static
 * @type {{debug: boolean, reports: Array, fnArray: Array, snapshots: {}, snapshotsUpdated: boolean, _reportCase: Bayeux._reportCase, _cleanup: Bayeux._cleanup, _collate: Bayeux._collate, _executeTests: Bayeux._executeTests, test: Bayeux.test, unit: Bayeux.unit, $$$$$$$$$$$$$$$$$$$$$debugDividerOnly: Bayeux.$$$$$$$$$$$$$$$$$$$$$debugDividerOnly, equal: Bayeux.equal, deepEqual: Bayeux.deepEqual, notEqual: Bayeux.notEqual, notDeepEqual: Bayeux.notDeepEqual, error: Bayeux.error, thrown: Bayeux.thrown, notThrown: Bayeux.notThrown, fail: Bayeux.fail, pass: Bayeux.pass, truthy: Bayeux.truthy, snapshot: Bayeux.snapshot}}
 */
const Bayeux = {

    // Minimal state - TODO - Ideally remove all state.
    debug: false,
    snapshots: {},
    snapshotsUpdated: false,
    snapshotDirectory: "./__snapshots__/",

    // Used undercover by assertions.
    _reportCase: function(desc, fn) {
        try {
            //console.log(desc + ": starting...");
            let actual = fn();
            this.report({
                type: "case",
                ok: true,
                unit: desc,
                message: desc,
                actual: actual
            });
        } catch(err) {
            this.report({
                type: "case",
                ok: false,
                unit: desc,
                name: err.name,
                message: err.message,
                generatedMessage: err.generatedMessage,
                code: err.code,
                actual: err.actual,
                expected: err.expected,
                operator: err.operator,
                stack: err.stack
            });
        }
    },

    _collate: function(reports) {

        if(this.debug === true) {
            for(let i = 0; i < reports.length; i++) {
                console.log(`${i}: ${JSON.stringify(reports[i])}`);
            }
        }

        // Clean-up sequential report into a useful object.
        let unitReport = {
            tests: []
        };
        let unitReportCount = 0;
        let testReport = null;
        let testReportCount = 0;
        for(let i = 0; i < reports.length; i++) {
            let report = reports[i];
            switch(report.type) {
                case "unit":
                    unitReport.name = report.message;
                    unitReportCount++;
                    break;
                case "test":
                    if(testReportCount > 0) {
                        unitReport.tests.push(testReport);
                    }
                    testReport = {
                        name: report.message,
                        parent: unitReport.name,
                        cases: []
                    };
                    testReportCount++;
                    break;
                case "case":
                    report.parent = testReport.name;
                    testReport.cases.push(report);
                    break;
                default:
                    throw new Error("Unrecognisable test output.");
            }
        }
        if(testReport !== null) {
            unitReport.tests.push(testReport);
        }


        // Return the collated report
        return unitReport; // For diagnostics only.
    },

    // is.equal(square.height, 2110, "it should have assigned the right height.");
    test: null,

    _onCompletion: function(unitReport, destination="stdout", format="json") {
        // On completion...
        // Collate results

        // Output results
        let unitReportSerialized = "";
        if(format === "json") {
            unitReportSerialized = JSON.stringify(unitReport, null, 2);
        }

        if(destination === "stdout") {
            console.log(unitReportSerialized);
        } else if(destination === "file") {
            let filename = unitReport.name.replace(/ /g, "_") + ".out.json";
            fs.writeFileSync(filename, unitReportSerialized);
        } else if(destination === "return") {
            return unitReportSerialized;
        }
    },

    report: null,
    _getReports: null, // DEBUG ONLY
    _clearReports: null, // DEBUG ONLY

    unit: function(message, fn) {
        // If we have snapshots - load them.
        if(this.debug) {console.log("CWD: " + process.cwd());}

        let snapshotPath = path.resolve(process.cwd(), this.snapshotDirectory);

        if(fs.existsSync(snapshotPath)) {
            let snapshotFilename = message.replace(/ /g, "_") + ".snap.js";
            //console.log("SNAPSHOT: " + snapshotFilename);
            this.snapshots = null;
            try {
                // this.snapshots = require(`${process.cwd()}/__snapshots__/${snapshotFilename}`);
                this.snapshots = require(path.resolve(snapshotPath, snapshotFilename));
            } catch(err) {
                if(this.debug) {console.warn("No snapshots for this unit.");}
                this.snapshots = {};
            }
        } else {
            if(this.debug) {console.warn("No snapshots directory.");}
        }

        let reports = [];
        this.report = function(msgObj) {
            reports.push(msgObj);
        };

        // DEBUG ONLY
        this._clearReports = function() {
            reports = [];
        };
        this._getReports = function() {
            return reports;
        };

        let fnArray = [];
        this.test = function(message, fn) {
            fnArray.push(function(done) {
                this.report({type: "test", message: message});
                fn(done);
            }.bind(this));
        };

        // Core of unit
        this.report({type: "unit", message: message});
        fn();
        series(fnArray, function(err) {

            // If error - just throw it!
            if(err) {
                throw err;
            } else {
                // At this point the entire unit test is finished.
                // console.log(JSON.stringify(reports));
                let unitReport = this._collate(reports);
                this._onCompletion(unitReport);
            }

        }.bind(this));

        // If we have updated snapshots - save them.
        if(this.snapshotsUpdated === true) {
            //console.log("HAVE SNAPSHOTS TO UPDATE!");
            // If there is no snapshots directory - make one.
            let snapshotPath = path.resolve(process.cwd(), this.snapshotDirectory);
            if(!fs.existsSync(snapshotPath)) {
                fs.mkdirSync(snapshotPath);
            }

            let snapshotsString = "";
            for(let key in this.snapshots) {
                if(!this.snapshots.hasOwnProperty(key)) {
                    // ...then ignore.
                    continue;
                }
                // ...otherwise write to file.
                // console.log("KEY: " + key);
                let value = this.snapshots[key];
                snapshotsString += `exports[\`${key}\`] = \`${value}\`;\n\n`;
            }

            let snapshotFilename = message.replace(/ /g, "_") + ".snap.js";
            try {
                fs.writeFileSync(`./__snapshots__/${snapshotFilename}`, snapshotsString);
            } catch(err) {
                throw new Error("Couldn't write snapshot for this unit.");
            }
        }
    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    $$$$$$$$$$$$$$$$$$$$$debugDividerOnly: function() {}, // TODO - remove key for production version.
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * Tests whether the two parameters are equal (using default of strict equality).
     * @example is.equal(square.height, 2110, "it should have assigned the right height.");
     * @param {*} actual - the actual value
     * @param {*} expected - the expected value
     * @param {string} msg - a test description or message. NOTE: REQUIRED!
     * @param {boolean} isStrict - If true, test uses strict comparison.
     */
    equal: function(actual, expected, msg, isStrict=true) {
        this._reportCase(msg, function() {
            if(isStrict === true) {
                assert.strictEqual(actual, expected);
            } else {
                assert.equal(actual, expected);
            }
            return actual;
        });
    },

    /**
     * Tests whether the two parameters are deep equal (using default of strict equality).
     * @example is.deepEqual(someComplexObj, someOtherComplexObj, "it should be able to clone correctly.");
     * @param {*} actual - the actual value
     * @param {*} expected - the expected value
     * @param {string} msg - a test description or message. NOTE: REQUIRED!
     * @param {boolean} isStrict - If true, test uses strict comparison.
     */
    deepEqual: function(actual, expected, msg, isStrict=true) {
        this._reportCase(msg, function() {
            if(isStrict === true) {
                assert.deepStrictEqual(actual, expected);
            } else {
                assert.deepEqual(actual, expected);
            }
            return actual;
        });
    },
    
    /**
     * Tests whether the two parameters are not equal (using default of strict equality).
     * @example is.notEqual(square.height, 2110, "it shouldn't have been assigned the height pre-initialisation.");
     * @param {*} actual - the actual value
     * @param {*} expected - the expected value
     * @param {string} msg - a test description or message. NOTE: REQUIRED!
     * @param {boolean} isStrict - If true, test uses strict comparison.
     */
    notEqual: function(actual, expected, msg, isStrict=true) {
        this._reportCase(msg, function() {
            if(isStrict === true) {
                assert.notStrictEqual(actual, expected);
            } else {
                assert.notEqual(actual, expected);
            }
            return actual;
        });
    },

    /**
     * Tests whether the two parameters are not deep equal (using default of strict equality).
     * @example is.notDeepEqual(someComplexObj, someOtherComplexObj, "it should be unique.");
     * @param {*} actual - the actual value
     * @param {*} expected - the expected value
     * @param {string} msg - a test description or message. NOTE: REQUIRED!
     * @param {boolean} isStrict - If true, test uses strict comparison.
     */
    notDeepEqual: function(actual, expected, msg, isStrict=true) {
        this._reportCase(msg, function() {
            if(isStrict === true) {
                assert.notDeepStrictEqual(actual, expected);
            } else {
                assert.notDeepEqual(actual, expected);
            }
            return actual;
        });
    },

    /**
     *
     *
     * @param {*} actual - the actual value
     * @param {*} expected - the expected value
     * @param {string} msg - a test description or message. NOTE: REQUIRED!
     */
    error: function(actual, expected, msg) {
        this._reportCase(msg, function() {
            assert.ifError(actual, expected);
            return actual;
        });
    },

    /**
     * Tests whether an error was thrown.
     * @example is.thrown(someFunc(123), "it should throw an error/exception.");
     * @param {*} block - the code block
     * @param {string} msg - a test description or message. NOTE: REQUIRED!
     */
    thrown: function(block, msg) {
        this._reportCase(msg, function() {
            assert.throws(block);
        });
    },

    /**
     * Tests whether an error was not thrown.
     * @example is.notThrown(someFunc(123), "it should not throw an error/exception.");
     * @param {*} block - the code block
     * @param {string} msg - a test description or message. NOTE: REQUIRED!
     */
    notThrown: function(block, msg) {
        this._reportCase(msg, function() {
            assert.doesNotThrow(block);
        });
    },

    /**
     * Asserts an automatic test 'fail'.
     * @example is.fail("it should meet the criteria.");
     * @param {string} msg - a test description or message. NOTE: REQUIRED!
     */
    fail: function(msg) {
        // TODO - implement direct reporting i.e. override test reporting
    },

    /**
     * Asserts an automatic test 'pass'.
     * @example is.pass("it should meet the criteria.");
     * @param {string} msg - a test description or message. NOTE: REQUIRED!
     */
    pass: function(msg) {
        // TODO - implement direct reporting i.e. override test reporting
    },

    /**
     * Tests whether the single given parameter is 'truthy' (i.e. allowing coercion etc.)
     * @example is.truthy(someValue, "it should be complete.");
     * @param {*} actual - the actual value
     * @param {string} msg - a test description or message. NOTE: REQUIRED!
     */
    truthy: function(actual, msg) {
        this._reportCase(msg, function() {
            assert.ok(actual);
            return actual;
        });
    },

    snapshot: function(actual, msg) {

        let key = msg;
        let snapshot = this.snapshots[key];
        //console.log("HAVE SNAPSHOT ALREADY = " + JSON.stringify(snapshot));

        let type = typeof(actual);
        let value = "";
        switch(type) {
            default:
                value = JSON.stringify(actual);
        }

        if(snapshot !== undefined) {
            // We have an existing snapshot - to test against.
            this.equal(value, snapshot, msg); // Note this implicitly will use this._reportCase()
        } else {
            // We need to make a new snapshot.
            this.snapshots[key] = value;
            this.snapshotsUpdated = true;
            this.report({
                type: "case",
                ok: true,
                unit: msg,
                message: "[CREATING NEW SNAPSHOT]"
            });
        }
    },

    // expect: function(actual, msg) {
    //     return {
    //         toEqual: function(expected, msg, isStrict) {Bayeux.equal(actual, expected, msg, isStrict);},
    //         toNotEqual: function(expected, msg, isStrict) {Bayeux.notEqual(actual, expected, msg, isStrict);},
    //         toDeepEqual: function(expected, msg, isStrict) {Bayeux.deepEqual(actual, expected, msg, isStrict);},
    //         toNotDeepEqual: function(expected, msg, isStrict) {Bayeux.notDeepEqual(actual, expected, msg, isStrict);},
    //         toThrow: function(block, msg) {Bayeux.thrown(block, msg);},
    //         toNotThrow: function(block, msg) {Bayeux.notThrown(block, msg);},
    //         toNotBeError: function(expected, msg) {Bayeux.error(actual, expected, msg);},
    //         toEqualSnapshot: function() {Bayeux.snapshot(actual, msg);}
    //     };
    // },

    when: function(msg) {
        return {
            expect: function(actual) {
                return {
                    toEqual: function(expected, isStrict) {Bayeux.equal(actual, expected, msg, isStrict);},
                    toNotEqual: function(expected, isStrict) {Bayeux.notEqual(actual, expected, msg, isStrict);},
                    toDeepEqual: function(expected, isStrict) {Bayeux.deepEqual(actual, expected, msg, isStrict);},
                    toNotDeepEqual: function(expected, isStrict) {Bayeux.notDeepEqual(actual, expected, msg, isStrict);},
                    toThrow: function(block) {Bayeux.thrown(block, msg);},
                    toNotThrow: function(block) {Bayeux.notThrown(block, msg);},
                    toNotBeError: function(expected) {Bayeux.error(actual, expected, msg);},
                    toEqualSnapshot: function() {Bayeux.snapshot(actual, msg);}
                };
            },
            expectFile: function(filePath, fileType="string") {
                let actual = null;
                try {
                    actual = fs.readFileSync(filePath);
                } catch(err) {
                    throw err;
                }
                actual = (fileType === "string") ? actual.toString() : actual;
                return {
                    toEqual: function(expected, isStrict) {Bayeux.equal(actual, expected, msg, isStrict);},
                    toNotEqual: function(expected, isStrict) {Bayeux.notEqual(actual, expected, msg, isStrict);},
                    toDeepEqual: function(expected, isStrict) {Bayeux.deepEqual(actual, expected, msg, isStrict);},
                    toNotDeepEqual: function(expected, isStrict) {Bayeux.notDeepEqual(actual, expected, msg, isStrict);},
                    toThrow: function(block) {Bayeux.thrown(block, msg);},
                    toNotThrow: function(block) {Bayeux.notThrown(block, msg);},
                    toNotBeError: function(expected) {Bayeux.error(actual, expected, msg);},
                    toEqualSnapshot: function() {Bayeux.snapshot(actual, msg);}
                };
            },
            test: function(unitName, testName) {
                // let unitPath = path.resolve(unitName);
                // console.log("Cwd: " + process.cwd());
                // console.log("__dirname: " + __dirname);
                // console.log("__filename: " + __filename);
                // console.log("Resolving path to: " + unitPath);
                let cmdLine = `node ${unitName}`;
                let stdout = "{}";
                try {
                    stdout = child.execSync(cmdLine);
                } catch(ex) {
                    stdout = ex.stdout;
                }
                // At this point, stdout should contain an array of 0 or more test report objects.
                if(stdout !== null) {
                    let unitResult = JSON.parse(stdout.toString());
                    for(let i = 0; i < unitResult.tests.length; i++) {
                        let testResult = unitResult.tests[i];
                        if(testResult.name === testName) {
                            //console.log(JSON.stringify(testResult).toUpperCase());
                            this.report({
                                type: "case",
                                ok: true,
                                unit: unitName,
                                message: msg
                            });
                        }
                    }

                    // let testResult = unitResult[testName];


                }
            }.bind(this)
        };
    },
    // BDD Api
    BDD() {
        return {
            can: function(desc, fn) {Bayeux.test(desc, fn);},
            feature: function(desc, fn) {Bayeux.unit(desc, fn);},
            when: function(actual) {return Bayeux.when(actual);}
        };
    },

    // TDD Api
    TDD() {
        return {
            given: function(actual) {return Bayeux.when(actual);},
            test: function(desc, fn) {Bayeux.test(desc, fn);},
            unit: function(desc, fn) {Bayeux.unit(desc, fn);}
        };
    },

    // // Compatibility API (experimental)
    // Jasmine() {
    //     return {
    //         describe: function(desc, fn) {Bayeux.unit(desc, fn);},
    //         it: function(desc, fn) {Bayeux.test(desc, fn);},
    //         expect: function(actual) {return Bayeux.expect(actual);}
    //     };
    // }
};


// Exports
module.exports = Bayeux;
