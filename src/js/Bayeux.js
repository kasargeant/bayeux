/**
 * @file Bayeux.js
 * @description The Bayeux test framework.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const fs = require("fs");
const assert = require("assert");
const series = require("async-series");

// Component
const Bayeux = {

    debug: false,
    reports: [],
    fnArray: [],

    snapshots: {},
    snapshotsUpdated: false,


    _report: function(desc, fn) {
        if(fn === "snapshot") {
            this.reports.push({
                type: "case",
                ok: true,
                unit: desc,
                message: "[NEW SNAPSHOT] " +  desc
            });
        } else {
            try {
                //console.log(desc + ": starting...");
                fn();
                this.reports.push({
                    type: "case",
                    ok: true,
                    unit: desc,
                    message: desc
                });
            } catch(err) {
                let errorReport = {
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
                };
                // console.log(desc + ": " + JSON.stringify(errorReport, null, 2));
                this.reports.push(errorReport);
            }
        }
    },


    _cleanup: function() {
        this.reports = [];
        this.fnArray = [];
        this.snapshots = {};
        this.snapshotsUpdated = false;
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
        let testReport = {
            cases: []
        };
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
                        testReport = {
                            name: report.message,
                            parent: unitReport.name,
                            cases: []
                        };
                    }
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


        // Select test output format and destination
        let format = "json";
        let destination = "stdout";

        let unitReportSerialized = "";
        if(format === "json") {
            unitReportSerialized = JSON.stringify(unitReport, null, 2);
        }

        if(destination === "stdout") {
            console.log(unitReportSerialized);
        } else if(destination === "file") {
            let filename = unitReport.name.replace(/ /g, "_") + ".out.json";
            fs.writeFileSync(filename, unitReportSerialized);
        }
        return unitReport; // For diagnostics only.
    },

    // is.equal(square.height, 2110, "it should have assigned the right height.");
    _executeTests: function(completionCallback) {

        series(this.fnArray, function(err) {

            // If error - just throw it!
            if(err) {
                throw err;
            } else {
                completionCallback();
            }

        }.bind(this));

    },

    // is.equal(square.height, 2110, "it should have assigned the right height.");
    test: function(message, fn) {
        this.fnArray.push(function(done) {
            this.reports.push({type: "test", message: message});
            fn(done);
        }.bind(this));
    },

    unit: function(message, fn) {
        // If we have snapshots - load them.
        if(this.debug) {console.log("CWD: " + process.cwd());}
        if(fs.existsSync("./__snapshots__/")) {
            let snapshotFilename = message.replace(/ /g, "_") + ".snap.js";
            //console.log("SNAPSHOT: " + snapshotFilename);
            this.snapshots = null;
            try {
                this.snapshots = require(`${process.cwd()}/__snapshots__/${snapshotFilename}`);
            } catch(err) {
                if(this.debug) {console.warn("No snapshots for this unit.");}
                this.snapshots = {};
            }
        } else {
            if(this.debug) {console.warn("No snapshots directory.");}
        }

        // Core of unit
        this.reports = [{type: "unit", message: message}];
        fn();
        this._executeTests(function() {
            // On completion...
            // Collate results
            this._collate(this.reports); // At this point the entire test unit is finished.
            // Then cleanup all 'state'... ready for the next user;
            this._cleanup();
        }.bind(this));

        // If we have updated snapshots - save them.
        if(this.snapshotsUpdated === true) {
            // If there is no snapshots directory - make one.
            if(!fs.existsSync(`./__snapshots__/`)) {
                fs.mkdirSync(`./__snapshots__/`);
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
     * Tests whether the two parameters are not equal.
     * @example is.equal(square.height, 2110, "it should have assigned the right height.");
     * @param {*} actual - the actual value
     * @param {*} expected - the expected value
     * @param {string} msg - a test description or message. NOTE: REQUIRED!
     */
    equal: function(actual, expected, msg) {
        this._report(msg, function() {
            assert.equal(actual, expected);
        });
    },

    /**
     * Tests whether the two parameters are deep equal.
     * @example is.equalDeep(someComplexObj, someOtherComplexObj, "it should be able to clone correctly.");
     * @param {*} actual - the actual value
     * @param {*} expected - the expected value
     * @param {string} msg - a test description or message. NOTE: REQUIRED!
     */
    equalDeep: function(actual, expected, msg) {
        this._report(msg, function() {
            assert.deepEqual(actual, expected);
        });
    },

    /**
     * Tests whether the two parameters are deep equal (using strict equality).
     * @example is.equalDeepStrict(someComplexObj, someOtherComplexObj, "it should be able to clone correctly.");
     * @param {*} actual - the actual value
     * @param {*} expected - the expected value
     * @param {string} msg - a test description or message. NOTE: REQUIRED!
     */
    equalDeepStrict: function(actual, expected, msg) {
        this._report(msg, function() {
            assert.deepStrictEqual(actual, expected);
        });
    },

    /**
     * Tests whether the two parameters are equal (using strict equality).
     * @example is.equalStrict(someComplexObj, someOtherComplexObj, "it should be able to clone correctly.");
     * @param {*} actual - the actual value
     * @param {*} expected - the expected value
     * @param {string} msg - a test description or message. NOTE: REQUIRED!
     */
    equalStrict: function(actual, expected, msg) {
        this._report(msg, function() {
            assert.strictEqual(actual, expected);
        });
    },

    /**
     * Tests whether the two parameters are not equal.
     * @example is.notEqual(square.height, 2110, "it shouldn't have been assigned the height pre-initialisation.");
     * @param {*} actual - the actual value
     * @param {*} expected - the expected value
     * @param {string} msg - a test description or message. NOTE: REQUIRED!
     */
    notEqual: function(actual, expected, msg) {
        this._report(msg, function() {
            assert.notEqual(actual, expected);
        });
    },

    /**
     * Tests whether the two parameters are not deep equal.
     * @example is.notEqualDeep(someComplexObj, someOtherComplexObj, "it should be unique.");
     * @param {*} actual - the actual value
     * @param {*} expected - the expected value
     * @param {string} msg - a test description or message. NOTE: REQUIRED!
     */
    notEqualDeep: function(actual, expected, msg) {
        this._report(msg, function() {
            assert.notDeepEqual(actual, expected);
        });
    },

    /**
     * Tests whether the two parameters are not deep equal (using strict equality).
     * @example is.notEqualDeepStrict(someComplexObj, someOtherComplexObj, "it should be unique.");
     * @param {*} actual - the actual value
     * @param {*} expected - the expected value
     * @param {string} msg - a test description or message. NOTE: REQUIRED!
     */
    notEqualDeepStrict: function(actual, expected, msg) {
        this._report(msg, function() {
            assert.notDeepStrictEqual(actual, expected);
        });
    },

    /**
     * Tests whether the two parameters are not equal (using strict equality).
     * @example is.notEqualStrict(someComplexObj, someOtherComplexObj, "it should be unique.");
     * @param {*} actual - the actual value
     * @param {*} expected - the expected value
     * @param {string} msg - a test description or message. NOTE: REQUIRED!
     */
    notEqualStrict: function(actual, expected, msg) {
        this._report(msg, function() {
            assert.notStrictEqual(actual, expected);
        });
    },

    /**
     *
     *
     * @param {*} actual - the actual value
     * @param {*} expected - the expected value
     * @param {string} msg - a test description or message. NOTE: REQUIRED!
     */
    ifError: function(actual, expected, msg) {
        this._report(msg, function() {
            assert.ifError(actual, expected);
        });
    },

    /**
     * Tests whether an error was thrown.
     * @example is.thrown(someFunc(123), "it should throw an error/exception.");
     * @param {*} block - the code block
     * @param {string} msg - a test description or message. NOTE: REQUIRED!
     */
    thrown: function(block, msg) {
        this._report(msg, function() {
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
        this._report(msg, function() {
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
     * Tests whether the single given parameter is 'falsey' (i.e. allowing coercion etc.)
     * @example is.falsey(someValue, "it should be complete.");
     * @param {*} actual - the actual value
     * @param {string} msg - a test description or message. NOTE: REQUIRED!
     */
    falsey: function(actual, msg) {
        this._report(msg, function() {
            assert.ok(!actual);
        });
    },

    /**
     * Tests whether the single given parameter is 'truthy' (i.e. allowing coercion etc.)
     * @example is.truthy(someValue, "it should be complete.");
     * @param {*} actual - the actual value
     * @param {string} msg - a test description or message. NOTE: REQUIRED!
     */
    truthy: function(actual, msg) {
        this._report(msg, function() {
            assert.ok(actual);
        });
    },

    // assert(value[, message])
    // assert.fail(message)
    // assert.fail(actual, expected, message, operator)
    // assert.ok(value[, message])

    snapshot: function(a, msg) {
        // this._report(msg, function() {
        //     assert.equal(a, a);
        // });
        let key = msg;
        let snapshot = this.snapshots[key];
        //console.log("SNAPSHOT = " + JSON.stringify(snapshot));

        let type = typeof(a);
        let value = "";
        switch(type) {
            default:
                value = JSON.stringify(a);
        }

        if(snapshot !== undefined) {
            // We have an existing snapshot - to test against.
            this.equal(value, snapshot, msg);
        } else {
            // We need to make a new snapshot.
            this.snapshots[key] = value;
            this.snapshotsUpdated = true;
            this._report(msg, "snapshot");
        }
    }


};


// Exports
module.exports = {
    is: Bayeux,
    unit: function(desc, fn) {Bayeux.unit(desc, fn);},
    test: function(desc, fn) {Bayeux.test(desc, fn);},
};
