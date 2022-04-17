class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload(){
        this.load.audio('sfx_select', './assets/assets_blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/meow.wav');
        this.load.audio('sfx_rocket', './assets/bloop.wav');
        this.load.audio('background_music', './assets/backgroundmusic.mp3');
        this.load.image('menu', './assets/menu.png');
    }
    create() {
        this.menu = this.add.tileSprite(0,0, 640, 480, 'menu').setOrigin(0,0);
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '20px',
            //backgroundColor: "#FFC4BD",
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        //this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'Donut Kitty Blast', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/1.3, 'Use ←→ arrows to move & (F) to shoot', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#FFC4BD';
        menuConfig.color = '#000';
        this.add.text(game.config.width/2, game.config.height/1.35 + borderUISize + borderPadding, 'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);

        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        //var bgmusic = this.sound.play('background_music');
        //bgmusic.play();
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            game.settings = {
                spaceshipSpeed: 3,
                gameTimer: 60000,
                mode: false
            }
            this.sound.play('sfx_select');
            this.scene.start('playScene');
            //bgmusic.stop();
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            game.settings = {
                spaceshipSpeed: 4,
                gameTimer: 45000,
                mode: false
            }
            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }

        if (Phaser.Input.Keyboard.JustDown(keyDOWN)){
            game.settings = {
                spaceshipSpeed: 4,
                gameTimer: 50000,
                mode: true
            }
            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }
    }
}