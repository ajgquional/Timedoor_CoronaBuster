import Phaser from 'phaser'

// importing the classes from the "ui" folder
import FallingObject from '../ui/FallingObject.js'  // to create virus and hand sanitizer objects
import Laser from '../ui/Laser.js'                  // to create laser object
import ScoreLabel from '../ui/ScoreLabel.js'        // to create score text object
import LifeLabel from '../ui/LifeLabel.js'          // to create life text object

export default class CoronaBusterScene extends Phaser.Scene
{
    constructor()
    {
		super("corona-buster-scene");
	}

    init()
    {
		// variables for objects in the game

		this.clouds = undefined;

		// buttons
		this.nav_left = false;
		this.nav_right = false;
		this.shoot = false;

		// player
		this.player = undefined;
		this.speed = 150; // default speed in the book is 100

		// keyboard object (for keyboard control)
		this.cursors = undefined;

		// enemies
		this.enemies = undefined;
		this.enemySpeed = 60;

		// laser
		this.lasers = undefined;
		this.lastFired = 0;

		// score
		this.scoreLabel = undefined;

		// life
		this.lifeLabel = undefined;

		// hand sanitizer
		this.handsanitizer = undefined;

		// background music
		this.backsound = undefined;
	}

    preload()
    {
		// loading the image assets

		// game environment
		this.load.image("background", "images/bg_layer1.png"); // background sky
		this.load.image("cloud", "/images/cloud.png"); // clouds

		// buttons
		this.load.image("left-btn", "images/left-btn.png"); // left button
		this.load.image("right-btn", "images/right-btn.png"); // right button
		this.load.image("shoot-btn", "images/shoot-btn.png"); // shoot button

		// player sprite sheet
		this.load.spritesheet("player", "images/ship.png", {
			frameWidth: 66,
			frameHeight: 66,
		});

		// enemy
		this.load.image("enemy", "images/enemy.png");

		// laser
		this.load.spritesheet("laser", "images/laser-bolts.png", {
			frameWidth: 16,
			frameHeight: 32,
			startFrame: 16,
			endFrame: 32,
		});

		// hand sanitizer
		this.load.image("handsanitizer", "images/handsanitizer.png");

		// loading sound effects
		this.load.audio("laserSound", "sfx/sfx_laser.ogg");
		this.load.audio("destroySound", "sfx/destroy.mp3");
		this.load.audio("handsanitizerSound", "sfx/handsanitizer.mp3");
		this.load.audio("backsound", "sfx/backsound/RaiOfLasers.ogg");
        this.load.audio("gameOverSound", "sfx/gameover.wav");
        this.load.audio("hit", "sfx/hit.mp3");
	}

    create()
    {
		// =============== OBJECT CREATION ===============

		// creating the background image
		const gameWidth = this.scale.width * 0.5; // getting half of the game screen width
		const gameHeight = this.scale.height * 0.5; // getting half of the game screen height
		this.add.image(gameWidth, gameHeight, "background"); // creating the image using game screen center coordinates

		this.clouds = this.physics.add.group({
			key: "cloud",
			repeat: 10, // repeat the display of clouds 10 times
		});

		// creating clouds in random position within the game screen
		Phaser.Actions.RandomRectangle(
			this.clouds.getChildren(),
			this.physics.world.bounds
		);

		// creating the buttons
		this.createButton();

		// creating the player
		this.player = this.createPlayer();

		// creating the keyboard object
		this.cursors = this.input.keyboard.createCursorKeys();

		// creating the enemies
		// adding Physics to the enemies
		this.enemies = this.physics.add.group({
			classType: FallingObject,
			maxSize: 10, // the number of enemies in one group
			runChildUpdate: true,
		});

		// calls the spawnEnemy method every 2s (unit is in milliseconds, 2000 ms = 2 s)
		this.time.addEvent({
			delay: 2000, // 2 secs
			callback: this.spawnEnemy,
			callbackScope: this,
			loop: true,
		});

		// creating the lasers
		// adding Physics to the lasers
		this.lasers = this.physics.add.group({
			classType: Laser,
			maxSize: 10,
			runChildUpdate: true,
		});

		// creating the hand sanitizers
		// adding Physics to the hand sanitizers
		this.handsanitizers = this.physics.add.group({
			classType: FallingObject,
			runChildUpdate: true,
		});

		// calls the spawnHandsanitizer method every 10s (unit is in milliseconds, 10000 ms = 10 s)
		this.time.addEvent({
			delay: 10000, // 10 secs
			callback: this.spawnHandsanitizer,
			callbackScope: this,
			loop: true,
		});

		// creating the score text with default score as 0
		this.scoreLabel = this.createScoreLabel(16, 16, 0);

		// creating the life text with default number of lives as 3
		this.lifeLabel = this.createLifeLabel(16, 43, 3);

		// =============== COLLISIONS AND OVERLAPS ===============

		// checking the overlap between laser and enemy
		this.physics.add.overlap(
			this.lasers,
			this.enemies,
			this.hitEnemy, // calling the hitEnemy method when the overlap happened
			null,
			this
		);

		// checking the overlap between player and enemy
		this.physics.add.overlap(
			this.player,
			this.enemies,
			this.decreaseLife, // calling the decreaseLife method when the overlap happened
			null,
			this
		);

		// checking the overlap between player and hand sanitizer
		this.physics.add.overlap(
			this.player,
			this.handsanitizers,
			this.increaseLife, // calling the increaseLife method when the overlap happened
			null,
			this
		);

		// playing the background music
		this.backsound = this.sound.add("backsound");
		var soundConfig = {
			loop: true,
			volume: 0.25,
		};
		this.backsound.play(soundConfig);
	}

