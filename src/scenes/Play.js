class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    preload() {
        this.load.image('rocket', './assets/donut.png');
        this.load.image('rocket2', './assets/chocdonut.png');
        this.load.image('spaceship', './assets/cats.png');
        this.load.image('clouds', './assets/clouds.png');
        this.load.image('conveyer_belt', './assets/conveyer_belt.png');
        this.load.image('P1frame', './assets/P1frame.png');
        this.load.image('P2frame', './assets/P2frame.png');
        this.load.image('control1', './assets/control1.png');
        this.load.image('control2', './assets/control2.png');
        this.load.image('gameover', './assets/gameover.png')
        this.load.spritesheet('explosion', './assets/chomp.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 13});
    }
    create() {
        this.clouds = this.add.tileSprite(0,0, 640, 480, 'clouds').setOrigin(0,0);
        this.belt = this.add.tileSprite(0,0, 640, 480, 'conveyer_belt').setOrigin(0,0);

        //this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        if (game.settings.mode == true) {
            this.p1Rocket = new Rocket(this, game.config.width/3, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
            this.p2Rocket = new Rocket2(this, (game.config.width/3) *2, game.config.height - borderUISize - borderPadding, 'rocket2').setOrigin(0.5, 0);
            
        } else {
            this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        }
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*3.5, 'spaceship', 0, 30).setOrigin(0,0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*4.75 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);

        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        comma = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.COMMA);

        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start:0, end:13, first: 0}),
            frameRate: 20
        })

        this.P1frame = this.add.tileSprite(0,0, 640, 480, 'P1frame').setOrigin(0,0);
        if (game.settings.mode == true){
            this.P2Frame = this.add.tileSprite(0,0,640,480, 'P2frame').setOrigin(0,0);
            this.control2 = this.add.tileSprite(0,0,640, 480, 'control2').setOrigin(0,0);
        } else {
            this.control1 = this.add.tileSprite(0,0,640, 480, 'control1').setOrigin(0,0);
        }


        this.p1Score = 0;
        this.p2Score = 0;
        let scoreConfig = {
            fontFamily: "Comic Sans MS",
            fontSize: '22px',
            backgroundColor: "transparent",
            color: '#843605',
            align: 'right',
            padding: {
                top: 10,
                bottom: 0,
            },
            fixedWidth: 100
        }
        if (game.settings.mode == true) {
            let scoreConfig2 = {
                fontFamily: "Comic Sans MS",
                fontSize: '22px',
                backgroundColor: "transparent",
                color: '#843605',
                align: 'left',
                padding: {
                    top: 10,
                    bottom:10,
                },
                fixedWidth: 50
            }
            this.scoreRight = this.add.text((game.config.width * (3/4)) + 18 , borderUISize + borderPadding*2, this.p2Score, scoreConfig2);
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        this.gameOver = false;
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.gameover = this.add.tileSprite(0,0,640, 480, 'gameover').setOrigin(0,0);
            //this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            //this.add.text(game.config.width/2, game.config.height/2 +64, 'Press (R) to Restart or ??? for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        this.bgmusic = this.sound.add('background_music');
        this.bgmusic.play();
        this.bgmusic.loop = true;
    }
    update() {
        if (this.gameOver) {
            this.bgmusic.stop();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        if (!this.gameOver) {
            this.clouds.tilePositionX += 0.5;
            this.belt.tilePositionX += game.settings.spaceshipSpeed;
            this.p1Rocket.update();
            if (game.settings.mode == true) {
                this.p2Rocket.update()
            }
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
        }
        if( this.checkCollision(this.p1Rocket, this.ship03)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if (game.settings.mode == true) {
            if (this.checkCollision(this.p2Rocket, this.ship03)){
                this.p2Rocket.reset();
                this.shipExplode2(this.ship03);
            }
            if (this.checkCollision(this.p2Rocket, this.ship02)){
                this.p2Rocket.reset();
                this.shipExplode2(this.ship02);
            }
            if (this.checkCollision(this.p2Rocket, this.ship01)){
                this.p2Rocket.reset();
                this.shipExplode2(this.ship01);
        } }
    }

    checkCollision(rocket, ship) {
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
                return true;
            } else {
            return false;
        }
    }

    shipExplode(ship) {
        ship.alpha = 0;

        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0,0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        
        this.sound.play('sfx_explosion');
    }
    shipExplode2(ship) {
        ship.alpha = 0;

        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0,0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });
        this.p2Score += ship.points;
        this.scoreRight.text = this.p2Score;
        
        this.sound.play('sfx_explosion');
    }
}