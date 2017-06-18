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

## GOALS (i.e. future FEATURES)

### Design goals

* To dramatically reduce the "bar" (effort) needed by developers and testers to produce good comprehensive test coverage across typical JS code.
* To offer a test framework that out-the-box facilitates: TDD, BDD and SBE... "views" on an application.
* To support the more useful "beyond assert" test features: snapshots, mocking (and auto-mocking).  Not a tool for everything by design.
* To support reuse between tests.  Most common case being reusing selected parts of unit tests to satisfy use case/feature tests.
* To automate (as far as possible) the WRITING of tests.
* To automate completely the writing of specification and test reports.
* To have tiny, but capable, test vocabulary in order to be easy to learn - and to keep tests readable but short.

### Implementational Goals

* To use an absolutely minimal "must-haves-only" API with no reliance on global variables or global keywords.  
* To support tests(test suites) that require no special "runner" but execute like normal JS code. i.e. ad hoc from the command line.
* To support test process isolation.
* To be usable from the command-line and/or from a typical IDE environment e.g. WebStorm or VSE.
* To be fast.

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

// Import Bayeux and extract selected vocabulary.
const Bayeux = require("../../../src/js/Bayeux");
const {given, test, unit} = Bayeux.TDD();

// Import Unit
const Square = require("../../../src/js/Square");

// Constants

// Test
unit("Example: Simple unit test", function() {

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

});
```

## USAGE: Specification tests

```javascript
"use strict";

// Import Bayeux and extract selected vocabulary.
const Bayeux = require("../../../src/js/Bayeux");
const {can, feature, when} = Bayeux.BDD();

// Unit(s)
process.env.TINTER_TEST = "16";
const Tinter = require("tinter");

// Constants
const DUMMY_STRING = "Dummy String";

// Specification
feature("styles and colors correctly in a 16-color console environment", function() {

    can("encode all style directives", function(done) {

        when("it can mark a string as reset.").expect(Tinter.reset(DUMMY_STRING)).toEqual(`\x1b[0m${DUMMY_STRING}\x1b[0m`);
        when("it can mark a string as plain.").expect(Tinter.plain(DUMMY_STRING)).toEqual(`\x1b[0m${DUMMY_STRING}\x1b[0m`);
        when("it can mark a string as bright.").expect(Tinter.bright(DUMMY_STRING)).toEqual(`\x1b[1m${DUMMY_STRING}\x1b[0m`);
        when("it can mark a string as dim.").expect(Tinter.dim(DUMMY_STRING)).toEqual(`\x1b[2m${DUMMY_STRING}\x1b[0m`);

        done(); // Indicate the test is done.
    });

});
```

## DOCUMENTATION

The entire Bayeux testing API is short, predicable and should offer no 'surprises':-

### BDD: Specification test vocabulary

Every specification test describes one and only one 'feature':-

    feature("Import special .xyz reports.", function() {
    
        // Some tests...
    
    });

Inside a feature function block you can list what the software must be able to do - to fulfil the feature's requirements:-

    can("load the different formats that .xyz reports use", function(done) {
    
        // Specific cases...
    
        done(); // Indicate the test is done.
    });

And inside an ability block ("can"), specific checks (assertions/expectations) are done using a single syntax:-

    when("it can do something or other").expect(theActualValue).toEqual(theExpectedValue);

So a very simple but complete specification test might be:-

    feature("Import special .xyz reports.", function() {
    
        can("load the different formats that .xyz reports use", function(done) {
        
            when("it can load ZTAR format data.").expect(theActualValue).toEqual(theExpectedValue);   
            when("it can load streamed STT format data.").expect(theActualValue).toEqual(theExpectedValue);   
            when("it can load NEW format data.").expect(theActualValue).toEqual(theExpectedValue);   
                 
            done(); // Indicate the test is done.
        });    
        
    });

In addition, specification tests can *reuse* existing unit tests - in order to fulfill their feature specification.  And to save the developer time...! ;)

    when("it can load ZTAR format data.").test("./LoaderZTAR.unit.js", "loadFileXYZ");

Bayeux will understand from this directive that you want the results of specific unit test - passed up to the calling specification check.  


### TDD: Unit test vocabulary

Every unit test has one and only one 'unit' function block:-

    unit("Examples", function() {
    
        // Some tests...
    
    });

Inside a unit function block you can list the tests you want executed on that unit:-

    test("single values", function(done) {

        // Some assertions...

        done(); // Indicate the test is done.
    });

And inside a test, individual checks (assertions/expectations) are done using a single syntax:-

    given("some thing/object/action/value").expect(theActualValue).toEqual(theExpectedValue);

So a simple but complete specification test might be:-

    unit("Object: Value Store", function() {
    
        let store = new Storage();

        test("variable storage", function(done) {
    
            given("a key with a number value").expect(store.get("someKey")).toEqual(1234);
            given("a key with a string value").expect(store.get("someOtherKey")).toEqual("someValue");
            given("a key with an object value")
                .expect(store.get("someObjKey"))
                .toEqualSnapshot();
    
            done(); // Indicate the test is done.
        });
    });

#### Equality/Inequality

To test whether the two parameters are equal:-
    
    toEqual(actual, expected[, isStrict])

To test whether the two parameters are not equal:-
    
    toNotEqual(actual, expected[, isStrict])

To test whether the two parameters are deep equal:-

    toDeepEqual(actual, expected[, isStrict])

To test whether the two parameters are not deep equal:-

    toNotDeepEqual(actual, expected[, isStrict])

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
 
