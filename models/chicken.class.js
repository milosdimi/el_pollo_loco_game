class Chicken extends MovableObject {

    chickenBig;
    chickenSmall;
    isDead = false;

    IMAGES_WALKING = [
        "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png", // Passe Pfade an, falls nötig
        "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
    ];
    IMAGES_DEAD = [
        "img/3_enemies_chicken/chicken_normal/2_dead/dead.png",
    ];
    IMAGES_SMALL_WALKING = [
        "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
        "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
    ];
    IMAGES_SMALL_DEAD = [
        "img/3_enemies_chicken/chicken_small/2_dead/dead.png",
    ];


    constructor() {
        super();
        let randomNumber = Math.random();
        if (randomNumber < 0.5) {
            this.loadPropertiesChickenBig();
        } else {
            this.loadPropertiesChickenSmall();
        }
    }

    correctSpeedOfChicken() {
        const interval = setInterval(() => {
            level.enemies.forEach(enemy => {
                //  Level
                if (enemy instanceof Endboss) {
                    enemy.x = 5300;
                    enemy.speed = 0;
                } if (enemy instanceof Endboss) {
                    enemy.x = 5300;
                    enemy.speed = 0;
                }
            });
        }, 200);
    }

    correctSpeedOfEachChickenLevel1(enemy) {
        if (enemy.chickenBig) {
            enemy.speed = 0.15 + Math.random() * 0.63;
            enemy.currentspeed = enemy.speed;
            enemy.x = 1000 + Math.random() * 4900;
        }
        if (!enemy.chickenBig) {
            enemy.speed = 0.15 + Math.random() * 0.25;
            enemy.currentspeed = enemy.speed;
            enemy.x = 800 + Math.random() * 2900;
        }
    }

    correctSpeedOfEachChickenLevel2(enemy) {
        if (enemy.chickenBig) {
            enemy.speed = 0.2 + Math.random() * 0.63;
            enemy.currentspeed = enemy.speed;
            enemy.x = 1000 + Math.random() * 4900;
        }
        if (!enemy.chickenBig) {
            enemy.speed = 0.2 + Math.random() * 0.25;
            enemy.currentspeed = enemy.speed;
            enemy.x = 800 + Math.random() * 2900;
        }
    }

    loadPropertiesChickenBig() {
        this.chickenBig = true;
        this.width = 70;
        this.height = 60;
        this.y = 360;
        this.loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING); // Ändern zu loadImages
        this.animate(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD); // Ändern zu loadImages
    }

    loadPropertiesChickenSmall() {
        this.chickenBig = false;
        this.width = 50;
        this.height = 40;
        this.y = 380;
        this.loadImage('img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_SMALL_WALKING); // Ändern zu loadImages
        this.animate(this.IMAGES_SMALL_WALKING);
        this.loadImages(this.IMAGES_SMALL_DEAD); // Ändern zu loadImages
    }

    animate(images) {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);


        setInterval(() => {
            this.playAnimation(images);
        }, 200);

    }
}