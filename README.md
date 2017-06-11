# BAYEUX [![npm](https://img.shields.io/npm/v/bayeux.svg)]() [![Build Status](https://travis-ci.org/kasargeant/bayeux.svg?branch=master)](https://travis-ci.org/kasargeant/tinter)  [![Coverage Status](https://coveralls.io/repos/github/kasargeant/bayeux/badge.svg?branch=master)](https://coveralls.io/github/kasargeant/bayeux?branch=master)

A simple, reliable and pragmatic JavaScript test framework.

**(Warning: Pre-alpha software, not yet production-ready.)**

## FEATURES

* No *magic* globals like: 'describe' and 'it'. 
* And no *black magic* behind-the-scenes either!  Test code runs the same as ordinary code.
* Doesn't require a special test runner... although one's including for printing 'pretty' reports.
* Tiny test vocabulary means you can get your tests written quickly.
* Out-the-box snapshot testing means that you can make complex tests considerably less brittle.
* In short, it's: super f'cking simple, super f'cking solid and super f*cking fast!

> ...how much more do *you people* want!!!


## INSTALLATION

    npm install bayeux

## USAGE

I always think examples are the best docs!  So here's a complete but simple working example:-

```javascript
"use strict";

// Imports
const {is, unit, test} = require("../../src/js/Bayeux");

// Unit(s)
const Square = require("../../src/js/Square");

// Unit test(s)
unit("Examples", function() {

    test("something simple like a value", function(done) {

        let someBoolean = false;
        let someNumber = 42;
        let someString = "hi!";
        
        is.notEqual(someBoolean, true, "it should be able to compare booleans for inequality.");

        is.equal(someNumber, 42, "it should be able to compare numbers for equality.");

        is.equal(someString, "hi!", "it should be able to compare strings for equality.");

        done(); // Indicate the test has finished
    });

    test("something like a class", function(done) {

        // Setup test
        let square = new Square(210);

        is.equal(square.height, 2110, "it should have assigned the correct height.");

        is.equal(square.width, 210, "it should have assigned the correct width.");

        is.equal(square.area, 44100, "it should have calculated the correct area.");

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
```


## DOCUMENTATION

## LICENSE INFORMATION
 
 Please see LICENSE.txt included in this distribution.
 
