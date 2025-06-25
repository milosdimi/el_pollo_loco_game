let level;
let canvas;
let world;
let keyboard = new Keyboard();
let pauseGameBtn = document.getElementById('pauseGameBtn');
let gameStarted = false;  // diese Variable wird benötigt, um, wenn die "pause-game-btns" wieder angezeigt werden sollen, um zu überprüfen, ob das Spiel bereits gestartet wurde, da sie sonst direkt zum Start des Spiels angezeigt werden würden. 
let gamePaused = false;
let mobileWindow;
let deviceVertical;
let showMobileAboutMenuVar = false;  // diese Variable wird benötigt, um den Toggle-Button des Hamburger-Menus bzw. das "X" zum Schließen in der Funktion "showMobileAboutMenu()" zu regeln
let checkIfLevel2 = false;
let deviceWasTurned = false;
let buttonBoardShown = true;

function init() {
    shrinkStartImage();
    bindBtnsPressEvents();
    fullScreenMobile();

    const urlParams = new URLSearchParams(window.location.search);
    const level = urlParams.get('level') || '1'; // Standardmäßig Level 1

    if (level === '2') {
        startLevel2();
    } else {
        initLevel1();
    }
}

function initLevel1() {
    level = level1;
}

function startLevel2() {
    level = level2;
    testIfLevel2 = true;
}

function showLevelSelection() {
    setTimeout(() => {
        document.getElementById('outerMobileLevelSelectionDiv').classList.remove('d-none');
        document.getElementById('mobileLevelSelectionDiv').classList.remove('d-none');
    }, 10000);
}

function showLevelSelectionFast() {
    document.getElementById('outerMobileLevelSelectionDiv').classList.remove('d-none');
    document.getElementById('mobileLevelSelectionDiv').classList.remove('d-none');
}

function hideMobileLevelSelectionDiv() {
    document.getElementById('outerMobileLevelSelectionDiv').classList.add('d-none');
    document.getElementById('mobileLevelSelectionDiv').classList.add('d-none');
}

function shrinkStartImage() {
    setTimeout(() => {
        document.getElementById('startGameBtn').classList.remove('d-none');
    }, 2400);
}

function startGame() {
    document.getElementById('startImg').classList.add('d-none');
    document.getElementById('startGameBtn').classList.add('d-none');
    document.getElementById('pauseEndGameBtns').classList.remove('d-none');
    document.getElementById('pauseEndGameBtns').classList.add('pause-end-game-btns');
    document.getElementById('soundBtn').classList.remove('d-none');
    document.getElementById('soundBtn').classList.add('soundBtn');
    startCanvas();
    loadSoundSettings();
    playBackgroundMusic();
    gameStarted = true;
}

function playBackgroundMusic() {
    setInterval(() => {
        const mutedSetting = localStorage.getItem('isMuted');  //-- testen, ob der Sound an oder aus sein sollte
        if (mutedSetting === 'false') {
            world.background_sound.play();
            world.background_sound.loop = true;
            world.background_sound.volume = 0.18;
            world.background_sound.playbackRate = 1;
        }
    }, 200);
}

function changeSoundSettings() {
    if (world.isMuted == false) {
        world.isMuted = true;
        showMutedImg();
        muteSound();
        localStorage.setItem('isMuted', 'true'); // speichern
    } else if (world.isMuted == true) {
        world.isMuted = false;
        showSoundImg();
        amplifySound();
        localStorage.setItem('isMuted', 'false'); // speichern
    }
}

function loadSoundSettings() {
    const mutedSetting = localStorage.getItem('isMuted');
    if (mutedSetting === 'true') {
        world.isMuted = true;
        showMutedImg();
        muteSound();
    } else {
        world.isMuted = false;
        showSoundImg();
        amplifySound();
    }
}

function muteSound() {
    world.character.walking_sound.volume = 0;
    world.character.spinJump_sound.volume = 0;
    world.character.hurt_sound.volume = 0;
    world.character.healthRecharge_sound.volume = 0;
    world.background_sound.volume = 0;
    world.character.bottleCollected_sound.volume = 0;
    world.character.enemyHit_sound.volume = 0;
    world.character.coinCollected_sound.volume = 0;
    world.character.enemyDeleted_sound.volume = 0;
}

function amplifySound() {
    world.character.walking_sound.volume = 1;
    world.character.spinJump_sound.volume = 1;
    world.character.hurt_sound.volume = 1;
    world.character.healthRecharge_sound.volume = 1;
    world.character.bottleCollected_sound.volume = 1;
    world.background_sound.volume = 0.18;
    world.character.bottleCollected_sound.volume = 1;
    world.character.enemyHit_sound.volume = 1;
    world.character.coinCollected_sound.volume = 1;
    world.character.enemyDeleted_sound.volume = 1;
}

