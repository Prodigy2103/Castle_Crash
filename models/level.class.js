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
     * Creates a repeating set of background tiles to cover the level length.
     * @returns {Background[]}
     */
    static createBackgrounds() {
        const backgrounds = [];
        const tileCount = 6;
        const areaImages = ImgHelper.background.areas;

        for (let tileIndex = 0; tileIndex < tileCount; tileIndex++) {
            const offsetX = tileIndex * 1279;
            const imagePath = areaImages[tileIndex % areaImages.length];
            backgrounds.push(new Background(imagePath, offsetX));
        }
        return backgrounds;
    }
}
