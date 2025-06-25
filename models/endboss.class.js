class Endboss extends MovableObject {

    height = 300;
    width = 250;
    y = 60;
    x = 5300;
    endBossSpeed = 15;
    endBossLife = 100;
    endBossHit = false;
    playImagesAttack = false;
    playAnimationIntervalId;
    playHurtAnimation = false;
    playHurtAnimation1 = false;
    playHurtAnimation2 = false;
    playHurtAnimation3 = false;
    playHurtAnimation4 = false;
    timeoutHit2IntervalId;
    timeoutHit3IntervalId;
    timeoutHit4IntervalId;

    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png',
    ];

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png',
    ];

    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png',
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png',
    ];

    constructor() {
        super();
        this.loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.playImagesWalking = false;
        this.animate();
        this.checkForAttack();
    }

    animate() {
        this.playAnimationIntervalId = setInterval(() => {
            if (this.playImagesWalking == false) {
                this.playAnimation(this.IMAGES_WALKING);
                this.playImagesWalking = true;
            } else if (this.playImagesWalking == true) {
                this.playAnimation(this.IMAGES_ALERT);
                this.playImagesWalking = false;
            }
        }, 200);
    }

    checkForAttack() {
        setInterval(() => {
            if (this.endBossHit == true && this.endBossLife >= 80 && this.playImagesAttack == false) {
                this.hit1();
            } else if (this.endBossHit == true && this.endBossLife < 80 && this.endBossLife >= 60) {
                this.hit2();
            } else if (this.endBossHit == true && this.endBossLife < 60 && this.endBossLife >= 40) {
                this.hit3();
            } else if (this.endBossHit == true && this.endBossLife < 40 && this.endBossLife >= 20) {
                this.hit4();
            } else if (this.endBossHit == true && this.endBossLife < 20) {
                this.hit5();
            }
        }, 200);
    }

    hit1() {
        clearInterval(this.playAnimationIntervalId);
        this.playAnimation(this.IMAGES_ATTACK);
    }

    hit2() {
        if (this.playHurtAnimation == false) {
            this.playAnimation(this.IMAGES_HURT);
            world.background_sound.playbackRate = 1.2;
        }
        this.timeoutHit2IntervalId = setTimeout(() => {
            if (this.playHurtAnimation1 == false) {
                this.playHurtAnimation = true;
                this.playHurtAnimation1 = true;
            }
            this.playAnimation(this.IMAGES_ATTACK);
            this.endbossMoveLeft();
        }, 1000);
    }

    hit3() {
        if (this.playHurtAnimation == false) {
            this.playAnimation(this.IMAGES_HURT);
            world.background_sound.playbackRate = 1.4;
        }
        this.timeoutHit3IntervalId = setTimeout(() => {
            if (this.playHurtAnimation2 == false) {
                this.playHurtAnimation = true;
                this.playHurtAnimation2 = true;
            }
            this.playAnimation(this.IMAGES_ATTACK);
            this.endbossMoveLeft();
        }, 2000);
    }

    hit4() {
        if (this.playHurtAnimation == false) {
            this.playAnimation(this.IMAGES_HURT);
            world.background_sound.playbackRate = 1.7;
        }
        this.timeoutHit4IntervalId = setTimeout(() => {
            if (this.playHurtAnimation3 == false) {
                this.playHurtAnimation = true;
                this.playHurtAnimation3 = true;
            }
            this.playAnimation(this.IMAGES_ATTACK);
            this.endbossMoveLeft();
        }, 4000);
    }

    hit5() {
        if (this.playHurtAnimation == false) {
            this.playAnimation(this.IMAGES_HURT);
            world.background_sound.playbackRate = 2;
        }
        if (this.endBossLife <= 0) {
            this.endBossSpeed = 0;
        }
        setTimeout(() => {
            if (this.playHurtAnimation4 == false) {
                this.playHurtAnimation = true;
                this.playHurtAnimation4 = true;
            }
            this.playAnimation(this.IMAGES_DEAD);
        }, 1000);
    }

    endBossMoveLeft() {
        clearInterval(this.playAnimationIntervalId);
        this.x -= this.endBossSpeed;
    }
}