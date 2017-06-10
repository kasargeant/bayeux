"use strict";

// Imports
const {is, unit, test} = require("../../src/js/Bayeux");

// Unit(s)

// Unit test(s)
unit("Class: Square", function() {

    test("Something synchronous and simple", function(done) {

        is.equal(true, true, "it should be true.");

        is.notEqual(true, false, "it should be false.");

        done();
    });

    test("Something async and timed", function(done) {
        setTimeout(function() {
            console.log("Timeout 1");
            is.equal(true, true, "it should timeout first.");
            done(); // Indicate the test has finished
        }, 2000);
    });

    test("Something async and timed2", function(done) {
        setTimeout(function() {
            console.log("Timeout 2");
            is.equal(true, true, "it should timeout second.");
            done(); // Indicate the test has finished
        }, 2000);
    });

});