function showSoundImg() {
    document.getElementById('soundOffImg').classList.add('d-none');
    document.getElementById('soundOnImg').classList.remove('d-none');
}

function showMutedImg() {
    document.getElementById('soundOffImg').classList.remove('d-none');
    document.getElementById('soundOnImg').classList.add('d-none');
}

function startCanvas() {
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
}

function pauseGame() {
    if (mobileWindow == false) {
        toggleBtn('pauseGameBtn', true);   // die parameter true und false dürfen nicht in Anführungszeichen stehen, da die aufgerufene Funktion diese nicht als String, sondern als Booleiische Variable braucht!
        toggleBtn('resumeGameBtn', false);  // aktiviert den zuvor deaktivierten "play-Button" der Desktop Ansicht
    } else if (mobileWindow == true) {
        toggleBtn('pauseGameBtnMobile', true);   // die parameter true und false dürfen nicht in Anführungszeichen stehen, da die aufgerufene Funktion diese nicht als String, sondern als Booleiische Variable braucht!
        toggleBtn('resumeGameBtnMobile', false);  // aktiviert den zuvor deaktivierten "play-Button" der mobilen Ansicht
    }

    if (!world.gameOver) {
        world.gamePaused = true;
        pauseChicken();
    }
}

function pauseChicken() {
    level.enemies.forEach((enemy, indexOfEnemy) => {
        level.enemies[indexOfEnemy].speed = 0;
    });
}

function toggleBtn(param1, param2) {
    document.getElementById(param1).disabled = param2;     // disable Pause-Game-Button
}

function resumeGame() {
    restartChicken();
    world.gamePaused = false;
    if (mobileWindow == false) {
        toggleBtn('resumeGameBtn', true);    // deaktiviert den "Play-Button" der Desktop Ansicht
        toggleBtn('pauseGameBtn', false);    // reaktiviert den zuvor deaktivierten "Pause-Button" der Desktop Ansicht
    } else if (mobileWindow == true) {
        toggleBtn('resumeGameBtnMobile', true);    // deaktiviert den "Play-Button" der Desktop Ansicht
        toggleBtn('pauseGameBtnMobile', false);    // reaktiviert den zuvor deaktivierten "Pause-Button" der mobilen Ansicht
    }
}

function restartChicken() {
    level.enemies.forEach((enemi, indexOfEnemy) => {
        level.enemies[indexOfEnemy].speed = level.enemies[indexOfEnemy].currentspeed;
    });
}

pauseGameBtn.addEventListener('click', function () {
    world.gamePaused = true;
});

function fullScreen() {
    let fullScreen = document.getElementById('fullscreen');
    enterFullscreen(fullScreen);
}

function enterFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.msRequestFullscreen) {      // for IE11 (remove June 15, 2022)
        element.msRequestFullscreen();
    } else if (element.webkitRequestFullscreen) {  // iOS Safari
        element.webkitRequestFullscreen();
    }
    resizeCanvasToFullscreen();
}

function resizeCanvasToFullscreen() {
    const canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth / 2;
    canvas.height = window.innerHeight / 1.53;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
}

window.addEventListener("keydown", (e) => {
    if (e.keyCode == 37) {
        keyboard.LEFT = true;
    }
    if (e.keyCode == 39) {
        keyboard.RIGHT = true;
    }
    if (e.keyCode == 38) {
        keyboard.UP = true;
    }
    if (e.keyCode == 40) {
        keyboard.DOWN = true;
    }
    if (e.keyCode == 32) {
        keyboard.SPACE = true;
    }
    if (e.keyCode == 68) {
        keyboard.D = true;
    }
});
window.addEventListener("keyup", (e) => {
    if (e.keyCode == 37) {
        keyboard.LEFT = false;
    }
    if (e.keyCode == 39) {
        keyboard.RIGHT = false;
    }
    if (e.keyCode == 38) {
        keyboard.UP = false;
    }
    if (e.keyCode == 40) {
        keyboard.DOWN = false;
    }
    if (e.keyCode == 32) {
        keyboard.SPACE = false;
    }
    if (e.keyCode == 68) {
        keyboard.D = false;
    }

});

