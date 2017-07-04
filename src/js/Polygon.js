"use strict";

// Imports

// Component
class Polygon {
    constructor(height, width) { //class constructor

        const SCALE = 1.0;
        const SOMETHING = 1.0;

        this.name = "Polygon";
        this.height = height;
        this.width = width * SCALE;
    }

    setHeight(height) {
        this.height = height;
    }

    getArea() {
        return this.height * this.width;
    }

    sayName() {
        console.log("Hi, I am a", this.name + ".");
    }
}

// Exports
module.exports = Polygon;

