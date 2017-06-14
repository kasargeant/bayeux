/**
 * @file Tinter16M.test.js
 * @description Unit tests for the Tinter Class (Node/16M+ truecolor [using CSS4 Named colors]).
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE.txt file included in this distribution.
 */

"use strict";

// Imports
const {is, test, unit} = require("../../../src/js/Bayeux");

// Unit(s)
process.env.TINTER_TEST = "16M";
const Tinter = require("tinter");

// Constants
const DUMMY_STRING = "Dummy String";

// Unit test(s)
unit("Class: Tinter (Node/16M+ truecolor [using CSS Named colors])", function() {

    test("Style functions", function(done) {

        is.equal(Tinter.reset(DUMMY_STRING), `\x1b[0m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as reset.");
        is.equal(Tinter.plain(DUMMY_STRING), `\x1b[0m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as plain.");
        is.equal(Tinter.bright(DUMMY_STRING), `\x1b[1m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as bright.");
        is.equal(Tinter.dim(DUMMY_STRING), `\x1b[2m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as dim.");
        is.equal(Tinter.italic(DUMMY_STRING), `\x1b[3m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as italic.");
        is.equal(Tinter.underline(DUMMY_STRING), `\x1b[4m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as underline.");
        is.equal(Tinter.blink(DUMMY_STRING), `\x1b[5m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as slow blink.");
        is.equal(Tinter.blink2(DUMMY_STRING), `\x1b[6m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as rapid blink.");
        is.equal(Tinter.inverse(DUMMY_STRING), `\x1b[7m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as inverse.");
        is.equal(Tinter.hidden(DUMMY_STRING), `\x1b[8m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as hidden.");

        done(); // Indicate the test has finished
    });

    test("Colorization functions (foreground)", function(done) {

        is.equal(Tinter.black(DUMMY_STRING), `\x1b[1m\x1b[38;2;0;0;0m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as black.");
        is.equal(Tinter.red(DUMMY_STRING), `\x1b[1m\x1b[38;2;255;0;0m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as red.");
        is.equal(Tinter.green(DUMMY_STRING), `\x1b[1m\x1b[38;2;0;128;0m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as green.");
        is.equal(Tinter.yellow(DUMMY_STRING), `\x1b[1m\x1b[38;2;255;255;0m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as yellow.");
        is.equal(Tinter.blue(DUMMY_STRING), `\x1b[1m\x1b[38;2;0;0;255m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as blue.");
        is.equal(Tinter.magenta(DUMMY_STRING), `\x1b[1m\x1b[38;2;255;0;255m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as magenta.");
        is.equal(Tinter.cyan(DUMMY_STRING), `\x1b[1m\x1b[38;2;0;255;255m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as cyan.");
        is.equal(Tinter.white(DUMMY_STRING), `\x1b[1m\x1b[38;2;255;255;255m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as white.");
        is.equal(Tinter.default(DUMMY_STRING), `\x1b[39m${DUMMY_STRING}`, "it should be able mark a string as default.");

        done(); // Indicate the test has finished
    });

    test("Colorization functions (background)", function(done) {

        is.equal(Tinter.blackBg(DUMMY_STRING), `\x1b[1m\x1b[48;2;0;0;0m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a black background.");
        is.equal(Tinter.redBg(DUMMY_STRING), `\x1b[1m\x1b[48;2;255;0;0m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a red background.");
        is.equal(Tinter.greenBg(DUMMY_STRING), `\x1b[1m\x1b[48;2;0;128;0m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a green background.");
        is.equal(Tinter.yellowBg(DUMMY_STRING), `\x1b[1m\x1b[48;2;255;255;0m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a yellow background.");
        is.equal(Tinter.blueBg(DUMMY_STRING), `\x1b[1m\x1b[48;2;0;0;255m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a blue background.");
        is.equal(Tinter.magentaBg(DUMMY_STRING), `\x1b[1m\x1b[48;2;255;0;255m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a magenta background.");
        is.equal(Tinter.cyanBg(DUMMY_STRING), `\x1b[1m\x1b[48;2;0;255;255m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a cyan background.");
        is.equal(Tinter.whiteBg(DUMMY_STRING), `\x1b[1m\x1b[48;2;255;255;255m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a white background.");
        is.equal(Tinter.defaultBg(DUMMY_STRING), `\x1b[49m${DUMMY_STRING}`, "it should be able mark a string with a default background..");

        done(); // Indicate the test has finished
    });

    test("Colorization functions (composite)", function(done) {

        is.equal(Tinter.style(DUMMY_STRING, "yellow", "blue", "italic"), `\x1b[3m\x1b[1m\x1b[48;2;0;0;255m\x1b[1m\x1b[38;2;255;255;0m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with overlapping characteristics.");
        is.equal(Tinter.rgb(DUMMY_STRING, [255,255,127], [192, 0, 55], "underline"), `\x1b[4m\x1b[1m\x1b[48;2;192;0;55m\x1b[1m\x1b[38;2;255;255;127m${DUMMY_STRING}\x1b[0m`, "it should degrade a truecolor to 16-color appropriately.");
        is.equal(Tinter.Black(DUMMY_STRING), `\x1b[1m\x1b[38;2;0;0;0m${DUMMY_STRING}\x1b[0m`, "it should correctly support ANSI named colors.");
        is.equal(Tinter.rebeccapurple(DUMMY_STRING), `\x1b[1m\x1b[38;2;102;51;153m${DUMMY_STRING}\x1b[0m`, "it should correctly support CSS4 named colors.");

        done(); // Indicate the test has finished
    });

    test("Truecolor functions", function(done) {

        // private method
        is.equal(Tinter._styleTruecolor(DUMMY_STRING, [255,255,127], [192, 0, 55], "underline"), `\x1b[4m\x1b[1m\x1b[48;2;192;0;55m\x1b[1m\x1b[38;2;255;255;127m${DUMMY_STRING}\x1b[0m`, "it should (privately) represent truecolor RGB values correctly - regardless of environment");
        is.equal(Tinter._styleTruecolor(DUMMY_STRING, [255,255,127], [192, 0, 55]), `\x1b[1m\x1b[48;2;192;0;55m\x1b[1m\x1b[38;2;255;255;127m${DUMMY_STRING}\x1b[0m`, "it should (privately) represent truecolor RGB values correctly - regardless of environment when using defaults (3 params)");
        is.equal(Tinter._styleTruecolor(DUMMY_STRING, [255,255,127]), `\x1b[1m\x1b[38;2;255;255;127m${DUMMY_STRING}\x1b[0m`, "it should (privately) represent truecolor RGB values correctly - regardless of environment when using defaults (2 params)");
        is.equal(Tinter._styleTruecolor(DUMMY_STRING), `${DUMMY_STRING}\x1b[0m`, "it should (privately) represent truecolor RGB values correctly - regardless of environment when using defaults (1 params)");

        // public method
        is.equal(Tinter.rgb(DUMMY_STRING, [255,255,127], [192, 0, 55], "underline"), `\x1b[4m\x1b[1m\x1b[48;2;192;0;55m\x1b[1m\x1b[38;2;255;255;127m${DUMMY_STRING}\x1b[0m`, "it should NOT degrade truecolor RGB values in a 16M+ color environment");
        is.equal(Tinter.rgb(DUMMY_STRING, [255,255,127], [192, 0, 55]), `\x1b[0m\x1b[1m\x1b[48;2;192;0;55m\x1b[1m\x1b[38;2;255;255;127m${DUMMY_STRING}\x1b[0m`, "it should NOT degrade truecolor RGB values in a 16M+ color environment when using defaults (3 params)");
        is.equal(Tinter.rgb(DUMMY_STRING, [255,255,127]), `\x1b[0m\x1b[1m\x1b[48;2;0;0;0m\x1b[1m\x1b[38;2;255;255;127m${DUMMY_STRING}\x1b[0m`, "it should NOT degrade truecolor RGB values in a 16M+ color environment when using defaults (2 params)");
        is.equal(Tinter.rgb(DUMMY_STRING), `\x1b[0m\x1b[1m\x1b[48;2;0;0;0m\x1b[1m\x1b[38;2;255;255;255m${DUMMY_STRING}\x1b[0m`, "it should NOT degrade truecolor RGB values in a 16M+ color environment when using defaults (1 params)");

        done(); // Indicate the test has finished
    });











    test("Color degradation functions", function(done) {

        is.equal(Tinter._nearest16([10, 127, 0]), "black", "it should degrade a truecolor RGB value to the correct named color - black.");
        is.equal(Tinter._nearest16([200, 10, 21]), "red", "it should degrade a truecolor RGB value to the correct named color - red.");
        is.equal(Tinter._nearest16([0, 128, 0]), "green", "it should degrade a truecolor RGB value to the correct named color - green.");
        is.equal(Tinter._nearest16([2, 0, 200]), "blue", "it should degrade a truecolor RGB value to the correct named color - blue.");
        is.equal(Tinter._nearest16([200, 128, 0]), "yellow", "it should degrade a truecolor RGB value to the correct named color - yellow.");
        is.equal(Tinter._nearest16([200, 10, 128]), "magenta", "it should degrade a truecolor RGB value to the correct named color - magenta.");
        is.equal(Tinter._nearest16([0, 200, 128]), "cyan", "it should degrade a truecolor RGB value to the correct named color - cyan.");
        is.equal(Tinter._nearest16([175, 200, 128]), "white", "it should degrade a truecolor RGB value to the correct named color - white.");

        done(); // Indicate the test has finished
    });

});
