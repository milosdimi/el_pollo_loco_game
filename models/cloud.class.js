class Cloud extends MovableObject {
    height = 250;
    width = 500;
    speedCloud = 0.15;


    constructor() {
        super().loadImage("img/5_background/layers/4_clouds/1.png");

        this.animateMovement();
        this.x = Math.random() * 6000;
        this.y = 20;
    }

    animateMovement() {
        setInterval(() => {
            if (typeof gameStarted !== 'undefined' && gameStarted == true && world.keyboard.RIGHT && !world.gamePaused) {
                this.speedCloud = 0.5;
            } if (typeof gameStarted !== 'undefined' && gameStarted == true && !world.keyboard.RIGHT && !world.keyboard.LEFT) {
                this.speedCloud = 0.14;
            } if (typeof gameStarted !== 'undefined' && gameStarted == true && world.keyboard.LEFT && !world.gamePaused) {
                this.speedCloud = -0.36;
            } if (typeof gameStarted !== 'undefined' && gameStarted == true && !world.keyboard.LEFT && !world.keyboard.RIGHT) {
                this.speedCloud = 0.14;
            }
            this.x = this.x - this.speedCloud;
        }, 20);
    }
}