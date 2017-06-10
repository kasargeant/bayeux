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
        this.reports = [];
        this.fnArray = [];
    }

    report() {
        console.log(JSON.stringify(this.reports, null, 2));
        return this.reports;
    }

    _report(desc, fn) {
        try {
            console.log(desc + ": starting...");
            fn();
            this.reports.push({
                ok: true,
                title: desc,
                message: desc
            });
        } catch(err) {
            let errorReport = {
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
    test(msg, fn) {
        this.fnArray.push(fn);
    }

    unit(msg, fn) {
        fn();
        this._executeTests();

    }
}


// Exports
module.exports = Bayeux;