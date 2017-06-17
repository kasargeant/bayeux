/**
 * @file Tinter256.test.js
 * @description Unit tests for the Tinter Class (Node/256-color [using CSS4 Named colors]).
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE.txt file included in this distribution.
 */

"use strict";

// Import Bayeux and extract selected vocabulary.
const Bayeux = require("../../../src/js/Bayeux");
const {equal, notEqual, deepEqual, notDeepEqual, test, unit} = Bayeux.TDD();

// Unit(s)
process.env.TINTER_TEST = "256";
const Tinter = require("tinter");

// Constants
const DUMMY_STRING = "Dummy String";

// Unit test(s)
unit("Class: Tinter (Node/256-color [using CSS Named colors])", function() {

    test("Style functions", function(done) {

        equal(Tinter.reset(DUMMY_STRING), `\x1b[0m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as reset.");
        equal(Tinter.plain(DUMMY_STRING), `\x1b[0m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as plain.");
        equal(Tinter.bright(DUMMY_STRING), `\x1b[1m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as bright.");
        equal(Tinter.dim(DUMMY_STRING), `\x1b[2m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as dim.");
        equal(Tinter.italic(DUMMY_STRING), `\x1b[3m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as italic.");
        equal(Tinter.underline(DUMMY_STRING), `\x1b[4m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as underline.");
        equal(Tinter.blink(DUMMY_STRING), `\x1b[5m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as slow blink.");
        equal(Tinter.blink2(DUMMY_STRING), `\x1b[6m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as rapid blink.");
        equal(Tinter.inverse(DUMMY_STRING), `\x1b[7m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as inverse.");
        equal(Tinter.hidden(DUMMY_STRING), `\x1b[8m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as hidden.");

        done(); // Indicate the test has finished
    });

    test("Colorization functions (foreground)", function(done) {

        equal(Tinter.black(DUMMY_STRING), `\x1b[1m\x1b[38;5;16m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as black.");
        equal(Tinter.red(DUMMY_STRING), `\x1b[1m\x1b[38;5;196m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as red.");
        equal(Tinter.green(DUMMY_STRING), `\x1b[1m\x1b[38;5;34m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as green.");
        equal(Tinter.yellow(DUMMY_STRING), `\x1b[1m\x1b[38;5;226m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as yellow.");
        equal(Tinter.blue(DUMMY_STRING), `\x1b[1m\x1b[38;5;21m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as blue.");
        equal(Tinter.magenta(DUMMY_STRING), `\x1b[1m\x1b[38;5;201m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as magenta.");
        equal(Tinter.cyan(DUMMY_STRING), `\x1b[1m\x1b[38;5;51m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as cyan.");
        equal(Tinter.white(DUMMY_STRING), `\x1b[1m\x1b[38;5;231m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as white.");
        equal(Tinter.default(DUMMY_STRING), `\x1b[39m${DUMMY_STRING}`, "it should be able mark a string as default.");

        done(); // Indicate the test has finished
    });

    test("Colorization functions (background)", function(done) {

        equal(Tinter.blackBg(DUMMY_STRING), `\x1b[1m\x1b[48;5;16m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a black background.");
        equal(Tinter.redBg(DUMMY_STRING), `\x1b[1m\x1b[48;5;196m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a red background.");
        equal(Tinter.greenBg(DUMMY_STRING), `\x1b[1m\x1b[48;5;34m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a green background.");
        equal(Tinter.yellowBg(DUMMY_STRING), `\x1b[1m\x1b[48;5;226m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a yellow background.");
        equal(Tinter.blueBg(DUMMY_STRING), `\x1b[1m\x1b[48;5;21m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a blue background.");
        equal(Tinter.magentaBg(DUMMY_STRING), `\x1b[1m\x1b[48;5;201m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a magenta background.");
        equal(Tinter.cyanBg(DUMMY_STRING), `\x1b[1m\x1b[48;5;51m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a cyan background.");
        equal(Tinter.whiteBg(DUMMY_STRING), `\x1b[1m\x1b[48;5;231m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a white background.");
        equal(Tinter.defaultBg(DUMMY_STRING), `\x1b[49m${DUMMY_STRING}`, "it should be able mark a string with a default background..");

        done(); // Indicate the test has finished
    });

    test("Colorization functions (composite)", function(done) {

        equal(Tinter.style(DUMMY_STRING, "yellow", "blue", "italic"), `\x1b[3m\x1b[1m\x1b[48;5;21m\x1b[1m\x1b[38;5;226m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with overlapping characteristics.");
        equal(Tinter.rgb(DUMMY_STRING, [255,255,127], [192, 0, 55], "underline"), `\x1b[4m\x1b[1m\x1b[48;5;196m\x1b[1m\x1b[38;5;226m${DUMMY_STRING}\x1b[0m`, "it should degrade a truecolor to 16-color appropriately.");
        equal(Tinter.Black(DUMMY_STRING), `\x1b[1m\x1b[38;5;16m${DUMMY_STRING}\x1b[0m`, "it should correctly support ANSI named colors.");
        equal(Tinter.rebeccapurple(DUMMY_STRING), `\x1b[1m\x1b[38;5;97m${DUMMY_STRING}\x1b[0m`, "it should correctly support CSS4 named colors.");

        done(); // Indicate the test has finished
    });

    test("Truecolor functions", function(done) {

        // private method
        equal(Tinter._styleTruecolor(DUMMY_STRING, [255,255,127], [192, 0, 55], "underline"), `\x1b[4m\x1b[1m\x1b[48;2;192;0;55m\x1b[1m\x1b[38;2;255;255;127m${DUMMY_STRING}\x1b[0m`, "it should (privately) represent truecolor RGB values correctly - regardless of environment");
        equal(Tinter._styleTruecolor(DUMMY_STRING, [255,255,127], [192, 0, 55]), `\x1b[1m\x1b[48;2;192;0;55m\x1b[1m\x1b[38;2;255;255;127m${DUMMY_STRING}\x1b[0m`, "it should (privately) represent truecolor RGB values correctly - regardless of environment when using defaults (3 params)");
        equal(Tinter._styleTruecolor(DUMMY_STRING, [255,255,127]), `\x1b[1m\x1b[38;2;255;255;127m${DUMMY_STRING}\x1b[0m`, "it should (privately) represent truecolor RGB values correctly - regardless of environment when using defaults (2 params)");
        equal(Tinter._styleTruecolor(DUMMY_STRING), `${DUMMY_STRING}\x1b[0m`, "it should (privately) represent truecolor RGB values correctly - regardless of environment when using defaults (1 params)");

        // private method - TODO replace with rgb() to match 16M tests.
        equal(Tinter._degrade(DUMMY_STRING, [200, 10, 21], [2, 0, 200], "italic"),
            `\x1b[3m\x1b[1m\x1b[48;5;21m\x1b[1m\x1b[38;5;196m${DUMMY_STRING}\x1b[0m`,
            "it should degrade a set of truecolor RGB values correctly.");

        done(); // Indicate the test has finished
    });

    test("Color degradation functions", function(done) {

        equal(Tinter._nearest16([10, 127, 0]), "black", "it should degrade a truecolor RGB value to the correct named color - black.");
        equal(Tinter._nearest16([200, 10, 21]), "red", "it should degrade a truecolor RGB value to the correct named color - red.");
        equal(Tinter._nearest16([0, 128, 0]), "green", "it should degrade a truecolor RGB value to the correct named color - green.");
        equal(Tinter._nearest16([2, 0, 200]), "blue", "it should degrade a truecolor RGB value to the correct named color - blue.");
        equal(Tinter._nearest16([200, 128, 0]), "yellow", "it should degrade a truecolor RGB value to the correct named color - yellow.");
        equal(Tinter._nearest16([200, 10, 128]), "magenta", "it should degrade a truecolor RGB value to the correct named color - magenta.");
        equal(Tinter._nearest16([0, 200, 128]), "cyan", "it should degrade a truecolor RGB value to the correct named color - cyan.");
        equal(Tinter._nearest16([175, 200, 128]), "white", "it should degrade a truecolor RGB value to the correct named color - white.");

        done(); // Indicate the test has finished
    });

});
