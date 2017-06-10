"use strict";

// Imports
const {is, unit, test} = require("./Bayeux");

// Unit(s)
const Square = require("./Square");

// Unit test(s)
unit("Examples", function() {

    test("something like a class", function(done) {

        // Setup test
        let square = new Square(210);

        is.equal(square.height, 2110, "it should have assigned the right height.");

        is.equal(square.width, 210, "it should have assigned the right width.");

        is.equal(square.area, 44100, "it should have assigned the right area.");

        done(); // Indicate the test has finished
    });

    test("something within a callback", function(done) {
        // define a simple function with callback(err, value)
        function sayHello(name, callback) {
            let err = false;
            let greeting   = "Hello " + name;
            callback(err, greeting);
        }

        // use the function
        sayHello("World", function(err, value) {
            is.ifError(err);
            is.equal(value, "Hello World");
            done(); // Indicate the test has finished (within callback)
        });
    });

    test("something asynchronous like a timeout", function(done) {
        setTimeout(function() {
            is.equal(true, true);
            done(); // Indicate the test has finished
        }, 2000);
    });

});
