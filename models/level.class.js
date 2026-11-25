import { Background } from "./background.class.js";
import { ImgHelper } from "../js/imghelper.js";

export class Level {
    backgroundObjects;

    /**
     * @param {Background[]} backgroundObjects
     */
    constructor(backgroundObjects) {
        this.backgroundObjects = backgroundObjects;
    }

    /**
     * Creates the background for the given area index.
     * @param {number} areaIndex
     * @returns {Background[]}
     */
    static createBackgrounds(areaIndex = 0) {
        const imagePath = ImgHelper.background.areas[areaIndex];
        if (!imagePath) {
            throw new Error(`Unknown areaIndex: ${areaIndex}`);
        }
        return [new Background(imagePath, 0)];
    }
}
