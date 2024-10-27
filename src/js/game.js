const BALL = "ball"
const PLATFORM = "platform"
const BACKGROUND = "background"

function isMobile() {
    return window.innerWidth <= 768;
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#3498db',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale: {
        mode: isMobile() ? Phaser.Scale.FIT : Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'phaser-game',
    }
};

const game = new Phaser.Game(config);

let platform;
let ball;
let cursors;
let score = 0;
let scoreText;
let gameOverText;

function preload() {
    this.load.image(BACKGROUND, './img/background.png');
    this.load.image(PLATFORM, './img/platform.png');
    this.load.image(BALL, './img/sponge.png');
}

function create() {
    this.add.image(400, 300, BACKGROUND).setOrigin(0.5, 0.5).setDisplaySize(800, 600);
    platform = this.physics.add.staticImage(400, 585, PLATFORM).setScale(0.3).refreshBody();
    ball = this.physics.add.image(400, 300, BALL).setScale(0.1).setBounce(1).setCollideWorldBounds(true).setVelocity(100, 100);
    this.physics.add.collider(ball, platform, bounceBall, null, this);
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#FFF' });

    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    this.input.on('pointermove', function (pointer) {
        platform.x = Phaser.Math.Clamp(pointer.x, platform.displayWidth / 2, config.width - platform.displayWidth / 2);
        platform.refreshBody();
    });

    if (cursors.left.isDown) {
        platform.x = Math.max(platform.x - 5, platform.displayWidth / 2);
        platform.refreshBody();
    } else if (cursors.right.isDown) {
        platform.x = Math.min(platform.x + 5, config.width - platform.displayWidth / 2);
        platform.refreshBody();
    }

    if (ball.y + platform.displayHeight - 20 > platform.y) {
        this.physics.pause();
        scoreText.setText('Game Over! Score: ' + score);

        if (!gameOverText) {
            gameOverText = this.add.text(config.width / 2, config.height / 2, 'Tap to Restart', { fontSize: '32px', fill: '#FFF' })
                .setOrigin(0.5)
                .setInteractive()
                .on('pointerdown', () => restartGame.call(this));
        } else {
            gameOverText.setVisible(true);
        }
    }
}

function bounceBall(ball) {
    score += 1;
    scoreText.setText('Score: ' + score);

    const speedIncreaseFactor = 1.4;
    const newVelocityX = ball.body.velocity.x * speedIncreaseFactor;
    const newVelocityY = ball.body.velocity.y * speedIncreaseFactor;

    const maxVelocity = 500;
    ball.setVelocity(
        Phaser.Math.Clamp(newVelocityX, -maxVelocity, maxVelocity),
        Phaser.Math.Clamp(newVelocityY, -maxVelocity, maxVelocity)
    );

    const randomAngle = Phaser.Math.Between(-30, 20);
    ball.setVelocityX(ball.body.velocity.x + randomAngle);
    ball.setVelocityY(ball.body.velocity.y + randomAngle);
}

function restartGame() {
    score = 0;
    scoreText.setText('Score: ' + score);

    if (gameOverText) {
        gameOverText.setVisible(false);
    }
    ball.setPosition(400, 300);
    ball.setVelocity(100, 100);
    this.physics.resume();
}