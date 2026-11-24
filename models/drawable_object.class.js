export class DrawableObject {
    img;
    x = 0;
    y = 0;
    width = 100;
    height = 100;
    imageCache = {};
    currentImage = 0;
    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };

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

    /**
     * Draws outer sprite bounds (blue) and inner hitbox bounds (red).
     * @param {CanvasRenderingContext2D} context
     */
    drawFrame(context) {
        this.drawRect(context, this.x, this.y, this.width, this.height, "blue");
        const hitboxX = this.x + this.offset.left;
        const hitboxY = this.y + this.offset.top;
        const hitboxWidth = this.width - this.offset.left - this.offset.right;
        const hitboxHeight = this.height - this.offset.top - this.offset.bottom;
        this.drawRect(context, hitboxX, hitboxY, hitboxWidth, hitboxHeight, "red");
    }

    drawRect(context, rectX, rectY, rectWidth, rectHeight, strokeColor) {
        context.beginPath();
        context.lineWidth = 2;
        context.strokeStyle = strokeColor;
        context.rect(rectX, rectY, rectWidth, rectHeight);
        context.stroke();
    }
}
