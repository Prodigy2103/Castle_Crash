import { DrawableObject } from "./drawable_object.class.js";

export class MoveableObject extends DrawableObject {

    /**
    * Advances the sprite animation by one frame from the image cache.
    * @param {string[]} images
    */
    playAnimation(images) {
        const frameIndex = this.currentImage % images.length;
        const imagePath = images[frameIndex];
        this.img = this.imageCache[imagePath];
        this.currentImage++;
    }
}
