class ThrowableObject extends MovableObject {
    constructor(x, y) {
        super().loadImage("img/6_salsa_bottle/salsa_bottle.png");
        this.x = x;
        this.y = y;
        this.height = 60;
        this.width = 50;
        this.throw(); // Set initial position    
    }

    throw() {
        this.speedY = 30; // Set the initial speed in the Y direction
        this.applyGravity();
        setInterval(() => {
            this.x += 10;
        }, 25);
    }
}