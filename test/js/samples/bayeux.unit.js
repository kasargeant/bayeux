/**
 * @file bayeux.unit.js
 * @description Example Bayeux Unit Test.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE.txt file included in this distribution.
 */

"use strict";

// Import Bayeux and extract selected vocabulary.
const Bayeux = require("../../../src/js/Bayeux");
const {given, test, unit} = Bayeux.TDD();

// Import Unit
const Square = require("../../../src/js/Square");

// Constants

// Test
unit("Examples", function() {

    const someBoolean = false;
    const someNumber = 42;
    const someString = "ho!";

    test("single values", function(done) {

        given("a boolean").expect(someBoolean).toNotEqual(true);
        given("a number").expect(someNumber).toEqual(42);
        given("a string").expect(someString).toEqual("hi!");

        done(); // Indicate the test is done.
    });

    test("an instantiated class", function(done) {

        // Setup test
        let square = new Square(210);

        given("a square with a height").expect(square.height).toEqual(2110);
        given("a square with a width").expect(square.width).toEqual(210);
        given("a square with an area").expect(square.area).toEqual(44100);

        done(); // Indicate the test is done.
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
            given("a callback").expect(err).toNotBeError();
            given("a successful callback").expect(value).toEqual("Hello World");
            done(); // Indicate the test is done.
        });
    });

    test("something asynchronous like a timeout", function(done) {
        setTimeout(function() {
            given("an asynchronous function").expect(true).toEqual(true);
            done(); // Indicate the test is done.
        }, 2000);
    });


    test("a file's contents", function(done) {

        given("a file with a single line").expectFile("../../data/single_line.txt").toEqual("This is a text file - used by Bayeux unit tests.");
        given("a file with multiple lines").expectFile("../../data/multi_line.txt").toEqualSnapshot();

        done(); // Indicate the test is done.
    });


    test("spying on a function", function(done) {

        let _add = function(a, b, c) {
            return a + b + c;
        };

        _add = Bayeux.spy(_add);

        _add(0, 1, 2);
        _add(3, 4, 5);
        given("a mocked function with a call history").expect(_add.callCount).toEqual(2);


        done(); // Indicate the test is done.
    });


    test("spying with an anonymous function", function(done) {

        let spy = Bayeux.spy();

        let someFunction = function(callback) {
            let someResult = 10;
            callback();
            callback();
            return someResult;
        };

        someFunction(spy);

        given("a function that operates on another function").expect(spy.callCount).toEqual(2);

        done(); // Indicate the test is done.
    });


    test("mocking an object", function(done) {

        let someObject = {
            val: 10,
            // get val() { return val; },                   // INSERTED FOR PROPERTY SPYING
            // set val(value) { this.val = value; },       // INSERTED FOR PROPERTY SPYING
            add: function(a, b) {
                return a + b;
            }
        };

        let mockObject = Bayeux.mock(someObject);
        mockObject.add.returns(3);

        // Check that object behavior is as expected/defined.
        given("a mocked object with a property").expect(mockObject.val).toEqual(10);
        given("a mocked object with a method").expect(mockObject.add(1, 2)).toEqual(3);

        // Check that spy functionality is available.
        given("a function that operates on another function").expect(mockObject.add.callCount).toEqual(1);

        done(); // Indicate the test is done.
    });

});
