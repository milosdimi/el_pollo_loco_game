class Character extends MovableObject {
    speed = 10;
    height = 280;
    y = 80;
    width = 160;
    longIdle = false;
    idle = false;
    idleTimeOutID;
    longIdleTimeOutID;
    idleIntervalID;
    counterInveralID;
    counter = 0;
    idleAnimation = false;
    imagesDeadPlayed = false;

    IMAGES_WALKING = [
        "img/2_character_pepe/2_walk/W-21.png",
        "img/2_character_pepe/2_walk/W-22.png",
        "img/2_character_pepe/2_walk/W-23.png",
        "img/2_character_pepe/2_walk/W-24.png",
        "img/2_character_pepe/2_walk/W-25.png",
        "img/2_character_pepe/2_walk/W-26.png",
    ];
    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];
    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];
    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];
    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png',
    ];

    IMAGES_LONGIDLE = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png',
    ];

    world;
    walking_sound = new Audio('audio/walkEffect.mp3');
    spinJump_sound = new Audio('audio/spinEffect.mp3');
    hurt_sound = new Audio('audio/hurtEffect.mp3');
    healthRecharge_sound = new Audio('audio/healthRechargeEffect.mp3');
    bottleCollected_sound = new Audio('audio/bottleCollectedEffect.mp3');
    coinCollected_sound = new Audio('audio/coinRecievedEffect.mp3');
    enemyHit_sound = new Audio('audio/chicken-noise-196746.mp3');
    enemyDeleted_sound = new Audio('audio/enemyDeletedEffect.mp3');


    constructor() {
        super().loadImage("img/2_character_pepe/2_walk/W-21.png");

        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONGIDLE);
        this.animate();
        this.applyGravity();
    }

    animate() {
        this.runMovementInterval();
        this.runAnimationInterval();
        this.runIdleIntervall();
    }

    runMovementInterval() {
        setInterval(() => {
            if (this.world.keyboard.RIGHT && this.x < level.level_end_x && this.world.gamePaused == false) {
                this.moveCharacterRight();
            }
            //  Links
            if (this.world.keyboard.LEFT && this.x > 100 && this.world.gamePaused == false) {
                this.moveCharacterLeft();
            }
            // Springen
            if (this.world.keyboard.SPACE && !this.isAboveGround()) {
                this.speedY = 30;
                this.spinJump_sound.play();
            }
            // Schlafen beenden
            if (this.world.keyboard.SPACE || this.world.keyboard.RIGHT || this.world.keyboard.LEFT || this.world.keyboard.letterD) {   // wenn irgendweine Taste gedrückt wird, wird der Idle-TimeOut zurückgesetzt und die üverprüfung, ob nichts gedrückt wird, beginnt von neuem
                this.resetIdleTimeout();
            }
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);
    }

    moveCharacterRight() {
        this.moveRight();
        this.otherdirection = false;  // wenn die rechte-Pfeil-Taste gedrückt wird, wird die variable auf false gesetzt und das Spiegeln des Characters beendet
        if (!this.isAboveGround()) {   // prüft, ob der Character sich gerade am Boden befindet; denn nur dann soll das walk-Geräusch abgespielt werden
            this.walking_sound.play();
            this.spinJump_sound.pause();
        } else if (this.isAboveGround()) {
            this.spinJump_sound.play();
            this.walking_sound.pause();
        }
    }

    moveCharacterLeft() {
        this.moveLeft();
        this.otherdirection = true;  // wenn die linke-Pfeil-Taste gedrückt wird, wird die variable auf true gesetzt und der Character gespiegelt
        if (!this.isAboveGround()) {   // prüft, ob der Character sich gerade am Boden befindet; denn nur dann soll das walk-Geräusch abgespielt werden
            this.walking_sound.play();
            this.spinJump_sound.pause();
        } else if (this.isAboveGround()) {
            this.spinJump_sound.play();
            this.walking_sound.pause();
        }
    }

    runAnimationInterval() {
        setInterval(() => {  // Dieses Intervall ruft die Animation/Abfolge der Bilder, die den Eindruck einer Bewegung des Character entstehen lässt, 20 mal pro sekunde auf
            if (this.world.gamePaused == false) {
                if (this.isDead()) { //-- if the character is dead
                    if (this.imagesDeadPlayed === false) {
                        this.playAnimation(this.IMAGES_DEAD);
                    }

                } else if (this.isHurt()) { //-- if the character is hurt
                    this.playAnimation(this.IMAGES_HURT);
                    this.hurt_sound.play();
                }
                // Jump-Animation
                else if (this.isAboveGround()) {
                    this.playAnimation(this.IMAGES_JUMPING);
                }
                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {  // "||" ist ein logisches "oder" und hei?t, dass der Code in den geschweiften Klammern entweder ausgeführt wird, wenn die rechts- oder die links-Taste gedrückt wurde

                    // Walk-Animation
                    this.playAnimation(this.IMAGES_WALKING);
                }
            }
        }, 50);
    }

    runIdleIntervall() {
        this.idleIntervalID = setInterval(() => {
            if (this.idleAnimation == false && !this.world.keyboard.RIGHT && !this.world.keyboard.LEFT && !this.world.keyboard.SPACE && !this.world.keyboard.letterD) {    // prüft, ob keine des Characters geschieht (bwz. ob KEINE Taste gedrückt wurde). Die Bedingung "this.idleAnimation == false" sorgt dafür, dass die Funktion "this.playIdleAnimation();" nur einmal und nicht mehrfach aufgerufen wird, da sonst die erhöhung des "counter" exponentiell ansteigt/zunimmt!
                this.idle = true;
                this.playIdleAnimation();  // spielt die Animation ab, wenn der Character nicht bewegt wird
                this.walking_sound.pause();
                this.hurt_sound.pause();
            }
        }, 100);
    }

    playIdleAnimation() {   // spielt die Animation ab, wenn der Character nnicht bewegt wird
        this.idleAnimation = true;  // gibt an, ob playIdleAnimation() ausgeführt wird
        this.loadImage('img/2_character_pepe/1_idle/idle/I-1.png');  // dieses Bild wird geladen, sobald keine Taste gedrückt wird, damit der Character wieder zurück in eine neutrale Ausgangsposition kommt
        this.counterInveralID = setInterval(() => {
            this.counter++;
            if (world.gameOver === false) {
                if (this.counter > 5 && this.counter <= 16) {
                    this.playAnimation(this.IMAGES_IDLE);
                } else if (this.counter > 15) {
                    this.playAnimation(this.IMAGES_LONGIDLE);
                    this.world.background_sound.playbackRate = 0.8;
                }
            }
        }, 800);
    }

    resetIdleTimeout() {
        this.idleAnimation = false;
        clearInterval(this.counterInveralID);
        this.counter = 0;
        this.world.background_sound.playbackRate = 1;
    }
}