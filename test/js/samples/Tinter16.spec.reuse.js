/**
 * @file Tinter16.spec.js
 * @description Unit tests for the Tinter Class (Node/16-color [using CSS4 Named colors]).
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE.txt file included in this distribution.
 */

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

        when("it can style a string in 16-color consoles.").test("./Tinter16.unit.js", "single style");
        when("it can style a string in 256-color consoles.").test("./Tinter256.unit.js", "single style");
        when("it can style a string in TrueColor consoles.").test("./Tinter16M.unit.js", "single style");

        done(); // Indicate the test is done.
    });

    can("encode all foreground color directives", function(done) {

        when("it can mark string as").test("./Tinter16.unit.js", "single foreground color");

        done(); // Indicate the test is done.
    });

    can("encode all background color directives", function(done) {

        when("it can mark string as").test("./Tinter16.unit.js", "single background color");

        done(); // Indicate the test is done.
    });

    can("encode all composite color/style directives", function(done) {

        when("it marks a string with overlapping characteristics.").expect(Tinter.style(DUMMY_STRING, "yellow", "blue", "italic"), `\x1b[3m\x1b[1m\x1b[104m\x1b[1m\x1b[93m${DUMMY_STRING}\x1b[0m`);
        // expect(Tinter.rgb(DUMMY_STRING, [255,255,127], [192, 0, 55], "underline"), `\x1b[4m\x1b[1m\x1b[101m\x1b[1m\x1b[93m${DUMMY_STRING}\x1b[0m`, "it should degrade a truecolor to 16-color appropriately.");
        done(); // Indicate the test is done.
    });


    can("use standard and well-known color names", function(done) {

        when("it can use ANSI named colors").test("./Tinter16.unit.js", "ANSI color naming");
        when("it can use CSS4 named colors").test("./Tinter16.unit.js", "CSS4 color naming");

        done(); // Indicate the test is done.
    });

});
