import Phaser from 'phaser'
export default class Laser extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, texture) 
    {
        super(scene, x, y, texture);
        this.setScale(2);
        this.speed = 200;
    }
 
    fire(x,y)
    {
        // laser would always spawn on the same x-coordinate as the player but 50px above it
        this.setPosition(x, y - 50);
        this.setActive(true);
        this.setVisible(true);
    }

    erase()
    {
        this.destroy();
    }

    update(time)
    {
        // constantly move the laser upward
        this.setVelocityY(this.speed * -1);
        
        // if laser goes above the game screen, automatically delete it
        if(this.y < -10) {
            this.erase();
        }
    }
}