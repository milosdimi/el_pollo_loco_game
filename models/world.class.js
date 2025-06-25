class World {
    character = new Character();
    gameStarted = false;
    canvas;
    ctx;
    keyboard;
    gamePaused = false;
    camera_x = 0;
    statusBar = new StatusBar();
    throwableObjects = [];
    bottleOnFloor = [];
    collectedThrowableObjects = [];
    bottless = [];
    statusBarBottles = new StatusBarBottles();
    statusBarCoins = new StatusBarCoins();
    statusKilledEnemies = new StatusKilledEnemies();
    bottleInAir = false;
    screens = new Screens();
    indexOfCurrentEnemy;
    canCheckJumpingOnEnemy = true;
    canExecuteCollisionCheck = false;
    coin = [];
    killedEnemies = 0;
    gameOver = false;
    isMuted = false;
    background_sound = new Audio('audio/background-music.mp3');

    constructor(canvas, keyboard, level, testIfLevel2) {
        this.keyboard = keyboard;
        this.level = level;
        this.checkIfLevel2 = testIfLevel2;
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.setWorld();
        this.draw();
        this.runIntervals();
        if (this.level && this.level.enemies && this.level.enemies[0]) {
            this.level.enemies[0].correctSpeedOfEachChicken();
        }
        if (this.level && this.level.coins && this.level.coins[0]) {
            this.level.coins[0].correctPositionOfEachCoin();
        }
        if (this.level && this.level.bottleOnFloor && this.level.bottleOnFloor[0]) {
            this.level.bottleOnFloor[0].correctPositionOfEachBottle();
        }
        this.adjustLevelEnd();
    }

    setWorld() {
        this.character.world = this;
        this.character.startAnimation();
        this.screens.world = this;
    }

    addObjectsToMap(objects) {
        if (objects && Array.isArray(objects)) {
            objects.forEach(o => {
                this.addToMap(o);
            });
        } else {
            console.warn('Objects ist nicht definiert oder kein Array:', objects);
        }
    }

    draw() {
        if (!this.level) {
            console.warn('Level ist nicht definiert');
            return;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.ctx.translate(-this.camera_x, 0);
        this.addObjectsToMap(this.level.clouds);
        this.addToMap(this.statusBar);
        this.addToMap(this.statusBarBottles);
        this.addToMap(this.statusBarCoins);
        this.addToMap(this.statusKilledEnemies);
        //this.setTextStyle();
        //this.resetTextStyle();
        this.ctx.fillText(`${this.killedEnemies}`, this.statusKilledEnemies.x + 15, this.statusKilledEnemies.y + 52);
        this.addToMap(this.screens);
        this.ctx.translate(this.camera_x, 0);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.bottleOnFloor);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.collectedThrowableObjects);
        this.ctx.translate(-this.camera_x, 0);
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    adjustLevelEnd() {
        if (this.checkIfLevel2 === false) {
            level.level_end_x = 5100
        } if (this.checkIfLevel2 === true) {
            level.level_end_x = 8100
        }
    }



    runIntervals() {
        this.checkCollisions();
        this.checkThrowObjects();
    }

    checkThrowObjects() {
        if (this.keyboard.D) {
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(bottle);
        }
    }

    checkCollisions() {
        this.checkForCollisionsWhithEnemies();
        this.checkIfCharacterJumpsOnEnemy();
        this.checkForCollisionsWhithThrowableObjects();
       // this.checkForCollisionsWhithCoins();
    }


    checkForCollisionsWhithEnemies() {
        setInterval(() => {   // Checking for Collisions whith Enemies
            level.enemies.forEach((enemy) => {
                if (this.character.isColliding(enemy) && !this.character.isAboveGround() && !enemy.isDead) {
                    this.character.hit();
                    this.statusBar.setPercentage(this.character.energy);  // weist dem Prozentwert 'percentage' den aktuellen Wert zu in der Klasse Status-bar
                }
            });
        }, 20);
    }

    checkIfCharacterJumpsOnEnemy() {
        setInterval(() => {   // Checking if Character jumps on Enemy
            level.enemies.forEach((enemy, indexOfEnemy) => {
                if (this.character.isJumpingOnEnemy(enemy)) {   // der erste Teil der Condition prüft, ob überhaupt eine Kollision mit einem Enemy vorliegt, und der zweite Teil der Condition prüft, ob der Character dabei von oben kommend mit dem Enemy kolliediert. 
                    this.playDeadChickenAnimation(enemy);  // hier wird das ganze getroffene Objekt (enemy) übergeben und nicht nur dessen index, da sich dieser rasch ändern kann, z.B. wennn ein enemy gelöscht wurde, sodass es zu fehlern kommen kann
                    enemy.isDead = true;
                    this.character.enemyDeleted_sound.play();  // spielt den Sound ab, dass ein enemy getötet wurde
                }
            });
        }, 200);
    }

    checkForCollisionsWhithThrowableObjects() {
        setInterval(() => {
            this.level.bottleOnFloor.forEach((bottleOnFloor, indexOfBottle) => {
                if (this.character.isColliding(bottleOnFloor)) {
                    this.collectedThrowableObjects.push(new ThrowableObject(-5000));
                    this.level.bottleOnFloor.splice(indexOfBottle, 1);
                    this.statusBarBottles.collectedBottles++;
                    this.statusBarBottles.setBottleNumber(this.statusBarBottles.collectedBottles);
                    this.character.bottleCollected_sound.play();
                }
            });
        }, 200);
    }

    checkForCollisionsWhithThrowableObjects() {
        setInterval(() => {
            this.level.bottleOnFloor.forEach((bottleOnFloor, indexOfBottle) => {
                if (this.character.isColliding(bottleOnFloor)) {
                    this.collectedThrowableObjects.push(new ThrowableObject(-5000));
                    this.level.bottleOnFloor.splice(indexOfBottle, 1);
                    this.statusBarBottles.collectedBottles++;
                    this.statusBarBottles.setBottleNumber(this.statusBarBottles.collectedBottles);
                    this.character.bottleCollected_sound.play();
                }
            });
        }, 200);
    }

    checkThrowObjects() {
        setInterval(() => {
            if (this.keyboard.letterD && this.collectedThrowableObjects.length > 0 && this.bottleInAir == false && this.gamePaused == false) {
                this.collectedThrowableObjects[0].throw();
            }
            else if (this.collectedThrowableObjects.length < 1) {

            }
        }, 200);
    }

    playDeadChickenAnimation(enemy) {
        const deadChickenIntervalID = setInterval(() => {
            if (enemy.chickenBig == true) {   // diese Abfrage prüft, ob es sich um ein großes oder ein kleines Ckicken handelt, damit im Folgenden das richtige Bild des toten Chicken geladen werden kann
                enemy.loadImage(enemy.IMAGE_DEAD);
            } else {
                enemy.loadImage(enemy.IMAGE_DEAD_SMALL);
            }
            enemy.speed = 0;
        }, 200);

        setTimeout(() => {
            clearInterval(deadChickenIntervalID);
            this.deleteHitEnemy(enemy);
        }, 1500);
    }

    deleteHitEnemy(enemy) {  // deletes the hit enemy
        const indexOfEnemy = level.enemies.indexOf(enemy);
        if (indexOfEnemy !== -1) {
            level.enemies.splice(indexOfEnemy, 1);
            this.killedEnemies++;
        }
    }

    deleteThrownBottleFromArray() {
        this.collectedThrowableObjects.splice(1, 1);
    }

    deleteAllEnemies() {
        level.enemies.length = 0  //-- .length = 0 leert das Array
    }



    addToMap(movingObject) {
        if (!movingObject) {
            console.error('movingObject is undefined');
            return;  // beendet die Funktion, falls das zuvor Geprüfte zutrifft.
        }
        if (movingObject.otherdirection) {  // diese Methode spiegelt das Bild auf dem Canvas -> Junus hat die Methode ergoogelt; kommt im Video Bild spiegeln
            this.flipImage(movingObject);
            this.otherdirection = true;
        }
        movingObject.draw(movingObject, this.ctx);
        movingObject.drawFrame(movingObject, this.ctx);

        if (movingObject.otherdirection) {  // diese Methode sorgt dafür, dass künftige Bilder nicht mehr gespiegelt werden.
            this.flipImageBack(movingObject);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

}