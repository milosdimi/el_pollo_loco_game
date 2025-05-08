class MovableObject extends DrawableObject {
    speed = 0.5;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration; // Gravity effect
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true; // Throwable objects are always above ground
        } else {
            return this.y < 140; // Assuming 140 is the ground level
        }

    }



    // character is the object that is colliding with the movable object
    isColliding(mo) {
        return this.x + this.width > mo.x &&
            this.y + this.height > mo.y &&
            this.x < mo.x + mo.width &&
            this.y < mo.y + mo.height;
    }

    hit() {
        this.energy -= 1;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime(); // Set the last hit time to the current time
            this.playAnimation(this.IMAGES_HURT); // Play hurt animation
        }
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; // Calculate the time passed since the last hit
        timepassed = timepassed / 1000; // If less than 1 second has passed,
        return timepassed < 1; // return true
    }

    isDead() {
        return this.energy == 0;
    }

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    moveRight() {
        this.x += this.speed;

    }

    moveLeft() {
        this.x -= this.speed;

    }

    jump() {
        this.speedY = 30; // Set speedY to a positive value to jump
    }
};
