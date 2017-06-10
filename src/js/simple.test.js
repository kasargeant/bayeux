"use strict";

// Imports
const Bayeux = require("./Bayeux");
const is = new Bayeux();
const unit = require("./bt").unit;
const test = require("./bt").test;
const report = require("./bt").report;

const Square = require("./Square");



unit("Class: Square", function() {

    test("Square class.", function() {

        // Setup test
        let square = new Square(210);

        // Assert - it should have assigned the right height.
        is.equal(square.height, 2110, "it should have assigned the right height.");

        // Assert - it should have assigned the right width.
        is.equal(square.width, 210, "it should have assigned the right width.");

        // Assert - it should have calculated the correct area.
        is.equal(square.area, 44100, "it should have assigned the right area.");

        // done(); // Indicate the test has finished
    });

    test("Square class2.", function() {

        // Setup test
        let square = new Square(210);

        // Assert - it should have assigned the right height.
        is.equal(square.height, 210, "it should have assigned the right height.");

        // Assert - it should have assigned the right width.
        is.equal(square.width, 2100, "it should have assigned the right width.");

        // Assert - it should have calculated the correct area.
        is.equal(square.area, 44100, "it should have assigned the right area.");

        // done(); // Indicate the test has finished
    });

    test("Square class3.", function() {

        // Setup test
        let square = new Square(210);

        // Assert - it should have assigned the right height.
        is.equal(square.height, 210, "it should have assigned the right height.");

        // Assert - it should have assigned the right width.
        is.equal(square.width, 210, "it should have assigned the right width.");

        // Assert - it should have calculated the correct area.
        is.equal(square.area, 44100, "it should have assigned the right area.");

        // done(); // Indicate the test has finished
    });

    test("SOMETHNG DIFFERENT", function() {
        // define a simple function with callback(err, value)
        function sayHello(name, callback) {
            var error = false;
            var str   = "Hello " + name;
            callback(error, str);
        }

// use the function
        sayHello("World", function(err, value){
            is.ifError(err);
            is.equal(value, "Hello World");
        });
    });

    test("SOMETHNG ASYNC AND TIMED", function(done) {
        setTimeout(function() {
            is.equal(true, true);
            done();
        }, 2000);
    });

    report(); // Indicate the test has finished
});