
let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu , Play]
}
 let game = new Phaser.Game(config);
 let keyF, keyR, keyLEFT, keyRIGHT, keyDOWN, keyA, keyD, comma, space;
 let borderUISize = game.config.height / 15;
 let borderPadding = borderUISize / 3;

let mode = false;



//Ellen Kim 
//Assignment: Rocket Patrol Mods - Donut Kitty Blaster
// April 19 2022
// Took about 10 hours

// Point Breakdown:
// 60 points: redesign artwork, UI, sounds
// 30 points: simultaneous two-player mode
// 10 points: parallax scrolling
// 5 points: control rocket after launched