import Phaser from 'phaser'
export default class FallingObject extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, texture, config)
    {
        super(scene, x, y, texture);
        this.scene = scene;
        this.speed = config.speed;
        this.rotationVal = config.rotation;
    }

    spawn(x) 
    {
        const positionY = Phaser.Math.Between(-50, -70);
        this.setPosition(x, positionY);
        this.setActive(true);
        this.setVisible(true);
    }
    
    die() 
    {
        this.destroy();
    }

    update(time) 
    {
        // constantly move the falling objects downward
        this.setVelocityY(this.speed)
        this.rotation += this.rotationVal

        // gets the entire height of the screen
        const gameHeight = this.scene.scale.height
        
        // if falling objects go below the game screen, automatically delete them
        if (this.y > gameHeight + 5) {
            this.die()
        }
    }
}