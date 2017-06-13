"use strict";

// Imports
const {is, test, unit} = require("../../../src/js/Bayeux");

// Unit(s)

// Unit test(s)
unit("Examples", function() {

    test("something simple like a value", function(done) {

        let someNumber = 42;
        is.equal(someNumber, 42, "it should be able to compare numbers for equality.");

        done(); // Indicate the test has finished
    });

    test("something like a snapshot", function(done) {

        // Setup test
        let obj = {
            name: "Joe",
            age: 22
        };
        is.snapshot(obj, "it should have the correct properties and values.");

        done(); // Indicate the test has finished
    });

    test("something asynchronous like a timeout", function(done) {
        setTimeout(function() {
            is.equal(true, true, "it should be successful even if delayed.");
            done(); // Indicate the test has finished
        }, 2000);
    });

});