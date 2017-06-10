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
    testReports: [],
    reports: [],
    fnArray: [],

    snapshots: {},
    snapshotsUpdated: false,

    _cleanup: function() {
        this.testReports = [];
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
                            cases: []
                        };
                    }
                    testReportCount++;
                    break;
                case "case":
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

    _report: function(desc, fn) {
        if(fn === "snapshot") {
            this.reports.push({
                type: "case",
                ok: true,
                title: desc,
                message: "[NEW SNAPSHOT] " +  desc
            });
        } else {
            try {
                //console.log(desc + ": starting...");
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
    },

    // is.equal(square.height, 2110, "it should have assigned the right height.");
    equal: function(a, b, msg) {
        this._report(msg, function() {
            assert.equal(a, b);
        });
    },

    // is.equal(square.height, 2110, "it should have assigned the right height.");
    notEqual: function(a, b, msg) {
        this._report(msg, function() {
            assert.notEqual(a, b);
        });
    },

    // is.equal(square.height, 2110, "it should have assigned the right height.");
    ifError: function(a, b, msg) {
        this._report(msg, function() {
            assert.ifError(a, b);
        });
    },

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
    },

    // is.equal(square.height, 2110, "it should have assigned the right height.");
    _executeTests: function() {

        series(this.fnArray, function(err) {
            if(err) {throw err;}
            this.fnArray = [];
            // console.log(JSON.stringify(this.reports));
            // console.log("=======");
            this._collate(this.reports); // At this point the entire test unit is finished.
            // Then cleanup
            this._cleanup();
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
        this._executeTests();

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
    }
};


// Exports
module.exports = {
    is: Bayeux,
    unit: function(desc, fn) {Bayeux.unit(desc, fn);},
    test: function(desc, fn) {Bayeux.test(desc, fn);},
};
