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
        this.load.image('frame', './assets/frame.png');
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
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Down);
    

        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start:0, end:13, first: 0}),
            frameRate: 20
        })

        this.frame = this.add.tileSprite(0,0, 640, 480, 'frame').setOrigin(0,0);

        this.p1Score = 0;
        this.p2Score = 0;
        let scoreConfig = {
            fontFamily: "Courier",
            fontSize: '28px',
            backgroundColor: "red",
            color: '#843605',
            align: 'right',
            padding: {
                top: 10,
                bottom: 5,
            },
            fixedWidth: 100
        }
        if (game.settings.mode == true) {
            let scoreConfig2 = {
                fontFamily: "Courier",
                fontSize: '28px',
                backgroundColor: "blue",
                color: '#843605',
                align: 'left',
                padding: {
                    top: 5,
                    bottom: 5,
                },
                fixedWidth: 100
            }
            this.scoreRight = this.add.text((game.config.width * (3/4)) + 15 , borderUISize + borderPadding*2, this.p2Score, scoreConfig2);
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        this.gameOver = false;
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 +64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
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
}