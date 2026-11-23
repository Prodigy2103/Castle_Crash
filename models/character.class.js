import { MoveableObject } from "./moveable_object.class.js";
import { ImgHelper } from "../js/imghelper.js";
import { IntervalHub } from "../js/intervalhub.class.js";

export class Character extends MoveableObject {
    width = 120;
    height = 120;
    x = 120;
    y = 260;
    characterKey;

    constructor(characterKey = "c1", offsetX = 120, offsetY = 260) {
        super();
        this.characterKey = characterKey;
        this.x = offsetX;
        this.y = offsetY;
        const idleFrames = ImgHelper.characters[this.characterKey].idle;
        this.loadImage(idleFrames[0]);
        this.loadImages(idleFrames);
        this.animate();
    }

    animate() {
        const idleFrames = ImgHelper.characters[this.characterKey].idle;
        IntervalHub.startInterval(() => {
            this.playAnimation(idleFrames);
        }, 50);
    }
}