function bindBtnsPressEvents() {
    document.getElementById('mobileBtnRight').addEventListener('touchstart', (event) => {
        event.preventDefault();
        keyboard.RIGHT = true;
    });

    document.getElementById('mobileBtnRight').addEventListener('touchend', (event) => {
        event.preventDefault();
        keyboard.RIGHT = false;
    });

    document.getElementById('mobileBtnLeft').addEventListener('touchstart', (event) => {
        event.preventDefault();
        keyboard.LEFT = true;
    });

    document.getElementById('mobileBtnLeft').addEventListener('touchend', (event) => {
        event.preventDefault();
        keyboard.LEFT = false;
    });

    document.getElementById('mobileBtnJump').addEventListener('touchstart', (event) => {
        event.preventDefault();
        keyboard.SPACE = true;
    });

    document.getElementById('mobileBtnJump').addEventListener('touchend', (event) => {
        event.preventDefault();
        keyboard.SPACE = false;
    });

    document.getElementById('mobileBtnThrow').addEventListener('touchstart', (event) => {
        event.preventDefault();
        keyboard.letterD = true;
    });

    document.getElementById('mobileBtnThrow').addEventListener('touchend', (event) => {
        event.preventDefault();
        keyboard.letterD = false;
    });
}

function testWindowWidth() {  // prüft, ob mobil-Ansicht vorliegt
    setInterval(() => {
        const mediaQuery = window.matchMedia('(max-width: 1200px)');

        //-- Mobile View
        if (mediaQuery.matches) {
            testIfDeviceIsVertivalOrHorizontal();
            initMobileView();
        }

        if (mediaQuery.matches && window.innerWidth > window.innerHeight) {
            mobileWindow = true;
            initMobileLandscapeView();  //-- blendet alles Notwendige für mobile Breitbildansicht ein bzw. aus

            if (gameStarted == true) {
                initMobileGameView();  //-- blendet UI-content ein
            } if (window.innerWidth < 700) {
                hideShowContent('pauseEndGameBtns', 'add');
                hideShowContent('about-btns', 'add');
            }
        } else {
            mobileWindow = false;
            hideShowContent('mobileMenu', 'add');     //blendet die Einstellungsbuttons mit den Symbolen aus
            if (gameStarted == true) {
                hideShowContent('mobileAboutMenu', 'add');  //blendet das Hamburger-Menu aus wenn das Handy hochkant gehalten wird und das spiel bereits gestartet wurde
            } if (gameStarted == true && window.innerWidth > 700) {
                hideShowContent('pauseEndGameBtns', 'remove');
            }
        }

        //-- Desktop-View
        if (!mediaQuery.matches) {
            initDesktopView();
        }

    }, 200);
}

function initMobileView() {
    hideShowContent('mobileAboutMenu', 'remove'); //zeigt das Hamburger-Menu an
    hideShowContent('menuBoard', 'add'); //blendet das Menu der Desktop-Ansicht aus
    hideShowContent('buttonBoard', 'add'); //blendet das buttonBoard der Desktop-Ansicht aus
}

function initMobileLandscapeView() {
    hideShowContent('pauseEndGameBtns', 'add');
    hideShowContent('nav', 'add');
    soundBtnMobile();
    document.getElementById('startImg').classList.add('startImgMobileHorizontal');
    document.getElementById('startImg').classList.remove('startImgMobileVertical');
    document.getElementById('canvas').style.height = '100vh';
}

function initMobileGameView() {
    hideShowContent('mobileMenu', 'remove');     //zeigt die Einstellungsbuttons mit den Symbolen an
    hideShowContent('mobileCtrlBtnDiv1', 'remove');
    hideShowContent('mobileCtrlBtnDiv2', 'remove');
    hideShowContent('mobileAboutMenu', 'add'); //blendet das Hamburger-Menu aus
    hideShowContent('mobileAboutDiv', 'add'); //blenet die mobileAboutDiv aus
}

function initDesktopView() {
    hideShowContent('mobileAboutMenu', 'add'); //blendet das Hamburger-Menu aus
    hideShowContent('menuBoard', 'remove'); //zeigt das Menu der Desktop-Ansicht an
    hideMobileGameUI();
    testIfButtonBoardMustBeShown();
}

function hideMobileGameUI() {
    hideShowContent('mobileCtrlBtnDiv1', 'add');
    hideShowContent('mobileCtrlBtnDiv2', 'add');
}

function testIfButtonBoardMustBeShown() {
    if (buttonBoardShown === true) {
        hideShowContent('buttonBoard', 'remove'); //zeigt das buttonBoard der Desktop-Ansicht an
    }
}

function adjustButtonBoardFlag(param) {
    buttonBoardShown = param;
}

function adjustStartImageOrientation(isHorizontal) {
    const img = document.getElementById('startImg');
    img.classList.toggle('startImgMobileHorizontal', isHorizontal);
    img.classList.toggle('startImgMobileVertical', !isHorizontal);
}

