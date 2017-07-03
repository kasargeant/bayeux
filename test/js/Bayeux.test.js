/**
 * @file Bayeux.test.js
 * @description Unit tests for the Bayeux Class (Core and TDD vocabulary).
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE.txt file included in this distribution.
 */

"use strict";

// Import Bayeux and extract selected vocabulary.
const Bayeux = require("../../src/js/Bayeux");
const {given, test, unit} = Bayeux.TDD();

const sinon = require("sinon");

// Constants
const DUMMY_REPORTS = require("../data/example_unit_test_reports.json");
const DUMMY_REPORT_SUMMARY = require("../data/example_report_summary_object.json");
const DUMMY_STRING = "Dummy String";

describe("Class: Bayeux", function() {

    describe("Standard sanity check", function() {
        it("contains spec with an positive expectation", function() {
            expect(true).toBe(true);
        });
        it("contains spec with a negative expectation", function() {
            expect(!true).toBe(false);
        });
    });

    describe("Import and/or instantiation", function() {
        
        it("should exist", function() {
            expect(Bayeux).toBeDefined();
        });

        it("should have imported all named user helper functions.", function() {
            expect(test).toBeDefined();
            expect(unit).toBeDefined();
        });
    });


    describe("Core functions", function() {

        it("should be able to collate the series of test line reports into a single unit report", function() {
            expect(Bayeux._collate(DUMMY_REPORTS)).toEqual(DUMMY_REPORT_SUMMARY);
        });

        it("should throw an error whilst collating a corrupt test line report", function() {
            // expect(Bayeux._collate([{"type": "DELIBERATE_MISTAKE","description": "Tinter (Node/16-color)"}])).toThrowError(new Error("Unrecognisable test output."));
            expect(function() {
                Bayeux._collate([{"type": "DELIBERATE_MISTAKE", "description": "Tinter (Node/16-color)"}]);
            }).toThrow();
        });

        it("it should generate a report summary object on completion", function() {
            let serialisedReport = Bayeux._onCompletion(DUMMY_REPORT_SUMMARY, "return");
            let reportObj = JSON.parse(serialisedReport);
            expect(reportObj).toEqual(DUMMY_REPORT_SUMMARY);
        });

        //
        //     // it("it should log when a test is being run.", function(done) {
        //     //
        //     //     // Setup test
        //     //     // test: function(message, fn) {
        //     //     //     this.fnArray.push(function(done) {
        //     //     //         this.reports.push({type: "test", message: message});
        //     //     //         fn(done);
        //     //     //     }.bind(this));
        //     //     // },
        //     //     expect(Bayeux.reports).toEqual([]);
        //     //
        //     //     expect(Bayeux.fnArray.length).toEqual(0);
        //     //     Bayeux.test("something", function(testDone) {testDone();});
        //     //     expect(Bayeux.fnArray.length).toEqual(1);
        //     //
        //     //     Bayeux._executeTests(function() {
        //     //         expect(Bayeux.reports).toEqual([{"message": "something", "type": "test"}]);
        //     //
        //     //         // Explicit cleanup
        //     //         Bayeux._cleanup();
        //     //
        //     //         done();
        //     //     });
        //     //
        //     //
        //     // });

        it("it should log when a 'pass' on a successful test case", function() {
            unit("a unit", function() {
                test("a test", function() {
                    let actual = "hi!";
                    given("a test for string equality").expect(actual).toEqual("hi!");

                    let reports = Bayeux._getReports();
                    expect(reports.length).toBe(3);

                    let report = reports[2];
                    expect(report.type).toBe("case");
                    expect(report.ok).toBe(true);
                    expect(report.description).toBe("a test for string equality");
                });
            });
        });


        it("it should log when a 'fail' on a failed test case", function() {

            unit("a unit", function() {
                test("a test", function() {
                    let actual = "hi!";
                    let expected = "ho!";

                    given("a test for string equality").expect(actual).toEqual(expected);

                    let reports = Bayeux._getReports();
                    expect(reports.length).toBe(3);

                    let report = reports[2];
                    expect(report.type).toBe("case");
                    expect(report.ok).toBe(false);
                    expect(report.description).toBe("a test for string equality");
                    expect(report.message).toBe("'hi!' === 'ho!'");
                    expect(report.name.slice(0, 14)).toBe("AssertionError"); // Note: The slice is because Travis returns: "AssertionError [ERR_ASSERTION]"
                    expect(report.actual).toBe(actual);
                    expect(report.expected).toBe(expected);
                    expect(report.operator).toBe("===");
                    expect(report.stack).toBeDefined();
                 });
            });

        });
        //
        //
        //     // it("it should log when a snapshot is first created for a test case", function() {
        //     //     //TODO - test: it should log when a snapshot is first created for a test case
        //     // });

    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // EQUAL
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    describe("User functions: 'equal'", function() {

        // TYPICAL PASS
        // [{
        //      "message": "it should be able to compare strings for equality.",
        //      "ok": true,
        //      "title": "it should be able to compare strings for equality.",
        //      "type": "case"
        // }]

        // TYPICAL FAIL
        // [{
        //         "type": "case",
        //         "ok": false,
        //         "title": "it should be able to compare strings for equality.",
        //         "name": "AssertionError",
        //         "message": "'ho!' == 'hi!'",
        //         "generatedMessage": true,
        //         "actual": "ho!",
        //         "expected": "hi!",
        //         "operator": "==",
        //         "stack": "AssertionError: 'ho!' == 'hi!'\n    at /Users/kasargeant/dev/projects/bayeux/src/js/Bayeux.js:229:20\n    at Object._report (/Users/kasargeant/dev/projects/bayeux/src/js/Bayeux.js:38:17)\n    at Object.equal (/Users/kasargeant/dev/projects/bayeux/src/js/Bayeux.js:228:14)\n    at /Users/kasargeant/dev/projects/bayeux/test/js/samples/bayeux.test.js:22:12\n    at Object.<anonymous> (/Users/kasargeant/dev/projects/bayeux/src/js/Bayeux.js:155:13)\n    at handleItem (/Users/kasargeant/dev/projects/bayeux/node_modules/async-series/index.js:14:13)\n    at series (/Users/kasargeant/dev/projects/bayeux/node_modules/async-series/index.js:30:3)\n    at Object._executeTests (/Users/kasargeant/dev/projects/bayeux/src/js/Bayeux.js:138:9)\n    at Object.unit (/Users/kasargeant/dev/projects/bayeux/src/js/Bayeux.js:179:14)\n    at unit (/Users/kasargeant/dev/projects/bayeux/src/js/Bayeux.js:441:38)"
        // }]

        beforeEach(function() {
            sinon.spy(Bayeux, "report");
        });
        afterEach(function() {
            Bayeux.report.restore();
        });


        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // equal()
        it("it should log when a 'pass' on a successful: equal(loose)", function() {

            let actual = 1;
            let expected = "1";
            given("it does log a 'pass' when values are loosely equal.").expect(actual).toEqual(expected, false);

            // console.log(Bayeux.report.called);
            // console.log(Bayeux.report.callCount);
            // console.log(Bayeux.report.lastCall.arg); // First parameter of the last call
            // console.log(Bayeux.report.lastCall.args[1]); // Second parameter of the last call
            // console.log(Bayeux.report.calls[0].returned);



            expect(Bayeux.report.callCount).toBe(1);
            let report = Bayeux.report.lastCall.args[0];
            expect(report.type).toBe("case");
            expect(report.ok).toBe(true);
            expect(report.description).toBe("it does log a 'pass' when values are loosely equal.");
        });

        it("it should log when a 'fail' on a failed: equal(loose)", function() {

            let actual = 1;
            let expected = "2";
            given("it does log a 'fail' when values are not loosely equal.").expect(actual).toEqual(expected, false);

            expect(Bayeux.report.callCount).toBe(1);
            let report = Bayeux.report.lastCall.args[0];
            expect(report.type).toBe("case");
            expect(report.ok).toBe(false);
            expect(report.description).toBe("it does log a 'fail' when values are not loosely equal.");
            expect(report.message).toBe("1 == '2'");
            expect(report.name.slice(0, 14)).toBe("AssertionError"); // Note: The slice is because Travis returns: "AssertionError [ERR_ASSERTION]"
            expect(report.actual).toBe(actual);
            expect(report.expected).toBe(expected);
            expect(report.operator).toBe("==");
            expect(report.stack).toBeDefined();
        });

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // deepEqual()
        it("it should log when a 'pass' on a successful: deepEqual(loose)", function() {

            let actual = {
                a: "1",
                b: {
                    name: "dog",
                    type: "animal"
                },
                c: ["1", {width: "200", height: "70"}, true]
            };
            let expected = {
                a: 1,
                b: {
                    name: "dog",
                    type: "animal"
                },
                c: [1, {width: 200, height: 70}, true]
            };

            given("it does log a 'pass' when values are loosely deep equal.").expect(actual).toDeepEqual(expected, false);

            expect(Bayeux.report.callCount).toBe(1);
            let report = Bayeux.report.lastCall.args[0];
            expect(report.type).toBe("case");
            expect(report.ok).toBe(true);
            expect(report.description).toBe("it does log a 'pass' when values are loosely deep equal.");
        });

        it("it should log when a 'fail' on a failed: deepEqual(loose)", function() {

            let actual = {
                a: "1",
                b: {
                    name: "dog",
                    type: "animal"
                },
                c: ["1", {width: "200", height: "701"}, true]
            };
            let expected = {
                a: 1,
                b: {
                    name: "dog",
                    type: "animal"
                },
                c: [1, {width: 200, height: 70}, true]
            };

            given("it does log a 'pass' when values are loosely deep equal.").expect(actual).toDeepEqual(expected, false);

            expect(Bayeux.report.callCount).toBe(1);
            let report = Bayeux.report.lastCall.args[0];
            expect(report.type).toBe("case");
            expect(report.ok).toBe(false);
            expect(report.description).toBe("it does log a 'pass' when values are loosely deep equal.");
            expect(report.message).toBe("{ a: '1',\n  b: { name: 'dog', type: 'animal' },\n  c: [ '1', { width: '200', height: '701' }, true ] } deepEqual { a: 1,\n  b: { name: 'dog', type: 'animal' },\n  c: [ 1, { width: 200, height: 70 }, true ] }");
            expect(report.generatedMessage).toBe(true);
            expect(report.name.slice(0, 14)).toBe("AssertionError"); // Note: The slice is because Travis returns: "AssertionError [ERR_ASSERTION]"
            expect(report.actual).toBe(actual);
            expect(report.expected).toBe(expected);
            expect(report.operator).toBe("deepEqual");
            expect(report.stack).toBeDefined();
        });

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // EQUAL - STRICT
        it("it should log when a 'pass' on a successful: equal(strict)", function() {

            let actual = 1;
            let expected = 1;
            given("it does log a 'pass' when values are strictly equal.").expect(actual).toEqual(expected, true);

            expect(Bayeux.report.callCount).toBe(1);
            let report = Bayeux.report.lastCall.args[0];
            expect(report.type).toBe("case");
            expect(report.ok).toBe(true);
            expect(report.description).toBe("it does log a 'pass' when values are strictly equal.");
        });

        it("it should log when a 'fail' on a failed: equal(strict)", function() {

            let actual = 1;
            let expected = "1";
            given("it does log a 'pass' when values are strictly equal.").expect(actual).toEqual(expected, true);

            expect(Bayeux.report.callCount).toBe(1);
            let report = Bayeux.report.lastCall.args[0];
            expect(report.type).toBe("case");
            expect(report.ok).toBe(false);
            expect(report.description).toBe("it does log a 'pass' when values are strictly equal.");
            expect(report.message).toBe("1 === '1'");
            expect(report.generatedMessage).toBe(true);
            expect(report.name.slice(0, 14)).toBe("AssertionError"); // Note: The slice is because Travis returns: "AssertionError [ERR_ASSERTION]"
            expect(report.actual).toBe(actual);
            expect(report.expected).toBe(expected);
            expect(report.operator).toBe("===");
            expect(report.stack).toBeDefined();
        });

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // EQUAL_DEEP - STRICT
        it("it should log when a 'pass' on a successful: deepEqual(strict)", function() {

            let actual = {
                a: 1,
                b: {
                    name: "dog",
                    type: "animal"
                },
                c: [1, {width: 200, height: 70}, true]
            };
            let expected = {
                a: 1,
                b: {
                    name: "dog",
                    type: "animal"
                },
                c: [1, {width: 200, height: 70}, true]
            };
            given("it does log a 'pass' when values are strictly deep equal.").expect(actual).toDeepEqual(expected, true);

            expect(Bayeux.report.callCount).toBe(1);
            let report = Bayeux.report.lastCall.args[0];
            expect(report.type).toBe("case");
            expect(report.ok).toBe(true);
            expect(report.description).toBe("it does log a 'pass' when values are strictly deep equal.");
        });

        it("it should log when a 'fail' on a failed: deepEqual(strict)", function() {

            let actual = {
                a: "1", // NOTE: DELIBERATE ERROR
                b: {
                    name: "dog",
                    type: "animal"
                },
                c: [1, {width: 200, height: 70}, true]
            };
            let expected = {
                a: 1,
                b: {
                    name: "dog",
                    type: "animal"
                },
                c: [1, {width: 200, height: 70}, true]
            };
            given("it does log a 'fail' when values are not strictly deep equal.").expect(actual).toDeepEqual(expected, true);

            expect(Bayeux.report.callCount).toBe(1);
            let report = Bayeux.report.lastCall.args[0];
            expect(report.type).toBe("case");
            expect(report.ok).toBe(false);
            expect(report.description).toBe("it does log a 'fail' when values are not strictly deep equal.");
            expect(report.message).toBe("{ a: '1',\n  b: { name: 'dog', type: 'animal' },\n  c: [ 1, { width: 200, height: 70 }, true ] } deepStrictEqual { a: 1,\n  b: { name: 'dog', type: 'animal' },\n  c: [ 1, { width: 200, height: 70 }, true ] }");
            expect(report.generatedMessage).toBe(true);
            expect(report.name.slice(0, 14)).toBe("AssertionError"); // Note: The slice is because Travis returns: "AssertionError [ERR_ASSERTION]"
            expect(report.actual).toBe(actual);
            expect(report.expected).toBe(expected);
            expect(report.operator).toBe("deepStrictEqual");
            expect(report.stack).toBeDefined();
        });
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // NOT-EQUAL
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    describe("User functions: 'notEqual'", function() {

        // TYPICAL PASS
        // [{
        //      "message": "it should be able to compare strings for notEquality.",
        //      "ok": true,
        //      "title": "it should be able to compare strings for notEquality.",
        //      "type": "case"
        // }]

        // TYPICAL FAIL
        // [{
        //         "type": "case",
        //         "ok": false,
        //         "title": "it should be able to compare strings for notEquality.",
        //         "name": "AssertionError",
        //         "message": "'ho!' == 'hi!'",
        //         "generatedMessage": true,
        //         "actual": "ho!",
        //         "expected": "hi!",
        //         "operator": "==",
        //         "stack": "AssertionError: 'ho!' == 'hi!'\n    at /Users/kasargeant/dev/projects/bayeux/src/js/Bayeux.js:229:20\n    at Object._report (/Users/kasargeant/dev/projects/bayeux/src/js/Bayeux.js:38:17)\n    at Object.equal (/Users/kasargeant/dev/projects/bayeux/src/js/Bayeux.js:228:14)\n    at /Users/kasargeant/dev/projects/bayeux/test/js/samples/bayeux.test.js:22:12\n    at Object.<anonymous> (/Users/kasargeant/dev/projects/bayeux/src/js/Bayeux.js:155:13)\n    at handleItem (/Users/kasargeant/dev/projects/bayeux/node_modules/async-series/index.js:14:13)\n    at series (/Users/kasargeant/dev/projects/bayeux/node_modules/async-series/index.js:30:3)\n    at Object._executeTests (/Users/kasargeant/dev/projects/bayeux/src/js/Bayeux.js:138:9)\n    at Object.unit (/Users/kasargeant/dev/projects/bayeux/src/js/Bayeux.js:179:14)\n    at unit (/Users/kasargeant/dev/projects/bayeux/src/js/Bayeux.js:441:38)"
        // }]
        beforeEach(function() {
            sinon.spy(Bayeux, "report");
        });
        afterEach(function() {
            Bayeux.report.restore();
        });


        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // NOT_EQUAL - LOOSE
        it("it should log when a 'pass' on a successful: notEqual(loose)", function() {

            let actual = 1;
            let expected = "2";
            given("it does log a 'pass' when values are not loosely equal.").expect(actual).toNotEqual(expected, false);

            expect(Bayeux.report.callCount).toBe(1);
            let report = Bayeux.report.lastCall.args[0];
            expect(report.type).toBe("case");
            expect(report.ok).toBe(true);
            expect(report.description).toBe("it does log a 'pass' when values are not loosely equal.");
        });

        it("it should log when a 'fail' on a failed: notEqual(loose)", function() {

            let actual = 1;
            let expected = "1";
            given("it does log a 'fail' when values are not loosely equal.").expect(actual).toNotEqual(expected, false);

            expect(Bayeux.report.callCount).toBe(1);
            let report = Bayeux.report.lastCall.args[0];
            expect(report.type).toBe("case");
            expect(report.ok).toBe(false);
            expect(report.description).toBe("it does log a 'fail' when values are not loosely equal.");
            expect(report.message).toBe("1 != '1'");
            expect(report.name.slice(0, 14)).toBe("AssertionError"); // Note: The slice is because Travis returns: "AssertionError [ERR_ASSERTION]"
            expect(report.actual).toBe(actual);
            expect(report.expected).toBe(expected);
            expect(report.operator).toBe("!=");
            expect(report.stack).toBeDefined();
        });

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // NOT_DEEP_EQUAL - LOOSE
        it("it should log when a 'pass' on a successful: notDeepEqual(loose)", function() {

            let actual = {
                a: "1",
                b: {
                    name: "dog",
                    type: "animal"
                },
                c: ["1", {width: "200", height: "701"}, true]
            };
            let expected = {
                a: 1,
                b: {
                    name: "dog",
                    type: "animal"
                },
                c: [1, {width: 200, height: 70}, true]
            };

            given("it does log a 'pass' when values are not loosely deep equal.").expect(actual).toNotDeepEqual(expected, false);

            expect(Bayeux.report.callCount).toBe(1);
            let report = Bayeux.report.lastCall.args[0];
            expect(report.type).toBe("case");
            expect(report.ok).toBe(true);
            expect(report.description).toBe("it does log a 'pass' when values are not loosely deep equal.");
        });

        it("it should log when a 'fail' on a failed: notDeepEqual(loose)", function() {

            let actual = {
                a: "1",
                b: {
                    name: "dog",
                    type: "animal"
                },
                c: ["1", {width: "200", height: "70"}, true]
            };
            let expected = {
                a: 1,
                b: {
                    name: "dog",
                    type: "animal"
                },
                c: [1, {width: 200, height: 70}, true]
            };

            given("it does log a 'fail' when values are loosely deep equal.").expect(actual).toNotDeepEqual(expected, false);

            expect(Bayeux.report.callCount).toBe(1);
            let report = Bayeux.report.lastCall.args[0];
            expect(report.type).toBe("case");
            expect(report.ok).toBe(false);
            expect(report.description).toBe("it does log a 'fail' when values are loosely deep equal.");
            expect(report.message).toBe("{ a: '1',\n  b: { name: 'dog', type: 'animal' },\n  c: [ '1', { width: '200', height: '70' }, true ] } notDeepEqual { a: 1,\n  b: { name: 'dog', type: 'animal' },\n  c: [ 1, { width: 200, height: 70 }, true ] }");
            expect(report.name.slice(0, 14)).toBe("AssertionError"); // Note: The slice is because Travis returns: "AssertionError [ERR_ASSERTION]"
            expect(report.actual).toBe(actual);
            expect(report.expected).toBe(expected);
            expect(report.operator).toBe("notDeepEqual");
            expect(report.stack).toBeDefined();
        });

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // NOT_EQUAL - STRICT
        it("it should log when a 'pass' on a successful: notEqual(strict)", function() {

            let actual = 1;
            let expected = "1";
            given("it does log a 'pass' when values are not strictly equal.").expect(actual).toNotEqual(expected, true);

            expect(Bayeux.report.callCount).toBe(1);
            let report = Bayeux.report.lastCall.args[0];
            expect(report.type).toBe("case");
            expect(report.ok).toBe(true);
            expect(report.description).toBe("it does log a 'pass' when values are not strictly equal.");
        });

        it("it should log when a 'fail' on a failed: notEqual(strict)", function() {

            let actual = 1;
            let expected = 1;
            given("it does log a 'fail' when values are strictly equal.").expect(actual).toNotEqual(expected, true);

            expect(Bayeux.report.callCount).toBe(1);
            let report = Bayeux.report.lastCall.args[0];
            expect(report.type).toBe("case");
            expect(report.ok).toBe(false);
            expect(report.description).toBe("it does log a 'fail' when values are strictly equal.");
            expect(report.message).toBe("1 !== 1");
            expect(report.name.slice(0, 14)).toBe("AssertionError"); // Note: The slice is because Travis returns: "AssertionError [ERR_ASSERTION]"
            expect(report.actual).toBe(actual);
            expect(report.expected).toBe(expected);
            expect(report.operator).toBe("!==");
            expect(report.stack).toBeDefined();
        });

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // NOT_EQUAL_DEEP - STRICT
        it("it should log when a 'pass' on a successful: notDeepEqual(strict)", function() {

            let actual = {
                a: "1", // NOTE: DELIBERATE ERROR
                b: {
                    name: "dog",
                    type: "animal"
                },
                c: [1, {width: 200, height: 70}, true]
            };
            let expected = {
                a: 1,
                b: {
                    name: "dog",
                    type: "animal"
                },
                c: [1, {width: 200, height: 70}, true]
            };
            given("it does log a 'pass' when values are not strictly deep equal.").expect(actual).toNotDeepEqual(expected, true);

            expect(Bayeux.report.callCount).toBe(1);
            let report = Bayeux.report.lastCall.args[0];
            expect(report.type).toBe("case");
            expect(report.ok).toBe(true);
            expect(report.description).toBe("it does log a 'pass' when values are not strictly deep equal.");
        });

        it("it should log when a 'fail' on a failed: notDeepEqual(strict)", function() {

            let actual = {
                a: 1,
                b: {
                    name: "dog",
                    type: "animal"
                },
                c: [1, {width: 200, height: 70}, true]
            };
            let expected = {
                a: 1,
                b: {
                    name: "dog",
                    type: "animal"
                },
                c: [1, {width: 200, height: 70}, true]
            };
            given("it does log a 'fail' when values are strictly deep equal.").expect(actual).toNotDeepEqual(expected, true);

            expect(Bayeux.report.callCount).toBe(1);
            let report = Bayeux.report.lastCall.args[0];
            expect(report.type).toBe("case");
            expect(report.ok).toBe(false);
            expect(report.description).toBe("it does log a 'fail' when values are strictly deep equal.");
            expect(report.message).toBe("{ a: 1,\n  b: { name: 'dog', type: 'animal' },\n  c: [ 1, { width: 200, height: 70 }, true ] } notDeepStrictEqual { a: 1,\n  b: { name: 'dog', type: 'animal' },\n  c: [ 1, { width: 200, height: 70 }, true ] }");
            expect(report.name.slice(0, 14)).toBe("AssertionError"); // Note: The slice is because Travis returns: "AssertionError [ERR_ASSERTION]"
            expect(report.actual).toBe(actual);
            expect(report.expected).toBe(expected);
            expect(report.operator).toBe("notDeepStrictEqual");
            expect(report.stack).toBeDefined();
        });
    });

    // //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // // TRUTH
    // //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //
    // describe("User functions: 'truthiness'", function() {
    //
    //     //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //     // truthy()
    //     it("it should log when a 'pass' on a successful: truthy()", function() {
    //
    //         let actual = 1;
    //         given("it should be able to determine if a value is truthy.").expect(actual).toBeTruthy();
    //
    //         expect(Bayeux.report.callCount).toBe(1);
    //         let report = Bayeux.report.lastCall.args[0];
    //         expect(report.type).toBe("case");
    //         expect(report.ok).toBe(true);
    //         expect(report.description).toBe("it should be able to determine if a value is truthy.");
    //         Bayeux.report.restore();
    //     });
    //
    //     it("it should log when a 'fail' on a failed: truthy()", function() {
    //         expect(Bayeux.reports).toEqual([]); // Make sure nothing from other tests contaminating shared variable.
    //
    //         let actual = 0;
    //         given("it should be able to determine if a value is not truthy.").expect(actual).toBeTruthy();
    //
    //         expect(Bayeux.report.callCount).toBe(1);
    //         let report = Bayeux.report.lastCall.args[0];
    //         expect(report.type).toBe("case");
    //         expect(report.ok).toBe(false);
    //         expect(report.description).toBe("it should be able to compare strings for notEquality.");
    //         expect(report.message).toBe("it should be able to compare strings for notEquality.");
    //         expect(report.name.slice(0, 14)).toBe("AssertionError"); // Note: The slice is because Travis returns: "AssertionError [ERR_ASSERTION]"
    //         expect(report.actual).toBe(actual);
    //         expect(report.operator).toBe("==");
    //         expect(report.stack).toBeDefined();
    //         Bayeux.report.restore();
    //         Bayeux._cleanup(); // Explicit cleanup
    //     });
    //
    // });


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // ERRORS (EXCEPTION-HANDLING)
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    //FIXME - NEED TO ADD CASES WHEN CHECKING FOR SPECIFIC ERROR TYPES!!!

    describe("User functions: 'exceptions'", function() {

        beforeEach(function() {
            sinon.spy(Bayeux, "report");
        });
        afterEach(function() {
            Bayeux.report.restore();
        });


        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // thrown()
        it("it should log when a 'pass' on a successful: thrown()", function() {

            let actual = function() {
                throw new Error("Error!");
            };
            given("it should be able to determine if an error was thrown.").expect(actual).toThrow();

            expect(Bayeux.report.callCount).toBe(1);
            let report = Bayeux.report.lastCall.args[0];
            expect(report.type).toBe("case");
            expect(report.ok).toBe(true);
            expect(report.description).toBe("it should be able to determine if an error was thrown.");
        });

        it("it should log when a 'fail' on a failed: thrown()", function() {

            let actual = function() {
                return "kitten";
            };
            given("it should be able to determine if an error was thrown.").expect(actual).toThrow();

            expect(Bayeux.report.callCount).toBe(1);
            let report = Bayeux.report.lastCall.args[0];
            expect(report.type).toBe("case");
            expect(report.ok).toBe(false);
            expect(report.description).toBe("it should be able to determine if an error was thrown.");
            expect(report.message.slice(0, 27)).toBe("Missing expected exception.");
            expect(report.name.slice(0, 14)).toBe("AssertionError"); // Note: The slice is because Travis returns: "AssertionError [ERR_ASSERTION]"
            expect(report.stack).toBeDefined();
        });

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // notThrown()
        it("it should log when a 'pass' on a successful: notThrown()", function() {

            let actual = function() {
                return "kitten";
            };
            given("it should be able to determine if an error was not thrown.").expect(actual).toNotThrow();

            expect(Bayeux.report.callCount).toBe(1);
            let report = Bayeux.report.lastCall.args[0];
            expect(report.type).toBe("case");
            expect(report.ok).toBe(true);
            expect(report.description).toBe("it should be able to determine if an error was not thrown.");
        });

        it("it should log when a 'fail' on a failed: notThrown()", function() {

            let actual = function() {
                throw new Error("Error!");
            };
            given("it should be able to determine if an error was not not thrown.").expect(actual).toNotThrow();

            expect(Bayeux.report.callCount).toBe(1);
            let report = Bayeux.report.lastCall.args[0];
            expect(report.type).toBe("case");
            expect(report.ok).toBe(false);
            expect(report.description).toBe("it should be able to determine if an error was not not thrown.");
            expect(report.message.slice(0, 23)).toBe("Got unwanted exception.");
            expect(report.name.slice(0, 14)).toBe("AssertionError"); // Note: The slice is because Travis returns: "AssertionError [ERR_ASSERTION]"
            expect(report.stack).toBeDefined();
        });
    });
});

