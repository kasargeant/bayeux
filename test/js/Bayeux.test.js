/**
 * @file Bayeux.test.js
 * @description Unit tests for the Bayeux Class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE.txt file included in this distribution.
 */

"use strict";

// Imports
const {is, unit, test} = require("../../src/js/Bayeux");
const Bayeux = is;

// Constants
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
            expect(is).toBeDefined();
            expect(test).toBeDefined();
            expect(unit).toBeDefined();
        });
    });


    describe("Core functions", function() {

        const unitOutput = [{"type": "unit","message": "Examples"},{"type": "test","message": "something simple like a value"},{"type": "case","ok": true,"title": "it should be able to compare booleans for inequality.","message": "it should be able to compare booleans for inequality."},{"type": "case","ok": true,"title": "it should be able to compare numbers for equality.","message": "it should be able to compare numbers for equality."},{"type": "case","ok": true,"title": "it should be able to compare strings for equality.","message": "it should be able to compare strings for equality."},{"type": "test","message": "something like a class"},{"type": "case","ok": false,"title": "it should have assigned the correct height.","name": "AssertionError","message": "210 == 2110","generatedMessage": true,"actual": 210,"expected": 2110,"operator": "==","stack": "AssertionError: 210 == 2110\n    at /Users/kasargeant/dev/projects/bayeux/src/js/Bayeux.js:136:20\n    at Object._report (/Users/kasargeant/dev/projects/bayeux/src/js/Bayeux.js:106:17)\n    at Object.equal (/Users/kasargeant/dev/projects/bayeux/src/js/Bayeux.js:135:14)\n    at /Users/kasargeant/dev/projects/bayeux/test/js/samples/bayeux.test.js:32:12\n    at Object.<anonymous> (/Users/kasargeant/dev/projects/bayeux/src/js/Bayeux.js:199:13)\n    at handleItem (/Users/kasargeant/dev/projects/bayeux/node_modules/async-series/index.js:14:13)\n    at /Users/kasargeant/dev/projects/bayeux/node_modules/async-series/index.js:16:36\n    at /Users/kasargeant/dev/projects/bayeux/test/js/samples/bayeux.test.js:24:9\n    at Object.<anonymous> (/Users/kasargeant/dev/projects/bayeux/src/js/Bayeux.js:199:13)\n    at handleItem (/Users/kasargeant/dev/projects/bayeux/node_modules/async-series/index.js:14:13)"},{"type": "case","ok": true,"title": "it should have assigned the correct width.","message": "it should have assigned the correct width."},{"type": "case","ok": true,"title": "it should have calculated the correct area.","message": "it should have calculated the correct area."},{"type": "test","message": "something within a callback"},{"type": "case","ok": true},{"type": "case","ok": true},{"type": "test","message": "something asynchronous like a timeout"},{"type": "case","ok": true}];

        it("should be able to collate the series of test line reports into a single unit report", function() {
            expect(Bayeux._collate(unitOutput)).toMatchSnapshot();
        });

        it("it should have cleaned up all temporary variable after every unit test.", function() {

            // Setup test
            JSON.stringify(Bayeux._collate(unitOutput));

            expect(Bayeux.reports).toEqual([]);
            expect(Bayeux.fnArray).toEqual([]);
            expect(Bayeux.snapshots).toEqual({});
            expect(Bayeux.snapshotsUpdated).toEqual(false);

            // Cleanup test
            Bayeux._cleanup();
        });

        it("it should log when a test is being run.", function(done) {

            // Setup test
            // test: function(message, fn) {
            //     this.fnArray.push(function(done) {
            //         this.reports.push({type: "test", message: message});
            //         fn(done);
            //     }.bind(this));
            // },
            expect(Bayeux.reports).toEqual([]);

            expect(Bayeux.fnArray.length).toEqual(0);
            Bayeux.test("something", function(testDone) {testDone();});
            expect(Bayeux.fnArray.length).toEqual(1);

            Bayeux._executeTests(function() {
                expect(Bayeux.reports).toEqual([{"message": "something", "type": "test"}]);

                // Explicit cleanup
                Bayeux._cleanup();

                done();
            });


        });

        it("it should log when a 'pass' on a successful test case", function() {
            expect(Bayeux.reports).toEqual([]); // Make sure nothing from other tests contaminating shared variable.

            let actual = "hi!";
            is.equal(actual, "hi!", "it should be able to compare strings for equality.");
            expect(Bayeux.reports).toEqual([{"message": "it should be able to compare strings for equality.", "ok": true, "unit": "it should be able to compare strings for equality.", "type": "case"}]);

            Bayeux._cleanup(); // Explicit cleanup
        });


        it("it should log when a 'fail' on a failed test case", function() {
            expect(Bayeux.reports).toEqual([]); // Make sure nothing from other tests contaminating shared variable.

            let actual = "ho!";
            is.equal(actual, "hi!", "it should be able to compare strings for equality.");

            let report = Bayeux.reports[0];
                // "actual": "ho!",
                // "code": undefined,
                // "expected": "hi!",
                // "generatedMessage": true,
                // "message": "'ho!' == 'hi!'",
                // "name": "AssertionError",
                // "ok": false,
                // "operator": "==",
            expect(report.ok).toBe(false);
            expect(report.name.slice(0, 14)).toBe("AssertionError"); // Note: The slice is because Travis returns: "AssertionError [ERR_ASSERTION]"
            // FIXME expect(report.title).toBe("it should be able to compare strings for equality.");
            // FIXME expect(report.message).toBe("it should be able to compare strings for equality.");

            Bayeux._cleanup(); // Explicit cleanup
        });


        // it("it should log when a snapshot is first created for a test case", function() {
        //     //TODO - test: it should log when a snapshot is first created for a test case
        // });

    });


    describe("User functions", function() {

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
        it("it should log when a 'pass' on a successful: equal()", function() {
            expect(Bayeux.reports).toEqual([]); // Make sure nothing from other tests contaminating shared variable.

            let actual = "hi!";
            is.equal(actual, "hi!", "it should be able to compare strings for equality.");

            let report = Bayeux.reports[0];
            expect(report.type).toBe("case");
            expect(report.ok).toBe(true);
            //TODO expect(report.title).toBe("it should be able to compare strings for equality.");
            expect(report.message).toBe("it should be able to compare strings for equality.");

            Bayeux._cleanup(); // Explicit cleanup
        });

        it("it should log when a 'fail' on a failed: equal()", function() {
            expect(Bayeux.reports).toEqual([]); // Make sure nothing from other tests contaminating shared variable.

            let actual = "ho!";
            is.equal(actual, "hi!", "it should be able to compare strings for equality.");

            let report = Bayeux.reports[0];
            expect(report.type).toBe("case");
            expect(report.ok).toBe(false);
            // FIXME expect(report.title).toBe("it should be able to compare strings for equality.");
            // FIXME expect(report.message).toBe("it should be able to compare strings for equality.");
            expect(report.name.slice(0, 14)).toBe("AssertionError"); // Note: The slice is because Travis returns: "AssertionError [ERR_ASSERTION]"
            expect(report.actual).toBe("ho!");
            expect(report.expected).toBe("hi!");
            expect(report.operator).toBe("==");
            expect(report.stack).toBeDefined();

            Bayeux._cleanup(); // Explicit cleanup
        });

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // equalStrict()
        it("it should log when a 'pass' on a successful: equalStrict()", function() {
            expect(Bayeux.reports).toEqual([]); // Make sure nothing from other tests contaminating shared variable.

            let actual = "hi!";
            is.equalStrict(actual, "hi!", "it should be able to compare strings for equality.");

            let report = Bayeux.reports[0];
            expect(report.type).toBe("case");
            expect(report.ok).toBe(true);
            //TODO expect(report.title).toBe("it should be able to compare strings for equality.");
            expect(report.message).toBe("it should be able to compare strings for equality.");

            Bayeux._cleanup(); // Explicit cleanup
        });

        it("it should log when a 'fail' on a failed: equalStrict()", function() {
            expect(Bayeux.reports).toEqual([]); // Make sure nothing from other tests contaminating shared variable.

            let actual = "ho!";
            is.equalStrict(actual, "hi!", "it should be able to compare strings for equality.");

            let report = Bayeux.reports[0];
            expect(report.type).toBe("case");
            expect(report.ok).toBe(false);
            // FIXME expect(report.title).toBe("it should be able to compare strings for equality.");
            // FIXME expect(report.message).toBe("it should be able to compare strings for equality.");
            expect(report.name.slice(0, 14)).toBe("AssertionError"); // Note: The slice is because Travis returns: "AssertionError [ERR_ASSERTION]"
            expect(report.actual).toBe("ho!");
            expect(report.expected).toBe("hi!");
            expect(report.operator).toBe("===");
            expect(report.stack).toBeDefined();

            Bayeux._cleanup(); // Explicit cleanup
        });

    });
});

