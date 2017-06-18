/**
 * @file exampleAsync.unit.js
 * @description Example Bayeux Unit Test: Asynchronous tests.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE.txt file included in this distribution.
 */

"use strict";

// Import Bayeux and extract selected vocabulary.
const Bayeux = require("../../../src/js/Bayeux");
const {given, test, unit} = Bayeux.TDD();

// Constants

// Test
unit("Class: Square", function() {

    let hasTimedOut = false;

    test("Something synchronous and simple", function(done) {

        given("a true value").expect(true).toEqual(true);
        given("a false value").expect(false).toNotEqual(true);

        done();
    });

    test("Something async and timed", function(done) {
        setTimeout(function() {
            //console.log("Timeout 1");
            given("the first timeout call.").expect(hasTimedOut).toEqual(false);
            hasTimedOut = true;
            done(); // Indicate the test has finished
        }, 2000);
    });

    test("Something async and timed2", function(done) {
        setTimeout(function() {
            //console.log("Timeout 2");
            given("the second timeout call.").expect(hasTimedOut).toEqual(true);
            done(); // Indicate the test has finished
        }, 2000);
    });

});