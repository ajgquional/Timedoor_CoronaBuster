import Phaser from 'phaser'

// book says to add a replayButton global variable but it can actually be removed
//var replayButton;

export default class GameOverScene extends Phaser.Scene
{
    constructor()
    {
        super('game-over-scene');
    }

    init(data)
    {
        this.score = data.score;
    }

    preload()
    {
        // loading image assets
        this.load.image('background', 'images/bg_layer1.png'); 
        this.load.image('gameover', 'images/gameover.png');
        this.load.image('replay', 'images/replay.png');  
    }

    create()
    {
        this.add.image(200, 320, 'background'); // creating the background sky
        this.add.image(200, 200, 'gameover');   // creating the game over text

        // creating replay button and making it clickable
        this.replayButton = this.add.image(200, 350, 'replay').setInteractive();
        
        // when replay button is pressed, change to game scene
        this.replayButton.once('pointerdown', () => { 
            this.scene.start('corona-buster-scene')
        }, this);
        
        // displaying the text "SCORE" as well as the value
        this.add.text(60, 450, `SCORE:${this.score}`, {
			fontSize: "60px",
			fill: "#000",
		});
    }
}