# Corona Buster

<p align='center'>
  <img src='https://github.com/ajgquional/Timedoor_CoronaBuster/blob/8b5446c288c8f58175887bcee1209af59db0f544/CoronaBusterSampleOutput.png' alt='Sample Corona Buster game' width='281.5' height='469'>
</p>

## Description of the game
This is the third Phaser game of Intermediate 2 of the Intermediate JavaScript class of Timedoor Coding Academy. In this game, players have to control a ship character by pressing left and right arrow keys in the game screen to move left and right, respectively. Additionally, a shoot button is placed and once it is pressed, a laser would be fired from the ship. The main objective of the player is to earn as many score as he/she can by destroying the viruses (using the ship's laser) that would spawn from the top of the screen. When the ship collides with the virus, the player's life would decrease by one. Player can increase his/her life by collecting hand sanitizers that would randomly spawn from the top of the screen. Once the player loses all its lives, it would be game over but the player has a chance to play the game again by clicking the replay button in the Game Over Scene.

The codes for this game are mostly copied from Timedoor's Intermediate JavaScript course book, but modified due to personal preference and due to existence of errors in the original source code. The codes here (especially the scenes code) are highly annotated and documented for clarity.

## About the repository
This repository only contains the source codes as well as assets linked in the book (as a Google Drive link). Thus, this repository is mainly for reference. Should you wish to use these files, you may download them and copy them to the template folder but make sure first that a Phaser framework is installed in your local machine and necessary steps have been conducted (such as installation of node.js and Visual Studio Code). Afterwards, the public (which contains the assets) and src (which contains all the source codes) folders can be copied in the game folder. The "game" can be run by typing the command ```npm run start``` in the terminal within Visual Studio Code, then clicking on the local server link (for instance, localhost:8000) in the terminal. The game will then open in your default browser.

### Notes on the content of the repository:
* public - contains two sub-folders separating the assets according to type
  * images - contains all image assets for the main game scene (CoronaBusterScene) as well as the game over scene (GameOverScene)
  * sfx - contains all sound effects as well as options for the background music (inside "Backsound" folder)
* src - contains the source codes mainly contained in two sub-folders, as well as ```index.html``` and ```main.js```
  * scenes - contains the main game scene (```CoronaBusterScene.js```) as well as the game over scene (```GameOverScene.js```)
  * ui - contains the object classes needed for the game
    * ```FallingObject.js``` - to create the virus and hand sanitizers
    * ```Laser.js``` - to create the ship laser
    * ```LifeLabel.js``` - to create the life text in the main game scene
    * ```ScoreLabel.js``` - to create the score text in the main game scene as well as game over scene
    
## Summarized game mechanics and link to sample game
- Platforms: 
  - Mobile phone or Tablet (movement and shoot action can be done using the buttons in the game screen)
  - PC (movement and shoot action can be done using left/right arrow keys as well as the spacebar in the keyboard)
- Controls: 
  - Left arrow button/left arrow key to move left
  - Right arrow button/right arrow key to move right
  - Shoot button/space bar to fire laser
- Rules:
  - Destroy as many viruses as you can before your life runs out.
  - Life would decrease when a virus hits you.
  - Life can be increased by collecting hand sanitizers.
  - Virus speed would increase by 30 every time the score reaches a multiple of 100.
  - Once the player's life goes down to 0, the game is over.
- Link to the sample game: https://td-coronabuster-adrian.netlify.app/
  
