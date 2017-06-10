"use strict";

// Imports
const Bayeux = require("./Bayeux");
const is = new Bayeux();
const unit = is.unit;
const test = is.test;
// const report = require("./bt").report;

const Square = require("./Square");

is.unit("Class: Square", function() {

    is.test("Square class.", function(done) {

        // Setup test
        let square = new Square(210);

        // Assert - it should have assigned the right height.
        is.equal(square.height, 2110, "it should have assigned the right height.");

        // Assert - it should have assigned the right width.
        is.equal(square.width, 210, "it should have assigned the right width.");

        // Assert - it should have calculated the correct area.
        is.equal(square.area, 44100, "it should have assigned the right area.");

        done(); // Indicate the test has finished
    });

    is.test("Square class2.", function(done) {

        // Setup test
        let square = new Square(210);

        // Assert - it should have assigned the right height.
        is.equal(square.height, 210, "it should have assigned the right height.");

        // Assert - it should have assigned the right width.
        is.equal(square.width, 2100, "it should have assigned the right width.");

        // Assert - it should have calculated the correct area.
        is.equal(square.area, 44100, "it should have assigned the right area.");

        done(); // Indicate the test has finished
    });

    is.test("Square class3.", function(done) {

        // Setup test
        let square = new Square(210);

        // Assert - it should have assigned the right height.
        is.equal(square.height, 210, "it should have assigned the right height.");

        // Assert - it should have assigned the right width.
        is.equal(square.width, 210, "it should have assigned the right width.");

        // Assert - it should have calculated the correct area.
        is.equal(square.area, 44100, "it should have assigned the right area.");

        done(); // Indicate the test has finished
    });

    is.test("SOMETHNG DIFFERENT", function(done) {
        // define a simple function with callback(err, value)
        function sayHello(name, callback) {
            var error = false;
            var str   = "Hello " + name;
            callback(error, str);
        }

        // use the function
        sayHello("World", function(err, value) {
            is.ifError(err);
            is.equal(value, "Hello World");
            done(); // Indicate the test has finished
        });
    });

    is.test("SOMETHNG ASYNC AND TIMED", function(done) {
        setTimeout(function() {
            is.equal(true, true);
            done(); // Indicate the test has finished
        }, 2000);
    });

});
