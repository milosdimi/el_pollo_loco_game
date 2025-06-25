class DrawableObject {
    img;
    imageCache = [];
    currentImage = 0;
    x = 120;
    y = 300;
    height = 150;
    width = 100;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach((path) => {
            const img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    draw(movingObject, ctx) {
        try {
            ctx.drawImage(movingObject.img, movingObject.x, movingObject.y, movingObject.width, movingObject.height);
        } catch (e) {
        }
    }

    drawFrame(movingObject, ctx) {
        if (this instanceof Chicken || this instanceof BottleOnFloor || this instanceof ThrowableObject || this instanceof ThrowableObject || this instanceof Coin) {
            ctx.beginPath();
            ctx.lineWidth = '2';
            ctx.strokeStyle = 'rgba(0, 0, 255, 0)';
            ctx.rect(movingObject.x, movingObject.y + 9, movingObject.width, movingObject.height - 9);
            ctx.stroke();
        } else if (this instanceof Character) {
            ctx.beginPath();
            ctx.lineWidth = '2';
            ctx.strokeStyle = 'rgba(0, 0, 255, 0)';
            ctx.rect(movingObject.x + 30, movingObject.y + 95, movingObject.width - 70, movingObject.height - 105);
            ctx.stroke();
        }
    }
}

