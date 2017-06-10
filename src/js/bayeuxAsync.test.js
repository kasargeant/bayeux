"use strict";

// Imports
const Bayeux = require("./Bayeux");
const is = new Bayeux();

is.unit("Class: Square", function() {

    is.test("Sanity check.", function(done) {

        // Assert - it should have assigned the right height.
        is.equal(true, true, "it should be true.");

        // Assert - it should have assigned the right width.
        is.notEqual(true, false, "it should be false.");
        done();
    });

    is.test("SOMETHNG ASYNC AND TIMED", function(done) {
        setTimeout(function() {
            console.log("Timeout 1");
            is.equal(true, true, "it should timeout first.");
            done();
        }, 2000);
    });

    is.test("SOMETHNG ASYNC AND TIMED2", function(done) {
        setTimeout(function() {
            console.log("Timeout 2");
            is.equal(true, true, "it should timeout second.");
            done();
        }, 2000);
    });

});