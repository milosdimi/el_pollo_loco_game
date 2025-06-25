class MovableObject extends DrawableObject {
    speed = 0.2;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    characterIsAlive = true; // Flag to check if the character is alive
    jumpingOnEnemy = false; // Flag to check if the character is jumping on an enemy
    applyGravityIntervalID = null; // Store the interval ID for gravity application

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration; // Gravity effect
            } else if (this.speedY <= -32) {
                this.speedY = 0;
            }
        }, 1000 / 25);
    }

    speedYtoZero() {
        setInterval(() => {
            if (this.y >= 170) {
                this.speedY = 0;
            }
        }, 200);
    }

    isAboveGround() {
        if (this instanceof ThrowableObject && this.y < 350) {
            return true; // Throwable objects are always above ground
        } else {
            return this.y < 150; // Assuming 140 is the ground level
        }

    }



    // character is the object that is colliding with the movable object
    isColliding(mo) {
        return (this.x + 30) + (this.width - 60) > mo.x + 10 &&
            this.y + this.height > mo.y &&
            this.x + 30 < mo.x + 10 + mo.width - 10 &&
            this.y + 50 < mo.y - 50 + mo.height;
    }

    isCollidingBottleEnemy(mo) {
        return this.x + this.width > (mo.x - 8) &&
            this.y + this.height > mo.y &&
            this.x < mo.x + mo.width &&
            this.y < mo.y + mo.height;
    }

    isJumpingOnEnemy(mo) {
        world.indexOfCurrentEnemy = mo;
        if (this.isColliding(mo) &&
            this.speedY < 0) {
            this.jumpingOnEnemy = true;
            return true;
        }
        else {
            setTimeout(() => {
                this.jumpingOnEnemy = false;
            }, 750);
        }
    }

    hit() {
        this.energy -= 0.20;
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
        return timepassed < 2; // return true
    }

    isDead() {
        this.characterIsAlive = false; // Set the character as dead
        return this.energy == 0;
    }

    regLife() {
        if (world.character.energy > 0) {
            world.character.energy += 25;
            if (world.character.energy > 100) {
                world.character.energy = 100
            }
            world.statusBar.setPercentage(world.character.energy)
        }
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
