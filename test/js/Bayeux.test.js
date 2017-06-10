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

    describe("Core functions", function() {

        const unitOutput = [{"type": "unit","message": "Examples"},{"type": "test","message": "something simple like a value"},{"type": "case","ok": true,"title": "it should be able to compare booleans for inequality.","message": "it should be able to compare booleans for inequality."},{"type": "case","ok": true,"title": "it should be able to compare numbers for equality.","message": "it should be able to compare numbers for equality."},{"type": "case","ok": true,"title": "it should be able to compare strings for equality.","message": "it should be able to compare strings for equality."},{"type": "test","message": "something like a class"},{"type": "case","ok": false,"title": "it should have assigned the correct height.","name": "AssertionError","message": "210 == 2110","generatedMessage": true,"actual": 210,"expected": 2110,"operator": "==","stack": "AssertionError: 210 == 2110\n    at /Users/kasargeant/dev/projects/bayeux/src/js/Bayeux.js:136:20\n    at Object._report (/Users/kasargeant/dev/projects/bayeux/src/js/Bayeux.js:106:17)\n    at Object.equal (/Users/kasargeant/dev/projects/bayeux/src/js/Bayeux.js:135:14)\n    at /Users/kasargeant/dev/projects/bayeux/test/js/samples/bayeux.test.js:32:12\n    at Object.<anonymous> (/Users/kasargeant/dev/projects/bayeux/src/js/Bayeux.js:199:13)\n    at handleItem (/Users/kasargeant/dev/projects/bayeux/node_modules/async-series/index.js:14:13)\n    at /Users/kasargeant/dev/projects/bayeux/node_modules/async-series/index.js:16:36\n    at /Users/kasargeant/dev/projects/bayeux/test/js/samples/bayeux.test.js:24:9\n    at Object.<anonymous> (/Users/kasargeant/dev/projects/bayeux/src/js/Bayeux.js:199:13)\n    at handleItem (/Users/kasargeant/dev/projects/bayeux/node_modules/async-series/index.js:14:13)"},{"type": "case","ok": true,"title": "it should have assigned the correct width.","message": "it should have assigned the correct width."},{"type": "case","ok": true,"title": "it should have calculated the correct area.","message": "it should have calculated the correct area."},{"type": "test","message": "something within a callback"},{"type": "case","ok": true},{"type": "case","ok": true},{"type": "test","message": "something asynchronous like a timeout"},{"type": "case","ok": true}];

        it("should be able to collate the series of test line reports into a single unit report", function() {
            expect(JSON.stringify(Bayeux._collate(unitOutput))).toBe(JSON.stringify({
                "tests": [
                    {
                        "cases": [
                            {
                                "type": "case",
                                "ok": true,
                                "title": "it should be able to compare booleans for inequality.",
                                "message": "it should be able to compare booleans for inequality."
                            },
                            {
                                "type": "case",
                                "ok": true,
                                "title": "it should be able to compare numbers for equality.",
                                "message": "it should be able to compare numbers for equality."
                            },
                            {
                                "type": "case",
                                "ok": true,
                                "title": "it should be able to compare strings for equality.",
                                "message": "it should be able to compare strings for equality."
                            }
                        ]
                    },
                    {
                        "name": "something like a class",
                        "cases": [
                            {
                                "type": "case",
                                "ok": false,
                                "title": "it should have assigned the correct height.",
                                "name": "AssertionError",
                                "message": "210 == 2110",
                                "generatedMessage": true,
                                "actual": 210,
                                "expected": 2110,
                                "operator": "==",
                                "stack": "AssertionError: 210 == 2110\n    at /Users/kasargeant/dev/projects/bayeux/src/js/Bayeux.js:136:20\n    at Object._report (/Users/kasargeant/dev/projects/bayeux/src/js/Bayeux.js:106:17)\n    at Object.equal (/Users/kasargeant/dev/projects/bayeux/src/js/Bayeux.js:135:14)\n    at /Users/kasargeant/dev/projects/bayeux/test/js/samples/bayeux.test.js:32:12\n    at Object.<anonymous> (/Users/kasargeant/dev/projects/bayeux/src/js/Bayeux.js:199:13)\n    at handleItem (/Users/kasargeant/dev/projects/bayeux/node_modules/async-series/index.js:14:13)\n    at /Users/kasargeant/dev/projects/bayeux/node_modules/async-series/index.js:16:36\n    at /Users/kasargeant/dev/projects/bayeux/test/js/samples/bayeux.test.js:24:9\n    at Object.<anonymous> (/Users/kasargeant/dev/projects/bayeux/src/js/Bayeux.js:199:13)\n    at handleItem (/Users/kasargeant/dev/projects/bayeux/node_modules/async-series/index.js:14:13)"
                            },
                            {
                                "type": "case",
                                "ok": true,
                                "title": "it should have assigned the correct width.",
                                "message": "it should have assigned the correct width."
                            },
                            {
                                "type": "case",
                                "ok": true,
                                "title": "it should have calculated the correct area.",
                                "message": "it should have calculated the correct area."
                            }
                        ]
                    },
                    {
                        "name": "something within a callback",
                        "cases": [
                            {
                                "type": "case",
                                "ok": true
                            },
                            {
                                "type": "case",
                                "ok": true
                            }
                        ]
                    }
                ],
                "name": "Examples"
            }));



        });

        it("it should have cleaned up all temporary variable after every unit test.", function() {

            JSON.stringify(Bayeux._collate(unitOutput));

            expect(Bayeux.testReports).toEqual([]);
            expect(Bayeux.reports).toEqual([]);
            expect(Bayeux.fnArray).toEqual([]);
            expect(Bayeux.snapshots).toEqual({});
            expect(Bayeux.snapshotsUpdated).toEqual(false);
        });





    });
});

