import { MoveableObject } from "./moveable_object.class.js";
import { IntervalHub } from "../js/intervalhub.class.js";

export class Effect extends MoveableObject {
    animationIntervalId;
    isFinished = false;

    constructor(frames, offsetX, offsetY, width, height, frameMs = 40) {
        super();
        this.x = offsetX;
        this.y = offsetY;
        this.width = width;
        this.height = height;
        this.loadImage(frames[0]);
        this.loadImages(frames);
        this.playOnce(frames, frameMs);
    }

    playOnce(frames, frameMs) {
        this.animationIntervalId = IntervalHub.startInterval(() => {
            if (this.currentImage >= frames.length) {
                this.destroy();
                return;
            }
            this.img = this.imageCache[frames[this.currentImage]];
            this.currentImage++;
        }, frameMs);
    }

    destroy() {
        this.isFinished = true;
        IntervalHub.stopInterval(this.animationIntervalId);
    }
}