    update(time)
    {
		// for all the children clouds, move downward until they are below the game screen
		// then, bring them back to the top of the screen
		this.clouds.children.iterate((child) => {
			child.setVelocityY(20); // moving the clouds downward with velocity of 20

			// checking if each cloud is below the game screen
			// y - coordinate of the cloud should be greater than the total height of the screen
			if (child.y > this.scale.height) {
				// moving the cloud back to the top of the screen with a randomized x-coordinate
				child.x = Phaser.Math.Between(10, 400);
				child.y = child.displayHeight * -1;
			}
		});

		// constantly call the movePlayer method to be able to always control the player
		this.movePlayer(this.player, time);
	}

	// this method creates all player buttons
    createButton()
    {
		// adding the left, right, and shoot buttons in the screen
		this.input.addPointer(3);
		// placing the shoot button in its correct position, making it clickable, setting its depth and transparency
		let shoot = this.add
			.image(320, 550, "shoot-btn")
			.setInteractive()
			.setDepth(0.5)
			.setAlpha(0.8);
		// placing the left button in its correct position, making it clickable, setting its depth and transparency
		let nav_left = this.add
			.image(50, 550, "left-btn")
			.setInteractive()
			.setDepth(0.5)
			.setAlpha(0.8);
		// placing the right button in its correct position, making it clickable, setting its depth and transparency
		let nav_right = this.add
			.image(nav_left.x + nav_left.displayWidth + 20, 550, "right-btn")
			.setInteractive()
			.setDepth(0.5)
			.setAlpha(0.8);

        // "pointerdown" means button is pressed
        // "pointerup" means button is released
        // changing the status of left button
		nav_left.on("pointerdown", () => { this.nav_left = true}, this);
		nav_left.on("pointerup", () => { this.nav_left = false}, this );

        // changing the status of the right button
		nav_right.on("pointerdown", () => { this.nav_right = true}, this);
		nav_right.on("pointerup", () => { this.nav_right = false}, this);

        // changing the status of the shoot button
		shoot.on("pointerdown", () => { this.shoot = true}, this);
		shoot.on("pointerup", () => { this.shoot = false}, this);
	}

	// this method creates the player and its animations
    createPlayer()
    {
		// placing the player in its starting position and bounding it to the game screen
		const player = this.physics.add.sprite(200, 450, "player");
		player.setCollideWorldBounds(true);

		// creating the turn animation (this is the default animation of the ship when it's not moving)
		this.anims.create({
			key: "turn",
			frames: [{ key: "player", frame: 0 }],
		});

		// creating the turning left animation
		this.anims.create({
			key: "left",
			frames: this.anims.generateFrameNumbers("player", {
				start: 1,
				end: 2,
			}),
			frameRate: 10,
		});

		// creating the turning right animation
		this.anims.create({
			key: "right",
			frames: this.anims.generateFrameNumbers("player", {
				start: 1,
				end: 2,
			}),
			frameRate: 10,
		});

		// returns the player object after it has been created
		return player;
	}

	// this method is for the control of the ship
    movePlayer(player, time)
    {
		// keyboard controls are only for testing
		// actual controls (when the game is deployed) are the buttons in the game screen

		// if left button on screen or left arrow key is pressed, move the ship to the left then play corresponding animation
		if (this.nav_left || this.cursors.left.isDown) {
			this.player.setVelocityX(this.speed * -1);
			this.player.anims.play("left", true);
			this.player.setFlipX(false);
		}

		// if right button on screen or right arrow key is pressed, move the ship to the right then play corresponding animation
		else if (this.nav_right || this.cursors.right.isDown) {
			this.player.setVelocityX(this.speed);
			this.player.anims.play("right", true);
			this.player.setFlipX(true);
		}

		// if vertical movement will be implemented, uncomment the lines below
		/*
        // if up arrow key is pressed, move the ship up
		else if (this.cursors.up.isDown) {
			this.player.setVelocityY(this.speed * -1);
			this.player.anims.play("turn", true);
		}

        // if down arrow key is pressed, move the ship down
		else if (this.cursors.down.isDown) {
			this.player.setVelocityY(this.speed);
			this.player.anims.play("turn", true);
        }
        */

		// if neither buttons are pressed, make the ship stationary then play corresponding animation
		else {
			this.player.setVelocityX(0);
			// if there is vertical movement, uncomment line below
			//this.player.setVelocityY(0);
			this.player.anims.play("turn");
		}

		// if shoot button or spacebar is pressed, fire a laser
		if ((this.shoot || this.cursors.space.isDown) && time > this.lastFired) {
			const laser = this.lasers.get(0, 0, "laser");

			if (laser) {
				laser.fire(this.player.x, this.player.y);
				this.lastFired = time + 150; // time interval for firing of laser can be changed; try 30 or 500
				this.sound.play("laserSound", { volume: 0.75 });
			}
		}
	}

