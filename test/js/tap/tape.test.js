/**
 * @file Tinter16.test.js
 * @description Unit tests for the Tinter Class (Node/16-color ANSI).
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE.txt file included in this distribution.
 */

"use strict";

// Imports
const test = require("tape").test;
let stream = test.createStream({objectMode: true}).on("data", function(row) {
    console.log(JSON.stringify(row));
});

// Unit
const Square = require("../../../../warhorse/test/data/client_src/js/Square");

// Tests
test("Square class.", function(is) {

    // Setup test
    let square = new Square(210);

    // Assert - it should have assigned the right height.
    is.equal(square.height, 2110, "it should have assigned the right height.");

    // Assert - it should have assigned the right width.
    is.equal(square.width, 210, "it should have assigned the right width.");

    // Assert - it should have calculated the correct area.
    is.equal(square.area, 44100, "it should have assigned the right area.");

    is.end(); // Indicate the test has finished
});

test("Square class2.", function(is) {

    // Setup test
    let square = new Square(210);

    // Assert - it should have assigned the right height.
    is.equal(square.height, 210, "it should have assigned the right height.");

    // Assert - it should have assigned the right width.
    is.equal(square.width, 2100, "it should have assigned the right width.");

    // Assert - it should have calculated the correct area.
    is.equal(square.area, 44100, "it should have assigned the right area.");

    is.end(); // Indicate the test has finished
});

test("Square class3.", function(is) {

    // Setup test
    let square = new Square(210);

    // Assert - it should have assigned the right height.
    is.equal(square.height, 210, "it should have assigned the right height.");

    // Assert - it should have assigned the right width.
    is.equal(square.width, 210, "it should have assigned the right width.");

    // Assert - it should have calculated the correct area.
    is.equal(square.area, 441100, "it should have assigned the right area.");

    is.end(); // Indicate the test has finished
});