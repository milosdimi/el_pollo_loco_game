class Screens extends DrawableObject {

    IMAGE_START = [
        'img/9_intro_outro_screens/start/startscreen_1.png',
    ];


    IMAGE_WON = [
        'img/9_intro_outro_screens/game_over/game over!.png',
    ];


    IMAGE_LOSS = [
        'img/9_intro_outro_screens/game_over/you lost.png',
    ];

    constructor() {
        super();
        this.x = 0;
        this.y = 0;
        this.width = 720;
        this.height = 480;
        this.showScreen();
    }

    showScreen() {
        const interval = setInterval(() => {
            if (world.character.energy == 0 && !world.gameOver) {
                this.gameLost();
                world.gameOver = true;
            }
            else if (level.enemies[level.enemies.length - 1].endbossLife <= 0) {
                setTimeout(() => {
                    this.gameWon();
                    world.gameOver = true;
                }, 6000);
                clearInterval(interval);
            }
        }, 200);
    }

    gameLost() {
        this.loadImage(this.IMAGE_LOSS);
        pauseGame();
        showLevelSelection();
        world.background_sound.pause();
    }

    gameWon() {
        this.loadImage(this.IMAGE_WON);
        pauseGame();
        showLevelSelection();
        world.background_sound.pause();
        world.deleteAllEnemies();
    }


}