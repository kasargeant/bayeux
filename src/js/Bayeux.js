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
const tinter = require("tinter");

const Bayeux = {

    testReports: [],
    reports: [],
    fnArray: [],

    report: function() {
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


        // Select test output format and destination
        let format = "json";
        let destination = "stdout";

        let unitReportSerialized = "";
        if(format === "json") {
            unitReportSerialized = JSON.stringify(unitReport, null, 2);
        }

        if(destination === "stdout") {
            console.log(unitReportSerialized);
        }
        else if(destination === "file") {
            let filename = unitReport.name.replace(/ /g, "_") + ".out.json";
            fs.writeFileSync(filename, unitReportSerialized);
        }

        return this.reports;
    },

    _report: function(desc, fn) {
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


    // is.equal(square.height, 2110, "it should have assigned the right height.");
    _executeTests: function() {

        series(this.fnArray, function() {
            this.fnArray = [];
            this.report(); // At this point the entire test unit is finished.
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
        this.reports = [{type: "unit", message: message}];
        fn();
        this._executeTests();
    }
};


// Exports
module.exports = {
    is: Bayeux,
    unit: function(desc, fn) {Bayeux.unit(desc, fn);},
    test: function(desc, fn) {Bayeux.test(desc, fn);},
};