function hideShowContent(param1, param2) {
    document.getElementById(param1).classList[param2]('d-none');
}

function hideShowContent2(param1, param2) {
    document.getElementById(param1).classList[param2]('display-none');
}

function testIfDeviceIsVertivalOrHorizontal() {
    if (window.innerWidth > window.innerHeight && gameStarted == true) {  //-- if device is horizontal
        initHorizontalView();
        deviceVertical = true;
        if (deviceWasTurned) {
            initGameStartedHorizontalView();
            deviceWasTurned = false;
        }
    } else {  //-- device is vertical
        initVerticalView();
        if (gameStarted == true) {
            initGameStartedVerticalView();
            deviceVertical = false;
            deviceWasTurned = true;
        }
    } if (window.innerWidth < 600) {
        initSmallVertikal();
    }
}

function initHorizontalView() {
    hideShowContent('turnDeviceTxtDiv', 'add');  // div "Turn Your devide" ausblenden
    hideShowContent('fullscreen', 'remove');
}

function initGameStartedHorizontalView() {
    resumeGame();              // reaktiviert das Spiel, nachdem das Smartphone in die horizontale Position gedreht wurde    
    toggleBtn('pauseGameBtnMobile', false);       // reaktiviert den durch das Pausieren des SPiels in der vertikalen Ansicht deaktivierten Pause-Button
}

function initVerticalView() {
    document.getElementById('startImg').classList.add('startImgMobileVertical');
    document.getElementById('startImg').classList.remove('startImgMobileHorizontal');
    document.getElementById('canvas').style.height = 'auto';
    hideShowContent('nav', 'remove');
}

function initGameStartedVerticalView() {
    hideShowContent('turnDeviceTxtDiv', 'remove');   // div "Turn Your device" einblenden
    pauseGame();         // pausiert das Spiel, wenn das Smartphone vertikal gehalten wird
    hideShowContent('pauseEndGameBtns', 'add');
    hideShowContent('fullscreen', 'add');
    document.body.classList.add('no-scroll');
}

function initSmallVertikal() {
    if (document.getElementById('about-btns')) {
        hideShowContent('about-btns', 'add');
    }
}

function fullScreenMobile() {
    setInterval(() => {
        if (mobileWindow && deviceVertical) {
            document.getElementById('canvas').classList.add('canvasMaxHeight');
            document.getElementById('fullscreen').classList.add('fullscreenMobile');
            document.getElementById('startImg').classList.add('startImgMobile');
        }

        if (mobileWindow === false /*&& deviceVertical*/) {
            document.getElementById('startImg').classList.remove('startImgMobileHorizontal');
            document.getElementById('startImg').classList.remove('startImgMobileVertical');
            document.getElementById('canvas').classList.remove('canvasMaxHeight');  //-- beendet Fullscreen wenn keine mobile Ansicht mehr vorliegt
            document.getElementById('canvas').style.height = '480px';    //-- beendet Fullscreen wenn keine mobile Ansicht mehr vorliegt
            hideShowContent('nav', 'remove');
        }
    }, 200);
}

function soundBtnMobile() {
    document.getElementById('soundBtn').classList.add('soundBtnMobile');
}

function soundBtnDesktop() {
    document.getElementById('soundBtn').classList.remove('soundBtnMobile');
}

function showAboutPanel() {
    hideShowContent('regelnDiv', 'remove');
}


function showMobileAboutMenu() {
    if (showMobileAboutMenuVar == false) {
        hideShowContent('mobileAboutDiv', 'remove'); //zeigt die mobileAboutDiv an
        hideShowContent('mobileAboutMenuBurgerImg', 'add');  // blendet im Toggle-Button das Hamburger-Menu aus
        hideShowContent('mobileAboutMenuXImg', 'remove'); //blendet im Toggle-Button das "X" zum Schließen der mobileAboutDiv ein 
        hideShowContent('greyBgrDiv', 'remove')
        showMobileAboutMenuVar = true;
    } else if (showMobileAboutMenuVar == true) {
        hideShowContent('mobileAboutDiv', 'add');
        hideShowContent('mobileAboutMenuBurgerImg', 'remove');
        hideShowContent('mobileAboutMenuXImg', 'add');
        hideShowContent('greyBgrDiv', 'add');
        showMobileAboutMenuVar = false;
    }
}

function hideShowContentAndMenu() {
    showMobileAboutMenu();
    hideShowContent('mobileAboutDiv', 'add');
    hideShowContent('greyBgrDiv', 'add');
}