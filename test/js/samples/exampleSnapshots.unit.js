/**
 * @file exampleSnapshots.unit.js
 * @description Example Bayeux Unit Test: Snapshot tests.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE.txt file included in this distribution.
 */

"use strict";

// Import Bayeux and extract selected vocabulary.
const Bayeux = require("../../../src/js/Bayeux");
const {given, test, unit} = Bayeux.TDD();

// Constants

// Unit test(s)
unit("Example: Snapshot Matching", function() {

    test("a snapshot", function(done) {

        // Setup test
        let obj = {
            name: "Joe",
            age: 22
        };
        given("a known object").expect(obj).toEqualSnapshot();

        done(); // Indicate the test has finished
    });

});