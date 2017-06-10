"use strict";

// Imports
const {is, unit, test} = require("../../src/js/Bayeux");

// Unit(s)

// Unit test(s)
unit("Unit A", function() {

    test("Sanity check.", function(done) {

        // Assert - it should have assigned the right height.
        is.equal(true, true, "it should be true.");

        // Assert - it should have assigned the right width.
        is.notEqual(true, false, "it should be false.");
        done();
    });
});

unit("Unit B", function() {

    test("Somethng async and timed", function(done) {
        setTimeout(function() {
            console.log("Timeout 1");
            is.equal(true, true, "it should timeout first.");
            done();
        }, 2000);
    });

    test("Somethng async and timed2", function(done) {
        setTimeout(function() {
            console.log("Timeout 2");
            is.equal(true, true, "it should timeout second.");
            done();
        }, 2000);
    });
});