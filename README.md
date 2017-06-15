# BAYEUX [![npm](https://img.shields.io/npm/v/bayeux.svg)]() [![Build Status](https://travis-ci.org/kasargeant/bayeux.svg?branch=master)](https://travis-ci.org/kasargeant/tinter)  [![Coverage Status](https://coveralls.io/repos/github/kasargeant/bayeux/badge.svg?branch=master)](https://coveralls.io/github/kasargeant/bayeux?branch=master)

![Bayeux](/docs/img/bayeux_tapestry.png)

A simple and pragmatic test framework - designed for minimalists!

**(Warning: Pre-alpha software, not yet production-ready.)**

## WHY?

The APIs of today's mainstream test frameworks are verbose.  And why?...

...when in fact almost all tests that you could possibly write for a unit can be achieved with little more than 'assert', the occasional snapshot match and the even more occasional bit of mocking.  Oh and coverage... which should be automatic anyway.

So why should I as a developer have to deal with learning Mocha, Jasmine, Jest and then all their little quirks, gaps and differences - as I move from team/project to team/project in my professional career.  What a waste of time and energy!

So I looked for something better, something like a standard... and I found it.  It was called [TAP](https://testanything.org/).  With much to like in its simple implementation and much that inspired in its design and principles.  And TAP, for a time, seemed like it could become the core of my development workflow.  

However, although I loved its "minimal"... I didn't love its plain "missing"!  I didn't like the fact that it didn't offer a real end-to-end solution for my typical testing needs. And also, being honest, I didn't find the actual TAP report format itself - either - very human - or - very JS friendly!  I wanted simple, easily parseable JSON instead!

So, following the essential principles of TAP... but updating it with the snapshot and mocking tooling that I needed for real production work... I wrote Bayeux.

I hope it proves as useful to you as it is proving itself to me! :)

## FEATURES

* Tiny, but capable, test vocabulary (even smaller than TAP!) means you can get your tests written quickly.
* Out-the-box snapshot testing means that you can make complex tests considerably less brittle.
* No *magic* globals like: 'describe' and 'it' - everything used is clearly imported. 
* And no *black magic* behind-the-scenes either!  Test code runs the same as ordinary code.
* Doesn't require a special test runner... although one's including for printing 'pretty' reports.
* Extremely fast.
* Learn entire API in around a minute! ;)


## INSTALLATION

    npm install bayeux

## USAGE: CLI (Command Line Interface)
    
```
    Usage
      $ bayeux <flags> <path>

    Arguments:
      flags,        (Detailed in the section below.)
      path          Path to the unit test(s).  Can be glob.

    Flags:
      --conf,       -c  Use a specific configuration file.
      --debug,      -d  Operate in verbose debug mode.
      --generate,   -h  Generates a unit test script for the required file.
      --help,       -h  Shows this information.
      --cover,      -r  Provide coverage stats whilst executing tests.
      --update,     -u  Force update of all snapshots.
      --version,    -v  Shows Warhorse CLI version.

    Examples
      $ bayeux test/*.test.js
      $ bayeux --conf ./conf/bayeux.json
      $ bayeux --cover specific.test.js
      $ bayeux -d -u ./test/**/*.test.js
```

## USAGE: Unit tests

I always think examples are the best docs!  So here's a complete but simple working example:-

```javascript
"use strict";

// Imports
const {is, test, unit} = require("../js/Bayeux");

// Unit test(s)
unit("it will test the class: Square", function() {

    // Setup
    let actualBoolean = true;
    let actualNumber = 42;
    let actualString = "hi!";
    let actualObj = {
        word: "here",
        valid: true
    };
    let expectedObj = {
        word: "here",
        valid: true
    };

    test("it should correctly match some values.", function(done) {

        is.equal(actualBoolean, true, "it does correctly match equality of booleans.");

        is.equal(actualNumber, 42, "it does correctly match equality of numbers.");

        is.notEqual(actualString, "ho!", "it does correctly match inequality of strings.");

        is.equalDeep(actualObj, expectedObj, "it does correctly match deep equality of objects.");

        done(); // Indicate the test has finished
    });

    test("it should be able to test something that uses a callback", function(done) {
        // define a simple function with callback(err, value)
        function sayHello(name, callback) {
            let err = false;
            let greeting   = "Hello " + name;
            callback(err, greeting);
        }

        // use the function
        sayHello("World", function(err, value) {
            is.error(err);
            is.equal(value, "Hello World", "it does have the right name within the callback.");
            done(); // Indicate the test has finished (within callback)
        });
    });

    test("it should function asynchronously when using a timeout", function(done) {
        setTimeout(function() {
            is.equal(true, true, "it does correctly trigger a timeout.");
            done(); // Indicate the test has finished
        }, 2000);
    });

});
```

## DOCUMENTATION

The entire Bayeux testing API is short, predicable and should offer no 'surprises':-

#### Equality/Inequality

To test whether the two parameters are equal:-
    
    is.equal(actual, expected, msg[, isStrict])

To test whether the two parameters are not equal:-
    
    is.notEqual(actual, expected, msg[, isStrict])

To test whether the two parameters are deep equal:-

    is.equalDeep(actual, expected, msg[, isStrict])

To test whether the two parameters are not deep equal:-

    is.notEqualDeep(actual, expected, msg[, isStrict])

#### Catching and Throwing Errors

To test whether any error (or a specific error) was thrown:-

    is.thrown(block, msg)

To test whether any error (or a specific error) was not thrown:-

    is.notThrown(block, msg)

To test whether actual is an error - and if so - it then throws it:-
 
    is.error(actual, expected, msg)

#### Truthiness and Falsiness

To test whether the single given parameter is 'truthy':-

    is.truthy(actual, msg)

To test whether the single given parameter is 'falsey':-

    is.falsey(actual, msg) (NOTE: TO BE IMPLEMENTED)

#### Misc.

To trigger an automatic test 'fail' or 'pass', there is:-

    is.fail(msg)
    is.pass(msg)


And that's it! ;)

## LICENSE INFORMATION
 
 Please see LICENSE.txt included in this distribution.
 
