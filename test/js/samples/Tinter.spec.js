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

        when("it can mark a string as reset.").expect(Tinter.reset(DUMMY_STRING)).toEqual(`\x1b[0m${DUMMY_STRING}\x1b[0m`);
        when("it can mark a string as plain.").expect(Tinter.plain(DUMMY_STRING)).toEqual(`\x1b[0m${DUMMY_STRING}\x1b[0m`);
        when("it can mark a string as bright.").expect(Tinter.bright(DUMMY_STRING)).toEqual(`\x1b[1m${DUMMY_STRING}\x1b[0m`);
        when("it can mark a string as dim.").expect(Tinter.dim(DUMMY_STRING)).toEqual(`\x1b[2m${DUMMY_STRING}\x1b[0m`);

        when("it can mark a string as italic.").expect(Tinter.italic(DUMMY_STRING)).toEqual(`\x1b[3m${DUMMY_STRING}\x1b[0m`);
        when("it can mark a string as underline.").expect(Tinter.underline(DUMMY_STRING)).toEqual(`\x1b[4m${DUMMY_STRING}\x1b[0m`);
        when("it can mark a string as blink.").expect(Tinter.blink(DUMMY_STRING)).toEqual(`\x1b[5m${DUMMY_STRING}\x1b[0m`);
        when("it can mark a string as blink2.").expect(Tinter.blink2(DUMMY_STRING)).toEqual(`\x1b[6m${DUMMY_STRING}\x1b[0m`);
        when("it can mark a string as inverse.").expect(Tinter.inverse(DUMMY_STRING)).toEqual(`\x1b[7m${DUMMY_STRING}\x1b[0m`);
        when("it can mark a string as hidden.").expect(Tinter.hidden(DUMMY_STRING)).toEqual(`\x1b[8m${DUMMY_STRING}\x1b[0m`);

        done(); // Indicate the test is done.
    });

    can("encode all foreground color directives", function(done) {

        when("it can mark a string as black.").expect(Tinter.black(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[30m${DUMMY_STRING}\x1b[0m`);
        when("it can mark a string as red.").expect(Tinter.red(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[91m${DUMMY_STRING}\x1b[0m`);
        when("it can mark a string as green.").expect(Tinter.green(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[32m${DUMMY_STRING}\x1b[0m`);
        when("it can mark a string as yellow.").expect(Tinter.yellow(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[93m${DUMMY_STRING}\x1b[0m`);
        when("it can mark a string as blue.").expect(Tinter.blue(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[94m${DUMMY_STRING}\x1b[0m`);
        when("it can mark a string as magenta.").expect(Tinter.magenta(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[95m${DUMMY_STRING}\x1b[0m`);
        when("it can mark a string as cyan.").expect(Tinter.cyan(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[96m${DUMMY_STRING}\x1b[0m`);
        when("it can mark a string as white.").expect(Tinter.white(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[97m${DUMMY_STRING}\x1b[0m`);
        when("it can mark a string as default.").expect(Tinter.default(DUMMY_STRING)).toEqual(`\x1b[39m${DUMMY_STRING}`);

        done(); // Indicate the test is done.
    });

    can("encode all background color directives", function(done) {

        when("it can mark a string background as blackBg.").expect(Tinter.blackBg(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[40m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a black background.");
        when("it can mark a string background as redBg.").expect(Tinter.redBg(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[101m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a red background.");
        when("it can mark a string background as greenBg.").expect(Tinter.greenBg(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[42m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a green background.");
        when("it can mark a string background as yellowBg.").expect(Tinter.yellowBg(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[103m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a yellow background.");
        when("it can mark a string background as blueBg.").expect(Tinter.blueBg(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[104m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a blue background.");
        when("it can mark a string background as magentaBg.").expect(Tinter.magentaBg(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[105m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a magenta background.");
        when("it can mark a string background as cyanBg.").expect(Tinter.cyanBg(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[106m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a cyan background.");
        when("it can mark a string background as whiteBg.").expect(Tinter.whiteBg(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[107m${DUMMY_STRING}\x1b[0m`, "it should be able mark a string with a white background.");
        when("it can mark a string background as defaultBg.").expect(Tinter.defaultBg(DUMMY_STRING)).toEqual(`\x1b[49m${DUMMY_STRING}`, "it should be able mark a string with a default background..");

        done(); // Indicate the test is done.
    });

    can("encode all composite color/style directives?", function(done) {

        when("it marks a string with overlapping characteristics.").expect(Tinter.style(DUMMY_STRING, "yellow", "blue", "italic")).toEqual(`\x1b[3m\x1b[1m\x1b[104m\x1b[1m\x1b[93m${DUMMY_STRING}\x1b[0m`);
        // expect(Tinter.rgb(DUMMY_STRING, [255,255,127], [192, 0, 55], "underline"), `\x1b[4m\x1b[1m\x1b[101m\x1b[1m\x1b[93m${DUMMY_STRING}\x1b[0m`, "it should degrade a truecolor to 16-color appropriately.");
        done(); // Indicate the test is done.
    });


    can("use standard and well-known color names", function(done) {

        when("it can use ANSI named colors").expect(Tinter.Black(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[30m${DUMMY_STRING}\x1b[0m`);
        when("it can use CSS4 named colors").expect(Tinter.rebeccapurple(DUMMY_STRING)).toEqual(`\x1b[1m\x1b[34m${DUMMY_STRING}\x1b[0m`);

        done(); // Indicate the test is done.
    });

    can("identify the correct degraded color name from RGB?", function(done) {

        when("it degrades a truecolor RGB value to the name black.").expect(Tinter._nearest16([10, 127, 0])).toEqual("black");
        when("it degrades a truecolor RGB value to the name red.").expect(Tinter._nearest16([200, 10, 21])).toEqual("red");
        when("it degrades a truecolor RGB value to the name green.").expect(Tinter._nearest16([0, 128, 0])).toEqual("green");
        when("it degrades a truecolor RGB value to the name blue.").expect(Tinter._nearest16([2, 0, 200])).toEqual("blue");
        when("it degrades a truecolor RGB value to the name yellow.").expect(Tinter._nearest16([200, 128, 0])).toEqual("yellow");
        when("it degrades a truecolor RGB value to the name magenta.").expect(Tinter._nearest16([200, 10, 128])).toEqual("magenta");
        when("it degrades a truecolor RGB value to the name cyan.").expect(Tinter._nearest16([0, 200, 128])).toEqual("cyan");
        when("it degrades a truecolor RGB value to the name white.").expect(Tinter._nearest16([175, 200, 128])).toEqual("white");

        done(); // Indicate the test is done.
    });

});
