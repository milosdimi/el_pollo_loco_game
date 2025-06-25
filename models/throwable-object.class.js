class ThrowableObject extends MovableObject {

    throwBottleIntervalID;
    playAnimationIntervalID;
    checkForCollissionIntervalID;
    checkForYOrCollissionIntervalID;
    bottleCollides = false;

    IMAGES_THROW = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png',
    ];

    IMAGES_SPLASH = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png',
    ];

    constructor(x, y) {
        super().loadImage('img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png');

        this.loadImages(this.IMAGES_THROW);
        this.loadImages(this.IMAGES_SPLASH);

        this.speed = 0.40;
        this.height = 70;
        this.width = 65;
        this.x = -1111;  //-- sorgt dafür, dass die gesammelte Flasche -1111px links des Bildschirm angezeigt wird
    }

    throw() {
        world.bottleInAir = true;  // gibt an, dass sich gerade eine Flasche in der Luft befindet
        this.x = world.character.x + 100;
        if (world.character.otherDirection == true) {   // Anpassen des x-Wertes der Flasche, wenn nach links geworfen wird
            this.x = world.character.x
        };
        this.y = world.character.y;
        this.speedY = 30;
        this.applyGravity();
        this.testThrowDirection();
        this.playAnimationImgThrow();
        this.checkForCollissions();
        this.checkForYOrCollossion();
    }

    testThrowDirection() {
        if (world.character.otherdirection == true) {      // Diese Funktion prüft, ob der Character nach linkt oder nach rechts zeigt. Entsprechend wird die Funktion, die die Flasche nach links oder anch rechts wirft, ausgeführt.
            this.throwBottleLeft();
        } else {
            this.throwBottleRight();
        }
    }

    playAnimationImgThrow() {
        this.playAnimationIntervalID = setInterval(() => {
            this.playAnimation(this.IMAGES_THROW);
        }, 50);
    }

    checkForCollissions() {
        this.checkForCollissionIntervalID = setInterval(() => {  
            level.enemies.forEach((enemy, indexOfEnemy) => {
                if (world.collectedThrowableObjects[0].isCollidingBottleEnemy(enemy, indexOfEnemy)) {
                    this.testIfChickenOrEndbossIsHit(indexOfEnemy);
                    this.bottleCollides = true;
                }
            });
        }, 200);
    }

    checkForYOrCollossion() {
        this.checkForYOrCollissionIntervalID = setInterval(() => {
            world.character.enemyHit_sound.pause();
            if (this.y > 360 || this.bottleCollides == true) {
                this.resetBottleIntervals();
                this.bottleCollides = false;
                world.character.enemyHit_sound.play();
            }
        }, 25);
    }

    throwBottleLeft() {
        this.throwBottleIntervalID = setInterval(() => {
            this.x -= 10;
        }, 25);
    }

    throwBottleRight() {
        this.throwBottleIntervalID = setInterval(() => {
            this.x += 10;
        }, 25);
    }

    resetBottleIntervals() {
        clearInterval(this.checkForYOrCollissionIntervalID);
        clearInterval(this.throwBottleIntervalID);
        clearInterval(this.playAnimationIntervalID);
        clearInterval(this.checkForCollissionIntervalID);
        this.playSplashAnimation();
        this.actualizeBottlesBar(); 
    }

    playSplashAnimation() {
        this.playAnimation(this.IMAGES_SPLASH);
        this.deleteThrownBottle();
        world.bottleInAir = false;   
        return true;
    }

    deleteThrownBottle() {
        setTimeout(() => {
            world.collectedThrowableObjects.splice(0, 1);
        }, 300);
    }

    testIfChickenOrEndbossIsHit(indexOfEnemy) {
        let indexOfEndboss = level.enemies.length - 1;
        if (indexOfEnemy != indexOfEndboss) {   // prüft anhand des Index, ob es sich bei dem getroffenen Objekt um den Endboss handelt
            this.playDeadChickenAnimation(indexOfEnemy);
        } else if (indexOfEnemy == indexOfEndboss) {
            level.enemies[indexOfEndboss].endbossHit = true;
            level.enemies[indexOfEndboss].playHurtAnimation = false;
            level.enemies[indexOfEndboss].endbossLife -= 20;
            this.deleteEndboss(indexOfEndboss);
        }
    }

    deleteEndboss(indexOfEndboss) {
        if (level.enemies[indexOfEndboss].endbossLife < 20) {
            setTimeout(() => {
                level.enemies.splice(indexOfEndboss, 1);
            }, 9000);
        }
    }

    playDeadChickenAnimation(indexOfEnemy) {
        let enemy = level.enemies[indexOfEnemy];
        const deadChickenIntervalID = setInterval(() => {
            if (enemy.chickenBig == true) {   // diese Abfrage prüft, ob es sich um ein großes oder ein kleines Ckicken handelt, damit im Folgenden das richtige Bild des toten Chicken geladen werden kann
                enemy.loadImage(enemy.IMAGE_DEAD);
            } else {
                enemy.loadImage(enemy.IMAGE_DEAD_SMALL);
            }
            enemy.speed = 0;  //-- Stops the movement of the hit enemy
            world.character.enemyDeleted_sound.play();
        }, 200);

        setTimeout(() => {
            clearInterval(deadChickenIntervalID);
            this.deleteHitEnemy(indexOfEnemy);
        }, 1500);
    }

    deleteHitEnemy(indexOfEnemy) {  // deletes the hit enemy
        level.enemies.splice(indexOfEnemy, 1);
        world.character.regainLife();  // erhöht das Leben des Characters, wenn ein enemy getötet wurde
        this.playRegainHealthSound();
        world.killedEnemies++;   // erhöht den Counter der getöteten Enemies, damit die Zahl der getöteten Enemies im Camnvas aktualisiert werden kann
    }

    actualizeBottlesBar() {
        world.statusBarBottles.collectedBottles--;  // verringert den Wert der gesammelten Flaschen für die Bottle-Status-Bar
        world.statusBarBottles.setBottleNumber(world.statusBarBottles.collectedBottles);  // aktualisiert die Anzeige der Bottle-Status-Bar
    }

    playRegainHealthSound() {
        if (world.character.energy < 99) {
            world.character.healthRecharge_sound.play();
        }
    }
}