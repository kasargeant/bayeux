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
const {describe, it, expect} = Bayeux.BDD();

// Unit(s)
process.env.TINTER_TEST = "16";
const Tinter = require("tinter");

// Constants
const DUMMY_STRING = "Dummy String";

// Unit it(s)
describe("Class: Tinter (Node/16-color [using CSS Named colors])", function() {

    it("should correctly encode all style directives.", function(done) {
        expect(Tinter.reset(DUMMY_STRING)).toEqual(`\x1b[0m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as reset.");
        expect(Tinter.plain(DUMMY_STRING)).toEqual(`\x1b[0m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as plain.");
        expect(Tinter.bright(DUMMY_STRING)).toEqual(`\x1b[1m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as bright.");
        expect(Tinter.dim(DUMMY_STRING)).toEqual(`\x1b[2m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as dim.");
        expect(Tinter.italic(DUMMY_STRING)).toEqual(`\x1b[3m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as italic.");
        expect(Tinter.underline(DUMMY_STRING)).toEqual(`\x1b[4m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as underline.");
        expect(Tinter.blink(DUMMY_STRING)).toEqual(`\x1b[5m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as slow blink.");
        expect(Tinter.blink2(DUMMY_STRING)).toEqual(`\x1b[6m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as rapid blink.");
        expect(Tinter.inverse(DUMMY_STRING)).toEqual(`\x1b[7m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as inverse.");
        expect(Tinter.hidden(DUMMY_STRING)).toEqual(`\x1b[8m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as hidden.");

        done(); // Indicate the test has finished
    });

    it("Colorization functions (foreground)", function(done) {

        expect(Tinter.black(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[30m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as black.");
        expect(Tinter.red(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[91m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as red.");
        expect(Tinter.green(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[32m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as green.");
        expect(Tinter.yellow(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[93m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as yellow.");
        expect(Tinter.blue(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[94m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as blue.");
        expect(Tinter.magenta(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[95m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as magenta.");
        expect(Tinter.cyan(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[96m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as cyan.");
        expect(Tinter.white(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[97m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string as white.");
        expect(Tinter.default(DUMMY_STRING)).toEqual(`\x1b[39m${DUMMY_STRING}`, "it should be able mark a string as default.");

        done(); // Indicate the test has finished
    });

    it("Colorization functions (background)", function(done) {

        expect(Tinter.blackBg(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[40m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a black background.");
        expect(Tinter.redBg(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[101m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a red background.");
        expect(Tinter.greenBg(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[42m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a green background.");
        expect(Tinter.yellowBg(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[103m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a yellow background.");
        expect(Tinter.blueBg(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[104m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a blue background.");
        expect(Tinter.magentaBg(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[105m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a magenta background.");
        expect(Tinter.cyanBg(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[106m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a cyan background.");
        expect(Tinter.whiteBg(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[107m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a white background.");
        expect(Tinter.defaultBg(DUMMY_STRING)).toEqual(`\x1b[49m${DUMMY_STRING}`, "it should be able mark a string with a default background..");

        done(); // Indicate the test has finished
    });

    it("Colorization functions (composite)", function(done) {

        expect(Tinter.style(DUMMY_STRING, "yellow", "blue", "italic"), `\x1b[3m\x1b[1m\x1b[104m\x1b[1m\x1b[93m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with overlapping characteristics.");
        // expect(Tinter.rgb(DUMMY_STRING, [255,255,127], [192, 0, 55], "underline"), `\x1b[4m\x1b[1m\x1b[101m\x1b[1m\x1b[93m${DUMMY_STRING}\x1b[0m`, "it should degrade a truecolor to 16-color appropriately.");
        expect(Tinter.Black(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[30m${DUMMY_STRING}\x1b[0m`, "it should correctly support ANSI named colors.");
        expect(Tinter.rebeccapurple(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[34m${DUMMY_STRING}\x1b[0m`, "it should correctly support CSS4 named colors.");

        done(); // Indicate the test has finished
    });

    it("Truecolor functions", function(done) {

        // private method
        expect(Tinter._styleTruecolor(DUMMY_STRING, [255,255,127], [192, 0, 55], "underline")).toEqual(`\x1b[4m\x1b[1m\x1b[48;2;192;0;55m\x1b[1m\x1b[38;2;255;255;127m${DUMMY_STRING}\x1b[0m`, "it should (privately) represent truecolor RGB values correctly - regardless of environment");
        expect(Tinter._styleTruecolor(DUMMY_STRING, [255,255,127], [192, 0, 55])).toEqual(`\x1b[1m\x1b[48;2;192;0;55m\x1b[1m\x1b[38;2;255;255;127m${DUMMY_STRING}\x1b[0m`, "it should (privately) represent truecolor RGB values correctly - regardless of environment when using defaults (3 params)");
        expect(Tinter._styleTruecolor(DUMMY_STRING, [255,255,127])).toEqual(`\x1b[1m\x1b[38;2;255;255;127m${DUMMY_STRING}\x1b[0m`, "it should (privately) represent truecolor RGB values correctly - regardless of environment when using defaults (2 params)");
        expect(Tinter._styleTruecolor(DUMMY_STRING)).toEqual(`${DUMMY_STRING}\x1b[0m`, "it should (privately) represent truecolor RGB values correctly - regardless of environment when using defaults (1 params)");

        // private method - TODO replace with rgb() to match 16M tests.
        expect(Tinter._degrade(DUMMY_STRING, [200, 10, 21], [2, 0, 200], "italic"),
            `\x1b[3m\x1b[1m\x1b[104m\x1b[1m\x1b[91m${DUMMY_STRING}\x1b[0m`,
            "it should degrade a set of truecolor RGB values correctly.");

        done(); // Indicate the test has finished
    });

    it("Color degradation functions", function(done) {

        expect(Tinter._nearest16([10, 127, 0])).toEqual("black", "it should degrade a truecolor RGB value to the correct named color - black.");
        expect(Tinter._nearest16([200, 10, 21])).toEqual("red", "it should degrade a truecolor RGB value to the correct named color - red.");
        expect(Tinter._nearest16([0, 128, 0])).toEqual("green", "it should degrade a truecolor RGB value to the correct named color - green.");
        expect(Tinter._nearest16([2, 0, 200])).toEqual("blue", "it should degrade a truecolor RGB value to the correct named color - blue.");
        expect(Tinter._nearest16([200, 128, 0])).toEqual("yellow", "it should degrade a truecolor RGB value to the correct named color - yellow.");
        expect(Tinter._nearest16([200, 10, 128])).toEqual("magenta", "it should degrade a truecolor RGB value to the correct named color - magenta.");
        expect(Tinter._nearest16([0, 200, 128])).toEqual("cyan", "it should degrade a truecolor RGB value to the correct named color - cyan.");
        expect(Tinter._nearest16([175, 200, 128])).toEqual("white", "it should degrade a truecolor RGB value to the correct named color - white.");

        done(); // Indicate the test has finished
    });

});
