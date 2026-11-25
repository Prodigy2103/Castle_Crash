import { DrawableObject } from "./drawable_object.class.js";
import { ImgHelper } from "../js/imghelper.js";

export class StatusBar extends DrawableObject {
    x = 24;
    y = 20;
    width = 144;
    height = 65;
    barImages = [
        ImgHelper.ui["0Bar"],
        ImgHelper.ui["1Bar"],
        ImgHelper.ui["2Bar"],
        ImgHelper.ui["3Bar"],
        ImgHelper.ui["4Bar"],
        ImgHelper.ui["5Bar"]
    ];

    constructor() {
        super();
        this.loadImages(this.barImages);
        this.setPercentage(100);
    }

    /**
     * Updates the status bar sprite for a health percentage (0-100).
     * @param {number} percentage
     */
    setPercentage(percentage) {
        const barIndex = Math.min(5, Math.max(0, Math.ceil(percentage / 20)));
        const imagePath = this.barImages[barIndex];
        this.img = this.imageCache[imagePath];
    }
}