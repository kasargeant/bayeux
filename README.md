# BAYEUX [![npm](https://img.shields.io/npm/v/bayeux.svg)]() [![Build Status](https://travis-ci.org/kasargeant/bayeux.svg?branch=master)](https://travis-ci.org/kasargeant/tinter)  [![Coverage Status](https://coveralls.io/repos/github/kasargeant/bayeux/badge.svg?branch=master)](https://coveralls.io/github/kasargeant/bayeux?branch=master)

![Bayeux](/docs/img/bayeux_tapestry.png)

A simple, reliable and pragmatic JavaScript test framework.

**(Warning: Pre-alpha software, not yet production-ready.)**

## WHY?

The APIs of today's mainstream test frameworks are verbose.  And why?...

...when in fact almost all tests that you could possibly write for a unit can be achieved with little more than 'assert', the occassion snapshot match and the even more occasional little bit of mocking.  Oh and coverage... which should be automatic anyway.

So why should I as a developer have to deal with learning Mocha, Jasmine, Jest and then all their little quirks, gaps and differences - as I work on different we projects??? What a waste of time and energy!

So I looked for something better... and I found it.  It was called TAP.  With much to like in its simple implementation and much that inspired in its design and principles - TAP for a time seemed like it could become the core of my development workflow.  

However, although I loved its "minimal"... I didn't love its plain "missing"!  I didn't like the fact that it didn't offer a real end-to-end solution for my typical testing needs. And also, being honest, I didn't find the actual TAP report format itself very human or JS friendly.  I wanted simple, easily parseable JSON instead!

So, following the essential principles of TAP... but updating it with the snapshot and mocking tooling that I needed for real production work... I wrote Bayeux.

I hope it proves as useful to you as it is proving itself to me! :)

## FEATURES

* No *magic* globals like: 'describe' and 'it'. 
* And no *black magic* behind-the-scenes either!  Test code runs the same as ordinary code.
* Doesn't require a special test runner... although one's including for printing 'pretty' reports.
* Tiny test vocabulary means you can get your tests written quickly.
* Out-the-box snapshot testing means that you can make complex tests considerably less brittle.
* Learn entire API in around a minute! ;)

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
 
