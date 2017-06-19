/**
 * @file Bayeux.test.js
 * @description Unit tests for the Bayeux Class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE.txt file included in this distribution.
 */

"use strict";

// Import Bayeux and extract selected vocabulary.
const Bayeux = require("../../src/js/Bayeux");
const {given, test, unit} = Bayeux.TDD();

const simple = require("simple-mock");

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

        const unitOutput = [{"type": "unit","message": "Examples"},{"type": "test","message": "something simple like a value"},{"type": "case","ok": true,"title": "it should be able to compare booleans for inequality.","message": "it should be able to compare booleans for inequality."},{"type": "case","ok": true,"title": "it should be able to compare numbers for equality.","message": "it should be able to compare numbers for equality."},{"type": "case","ok": true,"title": "it should be able to compare strings for equality.","message": "it should be able to compare strings for equality."},{"type": "test","message": "something like a class"},{"type": "case","ok": false,"title": "it should have assigned the correct height.","name": "AssertionError","message": "210 == 2110","generatedMessage": true,"actual": 210,"expected": 2110,"operator": "==","stack": "AssertionError: 210 == 2110\n    at /Users/kasargeant/dev/projects/bayeux/src/js/Bayeux.js:136:20\n    at Object._report (/Users/kasargeant/dev/projects/bayeux/src/js/Bayeux.js:106:17)\n    at Object.equal (/Users/kasargeant/dev/projects/bayeux/src/js/Bayeux.js:135:14)\n    at /Users/kasargeant/dev/projects/bayeux/test/js/samples/bayeux.test.js:32:12\n    at Object.<anonymous> (/Users/kasargeant/dev/projects/bayeux/src/js/Bayeux.js:199:13)\n    at handleItem (/Users/kasargeant/dev/projects/bayeux/node_modules/async-series/index.js:14:13)\n    at /Users/kasargeant/dev/projects/bayeux/node_modules/async-series/index.js:16:36\n    at /Users/kasargeant/dev/projects/bayeux/test/js/samples/bayeux.test.js:24:9\n    at Object.<anonymous> (/Users/kasargeant/dev/projects/bayeux/src/js/Bayeux.js:199:13)\n    at handleItem (/Users/kasargeant/dev/projects/bayeux/node_modules/async-series/index.js:14:13)"},{"type": "case","ok": true,"title": "it should have assigned the correct width.","message": "it should have assigned the correct width."},{"type": "case","ok": true,"title": "it should have calculated the correct area.","message": "it should have calculated the correct area."},{"type": "test","message": "something within a callback"},{"type": "case","ok": true},{"type": "case","ok": true},{"type": "test","message": "something asynchronous like a timeout"},{"type": "case","ok": true}];

        it("should be able to collate the series of test line reports into a single unit report", function() {
            expect(Bayeux._collate(DUMMY_REPORTS)).toEqual(DUMMY_REPORT_SUMMARY);
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
                    expect(Bayeux._getReports()).toEqual([
                        {"message": "a unit", "type": "unit"},
                        {"message": "a test", "type": "test"},
                        {"actual": "hi!", "message": "a test for string equality", "ok": true, "type": "case", "unit": "a test for string equality"}
                    ]);
                });
            });
        });


        it("it should log when a 'fail' on a failed test case", function() {

            unit("a unit", function() {
                test("a test", function() {
                    let actual = "ho!";
                    given("a test for string equality").expect(actual).toEqual("hi!");
                    let reports = Bayeux._getReports();
                    expect(reports.length).toBe(3);
                    let caseReport = reports[2];
                    expect(caseReport.stack).toBeDefined();
                    caseReport.stack = ""; // NOTE: WE OVERWRITE THE 'stack' PROPERTY - IT IS TOO VARIABLE TO TEST.
                    expect(reports).toEqual([
                        {"message": "a unit", "type": "unit"},
                        {"message": "a test", "type": "test"},
                        {"actual": "ho!", "code": undefined, "expected": "hi!", "generatedMessage": true, "message": "'ho!' === 'hi!'", "name": "AssertionError", "ok": false, "operator": "===", "stack": "", "type": "case", "unit": "a test for string equality"}]);
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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // equal()
        it("it should log when a 'pass' on a successful: equal(loose)", function() {

            simple.mock(Bayeux, "report");

            let actual = 1;
            let expected = "1";
            given("it does log a 'pass' when values are loosely equal.").expect(actual).toEqual(expected, false);

            console.log(Bayeux.report.called);
            console.log(Bayeux.report.callCount);
            console.log(Bayeux.report.lastCall.arg); // First parameter of the last call


            let report = Bayeux.report.lastCall.arg;
            expect(report.type).toBe("case");
            expect(report.ok).toBe(true);
            //TODO expect(report.title).toBe("it should be able to compare strings for equality.");
            expect(report.message).toBe("it does log a 'pass' when values are loosely equal.");

        });

        it("it should log when a 'fail' on a failed: equal(loose)", function() {

            unit("a unit", function() {
                test("a test", function() {

                    let actual = 1;
                    let expected = "2";
                    given("it does log a 'fail' when values are not loosely equal.").expect(actual).toEqual(expected, false);

                    let reports = Bayeux._getReports();
                    expect(reports.length).toBe(3);

                    let report = reports[2];
                    expect(report.type).toBe("case");
                    expect(report.ok).toBe(false);
                    // FIXME expect(report.title).toBe("it should be able to compare strings for equality.");
                    // FIXME expect(report.message).toBe("it should be able to compare strings for equality.");
                    expect(report.name.slice(0, 14)).toBe("AssertionError"); // Note: The slice is because Travis returns: "AssertionError [ERR_ASSERTION]"
                    expect(report.actual).toBe(actual);
                    expect(report.expected).toBe(expected);
                    expect(report.operator).toBe("==");
                    expect(report.stack).toBeDefined();
                });
            });

        });

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // deepEqual()
        it("it should log when a 'pass' on a successful: deepEqual(loose)", function() {
            unit("a unit", function() {
                test("a test", function() {
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

                    let reports = Bayeux._getReports();
                    expect(reports.length).toBe(3);

                    let report = reports[2];
                    expect(report.type).toBe("case");
                    expect(report.ok).toBe(true);
                    //TODO expect(report.title).toBe("it should be able to compare strings for equality.");
                    expect(report.message).toBe("it does log a 'pass' when values are loosely deep equal.");

                });

            });
        });

        it("it should log when a 'fail' on a failed: deepEqual(loose)", function() {
            unit("a unit", function() {
                test("a test", function() {
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

                    let reports = Bayeux._getReports();
                    expect(reports.length).toBe(3);

                    let report = reports[2];
                    expect(report.type).toBe("case");
                    expect(report.ok).toBe(false);
                    // FIXME expect(report.title).toBe("it should be able to compare strings for equality.");
                    // FIXME expect(report.message).toBe("it should be able to compare strings for equality.");
                    expect(report.name.slice(0, 14)).toBe("AssertionError"); // Note: The slice is because Travis returns: "AssertionError [ERR_ASSERTION]"
                    expect(report.actual).toBe(actual);
                    expect(report.expected).toBe(expected);
                    expect(report.operator).toBe("deepEqual");
                    expect(report.stack).toBeDefined();

                });

            });
        });

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // EQUAL - STRICT
        it("it should log when a 'pass' on a successful: equal(strict)", function() {
            unit("a unit", function() {
                test("a test", function() {
                    let actual = 1;
                    let expected = 1;
                    given("it does log a 'pass' when values are strictly equal.").expect(actual).toEqual(expected, true);

                    let reports = Bayeux._getReports();
                    expect(reports.length).toBe(3);

                    let report = reports[2];
                    expect(report.type).toBe("case");
                    expect(report.ok).toBe(true);
                    //TODO expect(report.title).toBe("it should be able to compare strings for strict equality.");
                    expect(report.message).toBe("it does log a 'pass' when values are strictly equal.");
                });
            });
        });

        it("it should log when a 'fail' on a failed: equal(strict)", function() {
            unit("a unit", function() {
                test("a test", function() {
                    let actual = 1;
                    let expected = "1";
                    given("it does log a 'pass' when values are strictly equal.").expect(actual).toEqual(expected, true);

                    let reports = Bayeux._getReports();
                    expect(reports.length).toBe(3);

                    let report = reports[2];
                    expect(report.type).toBe("case");
                    expect(report.ok).toBe(false);
                    // FIXME expect(report.title).toBe("it should be able to compare strings for strict equality.");
                    // FIXME expect(report.message).toBe("it should be able to compare strings for strict equality.");
                    expect(report.name.slice(0, 14)).toBe("AssertionError"); // Note: The slice is because Travis returns: "AssertionError [ERR_ASSERTION]"
                    expect(report.actual).toBe(actual);
                    expect(report.expected).toBe(expected);
                    expect(report.operator).toBe("===");
                    expect(report.stack).toBeDefined();
                });
            });
        });

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // EQUAL_DEEP - STRICT
        it("it should log when a 'pass' on a successful: deepEqual(strict)", function() {
            unit("a unit", function() {
                test("a test", function() {
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

                    let reports = Bayeux._getReports();
                    expect(reports.length).toBe(3);

                    let report = reports[2];
                    expect(report.type).toBe("case");
                    expect(report.ok).toBe(true);
                    //TODO expect(report.title).toBe("it should be able to compare strings for equality.");
                    expect(report.message).toBe("it does log a 'pass' when values are strictly deep equal.");
                });
            });
        });

        it("it should log when a 'fail' on a failed: deepEqual(strict)", function() {
            unit("a unit", function() {
                test("a test", function() {
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

                    let reports = Bayeux._getReports();
                    expect(reports.length).toBe(3);

                    let report = reports[2];
                    expect(report.type).toBe("case");
                    expect(report.ok).toBe(false);
                    // FIXME expect(report.title).toBe("it should be able to compare strings for equality.");
                    // FIXME expect(report.message).toBe("it should be able to compare strings for equality.");
                    expect(report.name.slice(0, 14)).toBe("AssertionError"); // Note: The slice is because Travis returns: "AssertionError [ERR_ASSERTION]"
                    expect(report.actual).toBe(actual);
                    expect(report.expected).toBe(expected);
                    expect(report.operator).toBe("deepStrictEqual");
                    expect(report.stack).toBeDefined();
                });
            });
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

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // NOT_EQUAL - LOOSE
        it("it should log when a 'pass' on a successful: notEqual(loose)", function() {

            unit("a unit", function() {
                test("a test", function() {

                    let actual = 1;
                    let expected = "2";
                    given("it does log a 'pass' when values are not loosely equal.").expect(actual).toNotEqual(expected, false);

                    let reports = Bayeux._getReports();
                    expect(reports.length).toBe(3);

                    let report = reports[2];
                    expect(report.type).toBe("case");
                    expect(report.ok).toBe(true);
                    //TODO expect(report.title).toBe("it should be able to compare strings for equality.");
                    expect(report.message).toBe("it does log a 'pass' when values are not loosely equal.");

                });
            });

        });

        it("it should log when a 'fail' on a failed: notEqual(loose)", function() {

            unit("a unit", function() {
                test("a test", function() {

                    let actual = 1;
                    let expected = "1";
                    given("it does log a 'fail' when values are not loosely equal.").expect(actual).toNotEqual(expected, false);

                    let reports = Bayeux._getReports();
                    expect(reports.length).toBe(3);

                    let report = reports[2];
                    expect(report.type).toBe("case");
                    expect(report.ok).toBe(false);
                    // FIXME expect(report.title).toBe("it should be able to compare strings for equality.");
                    // FIXME expect(report.message).toBe("it does log a 'fail' when values are not loosely equal.");
                    expect(report.name.slice(0, 14)).toBe("AssertionError"); // Note: The slice is because Travis returns: "AssertionError [ERR_ASSERTION]"
                    expect(report.actual).toBe(actual);
                    expect(report.expected).toBe(expected);
                    expect(report.operator).toBe("!=");
                    expect(report.stack).toBeDefined();
                });
            });

        });

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // NOT_DEEP_EQUAL - LOOSE
        it("it should log when a 'pass' on a successful: notDeepEqual(loose)", function() {
            unit("a unit", function() {
                test("a test", function() {
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

                    let reports = Bayeux._getReports();
                    expect(reports.length).toBe(3);

                    let report = reports[2];
                    expect(report.type).toBe("case");
                    expect(report.ok).toBe(true);
                    //TODO expect(report.title).toBe("it should be able to compare strings for equality.");
                    expect(report.message).toBe("it does log a 'pass' when values are not loosely deep equal.");

                });

            });
        });

        it("it should log when a 'fail' on a failed: notDeepEqual(loose)", function() {
            unit("a unit", function() {
                test("a test", function() {
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

                    let reports = Bayeux._getReports();
                    expect(reports.length).toBe(3);

                    let report = reports[2];
                    expect(report.type).toBe("case");
                    expect(report.ok).toBe(false);
                    // FIXME expect(report.title).toBe("it should be able to compare strings for equality.");
                    // FIXME expect(report.message).toBe("it should be able to compare strings for equality.");
                    expect(report.name.slice(0, 14)).toBe("AssertionError"); // Note: The slice is because Travis returns: "AssertionError [ERR_ASSERTION]"
                    expect(report.actual).toBe(actual);
                    expect(report.expected).toBe(expected);
                    expect(report.operator).toBe("notDeepEqual");
                    expect(report.stack).toBeDefined();

                });

            });
        });

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // NOT_EQUAL - STRICT
        it("it should log when a 'pass' on a successful: notEqual(strict)", function() {
            unit("a unit", function() {
                test("a test", function() {
                    let actual = 1;
                    let expected = "1";
                    given("it does log a 'pass' when values are not strictly equal.").expect(actual).toNotEqual(expected, true);

                    let reports = Bayeux._getReports();
                    expect(reports.length).toBe(3);

                    let report = reports[2];
                    expect(report.type).toBe("case");
                    expect(report.ok).toBe(true);
                    //TODO expect(report.title).toBe("it should be able to compare strings for strict equality.");
                    expect(report.message).toBe("it does log a 'pass' when values are not strictly equal.");
                });
            });
        });

        it("it should log when a 'fail' on a failed: notEqual(strict)", function() {
            unit("a unit", function() {
                test("a test", function() {
                    let actual = 1;
                    let expected = 1;
                    given("it does log a 'fail' when values are strictly equal.").expect(actual).toNotEqual(expected, true);

                    let reports = Bayeux._getReports();
                    expect(reports.length).toBe(3);

                    let report = reports[2];
                    expect(report.type).toBe("case");
                    expect(report.ok).toBe(false);
                    // FIXME expect(report.title).toBe("it should be able to compare strings for strict equality.");
                    // FIXME expect(report.message).toBe("it should be able to compare strings for strict equality.");
                    expect(report.name.slice(0, 14)).toBe("AssertionError"); // Note: The slice is because Travis returns: "AssertionError [ERR_ASSERTION]"
                    expect(report.actual).toBe(actual);
                    expect(report.expected).toBe(expected);
                    expect(report.operator).toBe("!==");
                    expect(report.stack).toBeDefined();
                });
            });
        });

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // NOT_EQUAL_DEEP - STRICT
        it("it should log when a 'pass' on a successful: notDeepEqual(strict)", function() {
            unit("a unit", function() {
                test("a test", function() {
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

                    let reports = Bayeux._getReports();
                    expect(reports.length).toBe(3);

                    let report = reports[2];
                    expect(report.type).toBe("case");
                    expect(report.ok).toBe(true);
                    //TODO expect(report.title).toBe("it should be able to compare strings for equality.");
                    expect(report.message).toBe("it does log a 'pass' when values are not strictly deep equal.");
                });
            });
        });

        it("it should log when a 'fail' on a failed: notDeepEqual(strict)", function() {
            unit("a unit", function() {
                test("a test", function() {
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

                    let reports = Bayeux._getReports();
                    expect(reports.length).toBe(3);

                    let report = reports[2];
                    expect(report.type).toBe("case");
                    expect(report.ok).toBe(false);
                    // FIXME expect(report.title).toBe("it should be able to compare strings for equality.");
                    // FIXME expect(report.message).toBe("it should be able to compare strings for equality.");
                    expect(report.name.slice(0, 14)).toBe("AssertionError"); // Note: The slice is because Travis returns: "AssertionError [ERR_ASSERTION]"
                    expect(report.actual).toBe(actual);
                    expect(report.expected).toBe(expected);
                    expect(report.operator).toBe("notDeepStrictEqual");
                    expect(report.stack).toBeDefined();
                });
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
    //         expect(Bayeux.reports).toEqual([]); // Make sure nothing from other tests contaminating shared variable.
    //
    //         let actual = 1;
    //         is.truthy(actual, "it should be able to determine if a value is truthy.");
    //
    //         let report = Bayeux.reports[0];
    //         expect(report.type).toBe("case");
    //         expect(report.ok).toBe(true);
    //         //TODO expect(report.title).toBe("it should be able to compare strings for notEquality.");
    //         expect(report.message).toBe("it should be able to determine if a value is truthy.");
    //
    //         Bayeux._cleanup(); // Explicit cleanup
    //     });
    //
    //     it("it should log when a 'fail' on a failed: truthy()", function() {
    //         expect(Bayeux.reports).toEqual([]); // Make sure nothing from other tests contaminating shared variable.
    //
    //         let actual = 0;
    //         is.truthy(actual, "it should be able to determine if a value is not truthy.");
    //
    //         let report = Bayeux.reports[0];
    //         expect(report.type).toBe("case");
    //         expect(report.ok).toBe(false);
    //         // FIXME expect(report.title).toBe("it should be able to compare strings for notEquality.");
    //         // FIXME expect(report.message).toBe("it should be able to compare strings for notEquality.");
    //         expect(report.name.slice(0, 14)).toBe("AssertionError"); // Note: The slice is because Travis returns: "AssertionError [ERR_ASSERTION]"
    //         expect(report.actual).toBe(actual);
    //         expect(report.operator).toBe("==");
    //         expect(report.stack).toBeDefined();
    //
    //         Bayeux._cleanup(); // Explicit cleanup
    //     });
    //
    // });
    //
    //
    // //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // // ERRORS (EXCEPTION-HANDLING)
    // //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //
    // //FIXME - NEED TO ADD CASES WHEN CHECKING FOR SPECIFIC ERROR TYPES!!!
    //
    // describe("User functions: 'exceptions'", function() {
    //
    //     //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //     // thrown()
    //     it("it should log when a 'pass' on a successful: thrown()", function() {
    //         expect(Bayeux.reports).toEqual([]); // Make sure nothing from other tests contaminating shared variable.
    //
    //         let actual = function() {
    //             throw new Error("Error!");
    //         };
    //         is.thrown(actual, "it should be able to determine if an error was thrown.");
    //
    //         let report = Bayeux.reports[0];
    //         expect(report.type).toBe("case");
    //         expect(report.ok).toBe(true);
    //         //TODO expect(report.title).toBe("it should be able to compare strings for notEquality.");
    //         expect(report.message).toBe("it should be able to determine if an error was thrown.");
    //
    //         Bayeux._cleanup(); // Explicit cleanup
    //     });
    //
    //     it("it should log when a 'fail' on a failed: thrown()", function() {
    //         expect(Bayeux.reports).toEqual([]); // Make sure nothing from other tests contaminating shared variable.
    //
    //         let actual = function() {
    //             return "kitten";
    //         };
    //         is.thrown(actual, "it should be able to determine if an error was not thrown.");
    //         let report = Bayeux.reports[0];
    //         expect(report.type).toBe("case");
    //         expect(report.ok).toBe(false);
    //         // FIXME expect(report.title).toBe("it should be able to compare strings for notEquality.");
    //         expect(report.message.slice(0, 27)).toBe("Missing expected exception.");
    //         expect(report.name.slice(0, 14)).toBe("AssertionError"); // Note: The slice is because Travis returns: "AssertionError [ERR_ASSERTION]"
    //         expect(report.stack).toBeDefined();
    //
    //         Bayeux._cleanup(); // Explicit cleanup
    //     });
    //
    //     //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //     // notThrown()
    //     it("it should log when a 'pass' on a successful: notThrown()", function() {
    //         expect(Bayeux.reports).toEqual([]); // Make sure nothing from other tests contaminating shared variable.
    //
    //         let actual = function() {
    //             return "kitten";
    //         };
    //         is.notThrown(actual, "it should be able to determine if an error was not thrown.");
    //
    //         let report = Bayeux.reports[0];
    //         expect(report.type).toBe("case");
    //         expect(report.ok).toBe(true);
    //         //TODO expect(report.title).toBe("it should be able to compare strings for notEquality.");
    //         expect(report.message).toBe("it should be able to determine if an error was not thrown.");
    //
    //         Bayeux._cleanup(); // Explicit cleanup
    //     });
    //
    //     it("it should log when a 'fail' on a failed: notThrown()", function() {
    //         expect(Bayeux.reports).toEqual([]); // Make sure nothing from other tests contaminating shared variable.
    //
    //         let actual = function() {
    //             throw new Error("Error!");
    //         };
    //         is.notThrown(actual, "it should be able to determine if an error was thrown.");
    //         let report = Bayeux.reports[0];
    //         expect(report.type).toBe("case");
    //         expect(report.ok).toBe(false);
    //         // FIXME expect(report.title).toBe("it should be able to compare strings for notEquality.");
    //         expect(report.message.slice(0, 23)).toBe("Got unwanted exception.");
    //         expect(report.name.slice(0, 14)).toBe("AssertionError"); // Note: The slice is because Travis returns: "AssertionError [ERR_ASSERTION]"
    //         expect(report.stack).toBeDefined();
    //
    //         Bayeux._cleanup(); // Explicit cleanup
    //     });


    });
});

