export class DrawableObject {
    img;
    x = 0;
    y = 0;
    width = 100;
    height = 100;
    imageCache = {};
    currentImage = 0;

    /**
     * Loads an image from the given path.
     * @param {string} imagePath
     */
    loadImage(imagePath) {
        this.img = new Image();
        this.img.src = imagePath;
    }

    /**
     * Preloads an array of image paths into the image cache.
     * @param {string[]} imagePaths
     */
    loadImages(imagePaths) {
        imagePaths.forEach((imagePath) => {
            const cachedImage = new Image();
            cachedImage.src = imagePath;
            this.imageCache[imagePath] = cachedImage;
        })
    }
    /**
     * Draws the loaded image onto the canvas context.
     * @param {CanvasRenderingContext2D} context
     */
    draw(context) {
        if (!this.img || !this.img.complete) {
            return;
        }
        context.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}