	// this method handles the spawn of the enemies
    spawnEnemy()
    {
		// enemy properties
		// positive rotation is clockwise, negative rotation is counter-clockwise
		// try these values for rotation: 0, -1, 0.1
		const config = {
			speed: this.enemySpeed,
			rotation: 0.06,
		};
		const enemy = this.enemies.get(0, 0, "enemy", config);
		const enemyWidth = enemy.displayWidth;
		const positionX = Phaser.Math.Between(
			enemyWidth,
			this.scale.width - enemyWidth
		); // randomizing the x-coordinate

		// spawning the enemy using the randomized x-coordinate as its position
		if (enemy) {
			enemy.spawn(positionX);
		}
	}

	// this method handles the overlap between the laser and the enemy
    hitEnemy(laser, enemy)
    {
		laser.erase(); // laser would be destroyed
		enemy.die(); // enemy would be destroyed

		this.sound.play("destroySound", { volume: 0.75 }); // destroy sound effect would be played

		this.scoreLabel.add(10); // increments the score by 10

		// enemies' speed will increase by 30 whenever the score becomes a multiple of 100
		if (this.scoreLabel.getScore() % 100 == 0) {
			this.enemySpeed += 30;
		}
	}

	// this method creates the score text
	// takes in the x- and y-coordinates as well as the score as input
    createScoreLabel(x, y, score)
    {
		// text style can be configured
		const style = {
			fontSize: "32px",
			fill: "#000",
		};

		// creates the actual text using the x- and y-coordinates and score specified in the method call
		// as well as the text style defined above
		const label = new ScoreLabel(this, x, y, score, style).setDepth(1);

		// updates the text that is already existing
		this.add.existing(label);

		// returns the score label object
		return label;
	}

	// this method creates the life text
	// takes in the x- and y-coordinates as well as the life value as input
    createLifeLabel(x, y, life)
    {
		// text style can be configured
		const style = {
			fontSize: "32px",
			fill: "#000",
		};

		// creates the actual text using the x- and y-coordinates and life specified in the method call
		// as well as the text style defined above
		const label = new LifeLabel(this, x, y, life, style).setDepth(1);

		// updates the text that is already existing
		this.add.existing(label);

		// returns the life label object
		return label;
	}

	// this method handles the decrease in the life of the player when the player and enemy overlaps
    decreaseLife(player, enemy)
    {
		// when player and enemy overlaps, enemies dies and player's life is decreased by 1
		enemy.die();
		this.lifeLabel.subtract(1);

		this.sound.play("hit", { volume: 0.5 }); // hit sound effect would be played

		// if life = 2, player ship would change color (0xff0000 == red)
		if (this.lifeLabel.getLife() == 2) {
			player.setTint(0xff0000);
		}

		// if life = 1, make the player ship semi-transparent
		else if (this.lifeLabel.getLife() == 1) {
			player.setTint(0xff0000).setAlpha(0.2);
		}

		// if life = 0, move to game over scene and set the score
		else if (this.lifeLabel.getLife() == 0) {
			this.scene.start("game-over-scene", {
				score: this.scoreLabel.getScore(),
			});

			// stops all sound and play the game over sound
			this.sound.stopAll();
			this.sound.play("gameOverSound", { volume: 0.75 });
		}
	}

	// this method handles the spawn of the hand sanitizers
    spawnHandsanitizer()
    {
		// hand sanitizer properties
		const config = {
			speed: 60,
			rotation: 0,
		};

		const handsanitizer = this.handsanitizers.get(0, 0, "handsanitizer", config);
		const handsanitizerWidth = handsanitizer.displayWidth;
		const positionX = Phaser.Math.Between(
			handsanitizerWidth,
			this.scale.width - handsanitizerWidth
		); // randomizing the x-coordinate

        // actual creation of the hand sanitizer
		if (handsanitizer) {
			handsanitizer.spawn(positionX);
		}
	}

    // this method handles the increase in the life of the player
    increaseLife(player, handsanitizer)
    {
		// when hand sanitizer is collected, it would disappear from the game
		// add 1 to life then play sound effect
		handsanitizer.die();
        this.lifeLabel.add(1);
        this.sound.play("handsanitizerSound", {volume : 0.75});

		// if life >= 3, ship will go back to its original appearance
		if (this.lifeLabel.getLife() >= 3) {
			player.clearTint().setAlpha(2);
		}
	}
}
