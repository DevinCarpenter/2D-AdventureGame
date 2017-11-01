docReady(function() {
// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container.
//var app = new PIXI.Application();

// The application will create a canvas element for you that you
// can then insert into the DOM.
//node.appendChild(app.view);
//document.body.appendChild(app.view);

//var app = new PIXI.Application(1000, 900, {backgroundColor : 0x1099bb});
//document.body.appendChild(app.view);

//Create the renderer
//var renderer = PIXI.autoDetectRenderer();

//Add the canvas to the HTML document
//document.body.appendChild(renderer.view);

//Create a container object called the `stage`
// var gameStartScene = new PIXI.Container();
// gameStartScene.visible = false;
var stage = new PIXI.Container();
stage.visible = true;
// var gameOverScene = new PIXI.Container();
// gameOverScene.visible = false;
var height = window.innerHeight;
var width = window.innerWidth;
var canvas = document.getElementById("game-canvas");
document.getElementById("game-canvas").style.height = "100vh";
document.getElementById("game-canvas").style.width = window.innerWidth;
var upperGameBound = height-672;
var lowerGameBound = height-160;



var renderer = PIXI.autoDetectRenderer(
    window.innerWidth,
    window.innerHeight,
    {
        "antialias": true,
        "autoResize": true,
        "transparent": true,
        "resolution": 2,
        "view":canvas
    }
  );
//Initializes the variable containing the game state.
var state;

//Initialize the object that will hold each obstacle object in the game
var logOfObstacles = {};

//Initialize the arrays that will hold the objects and their id's separately
var arrayOfObstacles=[], objectIdArray=[];

//Miscellaneous variable declaration
var marioLastDirection,id;

//Initialize variable to keep track of if mario is in mid-jump
var isJumping;

//Sets the speeds for all the moving layers in the game
var forwardSpeed=15, backwardSpeed=-7, defaultMapSpeed=10,mapSpeed=1,bgSpeed=0.2,lavaSpeed=0.5;

var gameStopped=true,gameHalted=false;

var gameScore=0;

var logGenID=0;

//Tell the `renderer` to `render` the `stage`
//renderer.render(stage);

var mario,
    edgeLine,
    richText,
    richTextScore,
    farBg,
    midBg,
    nearBg,
    lavaBg; //Initializes sprites
const loader = new PIXI.loaders.Loader(); //creates a reference to Pixi loader

//Create a font style
var style = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 48,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: ['#ffffff', '#00ff99'], // gradient
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: true,
    wordWrapWidth: 440
});

// load the texture we need
loader.add('resources/images/shittymariomap.json')
      .load(function(loader, resources) {

    id = loader.resources['resources/images/shittymariomap.json'].textures;

    mario = new PIXI.Sprite(id["mario-right-1.png"]);
    marioLastDirection = "right";
    mario.x = stage.width / 2;
    mario.y = stage.height / 2;
    
    
    setup();
    initMenuListeners();
    
}); //End of loader

//Starts the game and loads all necessary game functions
function setup() {
  //Create the `mario` sprite
  mario.x = 1000; //sets mario's x-axis
  mario.y = 750; //sets mario's y-axis
  mario.hitArea = new PIXI.Rectangle(0, 0, 120, 29); //x,y,width,height
  mario.vx = 0; //sets mario's x-axis velocity 
  mario.vy = 0; //sets mario's y-axis velocity
  
  

  setKeyboardControlsListeners();
  initGameObjects();
  //stage.addChild(gameOverScene);
  //createGameStartScene();
  stage.addChild(mario);
  //Set the game state
  state = play;

  //Start the game loop
  gameLoop();
}

function initGameObjects(){
    //Creates the far background
    var farTexture = PIXI.Texture.fromImage("resources/images/background-hills.gif");
    farBg = new PIXI.extras.TilingSprite(farTexture, renderer.width, renderer.height);
    farBg.position.x = 0;
    farBg.position.y = -300;
    farBg.tilePosition.x = 0;
    farBg.tilePosition.y = 0;
    stage.addChild(farBg);

    //Creates the mid background
    //Grass gotten from https://opengameart.org/content/seamless-grass-texture
    var midTexture = PIXI.Texture.fromImage("resources/images/grass00.png");
    midBg = new PIXI.extras.TilingSprite(midTexture, renderer.width, renderer.height);
    midBg.position.x = 0;
    midBg.position.y = 500;
    midBg.tilePosition.x = 0;
    midBg.tilePosition.y = 0;
    stage.addChild(midBg);

    //Creates the lava background
    //Lava gotten from https://wakaflockaflame1.deviantart.com/art/SRE-Design-Texture-test-Lava-Floor-test-1-437362294
    var lavaTexture = PIXI.Texture.fromImage("resources/images/lava1.png");
    lavaBg = new PIXI.extras.TilingSprite(lavaTexture, 120, renderer.height);
    lavaBg.position.x = 0;
    lavaBg.position.y = 500;
    lavaBg.tilePosition.x = 0;
    lavaBg.tilePosition.y = 0;
    lavaBg.hitArea = new PIXI.Rectangle(60, 0, 120, 512);
    lavaBg.interactive = true;
    stage.addChild(lavaBg);

    //Create and add text to the stage
    richText = new PIXI.Text('Shitty Mario!', style);
    richText.x = 125;
    richText.y = 0;
    stage.addChild(richText);

    //Create and add text to the stage
    richTextScore = new PIXI.Text(`Score: ${gameScore}`, style);
    richTextScore.x = 700;
    richTextScore.y = 0;
    stage.addChild(richTextScore);

    // var graphics = new PIXI.Graphics();
    // graphics.beginFill(0xFFFFFF, 0.5);
    // graphics.lineStyle(1, 0x000000, 0.5);
    // graphics.drawRect(0, 0, 450, 1867);
    // stage.addChild(graphics);
}

//Starts the animation loop for the game
function gameLoop() {
  requestAnimationFrame(gameLoop);
  if(!gameHalted && !gameStopped){
    state();
    addObjectToBackground();
    updateScore();
  }else if(gameHalted){
    //game is halted
  }else{
    pregame();
  }  
  updateBackground();
  checkMarioInBounds();
  renderer.render(stage);
}

//This function is being run 60 times per second on a loop
function play() {
  //Use mario's velocity to make him move
  mario.x += mario.vx;
  mario.y += mario.vy;

  if (hitTestRectangle(mario, lavaBg, "mario", "lava")) {
    richText.text = "Game Over!";
    if(!gameHalted) endGame();
    //There's a collision
  } else {
    richText.text = "Shitty Mario!";
    //There's no collision
  }
}

//Function that let's mario run away when he gets too close to the lava in the menu screen
var progressing=true;
function pregame(){
  if(mario.x < width-150 && progressing){
    mario.x += 5;
    progressing=true;
  }else if(mario.x > 180){
    progressing=false;
  }else{
    progressing=true;
  }
}

//This function checks to make sure taht mario has not gone out of the playing field bounds
function checkMarioInBounds(){
  if(!isJumping){
    if(mario.y <= upperGameBound){
      mario.y = upperGameBound;
    }
  }
  if(mario.y > lowerGameBound){
    mario.y = lowerGameBound;
  }
}

function endGame(){
  mapSpeed=0;
  gameHalted=true;
  gameStopped=true;
  if(logGenID) clearInterval(logGenID);
  document.getElementById("game-over-scene").style.display = "flex";
  document.getElementById("play-again-button").removeEventListener("click",restartGame);
  document.getElementById("play-again-button").addEventListener("click",restartGame);
  document.getElementById("return-menu-button").removeEventListener("click",returnToMainMenu);
  document.getElementById("return-menu-button").addEventListener("click",returnToMainMenu);
}
function returnToMainMenu(){
    gameStopped=true;
    writeUserScore("Devin", gameScore);
    gameScore=0;
    document.getElementById("game-start-menu").style.display = "flex";
    document.getElementById("game-over-scene").style.display = "none";
    mapSpeed=1;
    mario.x = 1000; //sets mario's x-axis
    mario.y = 750; //sets mario's y-axis
    gameHalted=false;
    richTextScore.text = `Score: ${gameScore}`;
    richText.text = "Shitty Mario!";
    removeAllGameObstacles();
  }

//Creates a parallax-type background that moves the scenery along
function updateBackground() {
  farBg.tilePosition.x -= bgSpeed;
  midBg.tilePosition.x -= mapSpeed;
  lavaBg.tilePosition.x += lavaSpeed;
  mario.position.x -= mapSpeed;
  renderer.render(stage);
}

//Function that sets listeners for specific keyboard keys
function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}

//Sets the listeners up for each of the keyboard keys in the game
function setKeyboardControlsListeners(){
    //Capture the keyboard arrow keys
  var left = keyboard(37),
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40),
      wKey = keyboard(87),
      aKey = keyboard(65),
      sKey = keyboard(83),
      dKey = keyboard(68),
      jump = keyboard(32);

  //Left arrow key `press` method
  left.press = function() {
    //Change mario's velocity when the key is pressed
    mario.vx = backwardSpeed;
  };

  //Left arrow key `release` method
  left.release = function() {
    if (right.isDown) {
      mario.vx = forwardSpeed;
    }else{
      mario.vx = 0;
    }
  };

  //Up
  up.press = function() {
    if(mario.y > upperGameBound){
      mario.vy = -10;
    }else{
      mario.vy = 0;
    }
  };
  up.release = function() {
    if (!down.isDown) {
      mario.vy = 0;
    }
  };

  //Right
  right.press = function() {
    mario.vx = forwardSpeed;
  };
  right.release = function() {
    if (left.isDown) {
      mario.vx = backwardSpeed;
    }else{
      mario.vx = 0;
    }
  };

  //Down
  down.press = function() {
    if(mario.y < lowerGameBound){
      mario.vy = 10;
    }
  };
  down.release = function() {
    if (!up.isDown) {
      mario.vy = 0;
    }
  };

  //Jump (Spacebar)
  isJumping=false;
  var ypos=0;
  jump.press = function() {
    //if no jump in action, create an interval that lasts 450 ms making a jumping animation for mario
    if(!isJumping){
      isJumping=true;
      var jumpint = setInterval(function() {
          
          if(ypos >= 75)
          {
              isJumping = false;
              mario.vy = 0;
              //mario.vx = tempXVelocity;
              if (aKey.isDown) {
                mario.vx = backwardSpeed;
              }else if(dKey.isDown){
                mario.vx = forwardSpeed;
              }else{
                mario.vx = 0;
              }
              ypos=0;
              clearInterval(jumpint);
              console.log("successful jump");
          }
          else if(ypos >= 50){
            mario.vy = 30;
            //mario.vx = tempXVelocity;
            if (aKey.isDown) {
              mario.vx = backwardSpeed;
            }else if(dKey.isDown){
              mario.vx = forwardSpeed;
            }else{
              mario.vx = 0;
            }

            ypos=ypos+5;
          }
          else if(ypos >= 25){
            mario.vy = 0;
            if (aKey.isDown) {
              mario.vx = backwardSpeed;
            }else if(dKey.isDown){
              mario.vx = forwardSpeed;
            }else{
              mario.vx = 0;
            }
            if(jump.isDown){
              ypos=ypos+3;
            }else{
              ypos=ypos+5;

            }
          }
          else{
            mario.vy = -30;
            //mario.vx = 20;
            ypos=ypos+5;
          }
      }, 30);
    }
  };
  //A Key
  aKey.press = function() {
    //Change mario's velocity when the key is pressed
    mario.vx = backwardSpeed;
  };
  aKey.release = function() {
    if (dKey.isDown) {
      mario.vx = forwardSpeed;
    }else{
      mario.vx = 0;
    }
  };

  //W Key
  wKey.press = function() {
    if(mario.y > upperGameBound){
      mario.vy = -10;
    }else{
      mario.vy = 0;
    }
  };
  wKey.release = function() {
    if (!sKey.isDown) {
      mario.vy = 0;
    }
  };

  //D Key
  dKey.press = function() {
    mario.vx = forwardSpeed;
  };
  dKey.release = function() {
    if (aKey.isDown) {
      mario.vx = backwardSpeed;
    }else{
      mario.vx = 0;
    }
  };

  //S Key
  sKey.press = function() {
    if(mario.y < lowerGameBound){
      mario.vy = 10;
    }
  };
  sKey.release = function() {
    if (!wKey.isDown) {
      mario.vy = 0;
    }
  };
}

//Start an interval where logs are procedurally generated at random positions,
//but where it is possible that mario can make it through every jump.

function generateLogs(){
    logGenID = setInterval(function() {
        //TODO: create 50% chance that a log will appear every 500 ms. The
        //      log will appear at the edge of the map, and will be pushed
        //      into the player's view by it moving at the progressing speed.

        //50% chance a log will be created every 500 ms
        if(randomIntFromInterval(1,2) === 1){
            //TODO: Create an id in the object of logs for the specific log being generated.
            var idBeingGenerated=true, newLogId="";
            while(idBeingGenerated){ //generates a new id
              newLogId = randomIntFromInterval(1,200);
              if(!logOfObstacles.hasOwnProperty(newLogId)){
                logOfObstacles[newLogId] = {};
                idBeingGenerated=false;
              }
            }
            //Creates and adds a log to the stage
            //Log texture gotten from https://commons.wikimedia.org/wiki/File:K%C5%82oda.png
            logOfObstacles[newLogId] = PIXI.Sprite.fromImage("resources/images/logs/log.png");
            //logTexture = new PIXI.extras.TilingSprite(logTexture, 689, 1871);
            logOfObstacles[newLogId].x = window.innerWidth + 200;
            logOfObstacles[newLogId].y = randomIntFromInterval(450,750);
            logOfObstacles[newLogId].height = 300;
            logOfObstacles[newLogId].width = 134;
            logOfObstacles[newLogId].hitArea = new PIXI.Rectangle(0, 0, 72, 300);
            logOfObstacles[newLogId].interactive = true;
            addObjectToBackground(logOfObstacles[newLogId], newLogId);
        }
    },500);
}


//This function adds an object to the game, sets it at the speed the map
//floor is progressing. 
function addObjectToBackground(object, objectID){
  if(object) {
    stage.addChild(object);
    mario.parent.addChild(mario);
    arrayOfObstacles.push(object);
    objectIdArray.push(objectID);
  }
  arrayOfObstacles.forEach(function(item, index){
    item.position.x -= mapSpeed;
    if(hitTestRectangle(mario, item, "mario", "log")){
      if(!isJumping){
        richText.text = "Game Over!";
        if(!gameHalted) endGame();
      }
    }
    else if(item.position.x < 100){
      stage.removeChild(item);
      delete logOfObstacles[objectIdArray[index]];
      console.log("Log are ",logOfObstacles);
      arrayOfObstacles.splice(item,1);
      objectIdArray.splice(index,1);
      console.log("log removed!");
    }
  });
  renderer.render(stage);
}

function removeAllGameObstacles(){
  arrayOfObstacles.forEach(function(item, index){
    console.log("item is ",item);
    console.log("index is ", index);
      stage.removeChild(item);
      delete logOfObstacles[objectIdArray[index]];
      console.log("Log are ",logOfObstacles);
      console.log("log removed!");
  });
  console.log("logOfObstacles",logOfObstacles);
  console.log("arrayOfObstacles",arrayOfObstacles);
  console.log("objectIdArray",objectIdArray);
  logOfObstacles = {};
  arrayOfObstacles=[];
  objectIdArray=[];
}

// Generate a random number between 1 and given number parameter
function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

//Basic hit test (collision detector) for two rectangular objects
function hitTestRectangle(r1, r2, object1, object2) {

  var r1AddedYPadding=0,r1AddedXPadding=0,r2AddedYPadding=0,r2AddedXPadding=0;
  switch(object1){
    case "mario":
      r1AddedYPadding=129;
      break;
    default:
      break;
  }
  switch(object2){
    case "log":
      r2AddedXPadding=24;
      break;
    default:
      break;
  }

  //Define the variables we'll need to calculate
  var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  //hit will determine whether there's a collision
  hit = false;

  // console.log("R1: ",r1);
  // console.log("R2: ",r2);
  if(r1.hitArea !== null && r2.hitArea !== null){
    //Find the center points of each sprite's hit area
    r1.hitArea.centerX = (r1.x + r1AddedXPadding) + r1.hitArea.width / 2;
    r1.hitArea.centerY = (r1.y + r1AddedYPadding) + r1.hitArea.height / 2;
    r2.hitArea.centerX = (r2.x + r2AddedXPadding) + r2.hitArea.width / 2;
    r2.hitArea.centerY = (r2.y + r2AddedYPadding) + r2.hitArea.height / 2;

    //Find the half-widths and half-heights of each sprite's hit area
    r1.hitArea.halfWidth = r1.hitArea.width / 2;
    r1.hitArea.halfHeight = r1.hitArea.height / 2;
    r2.hitArea.halfWidth = r2.hitArea.width / 2;
    r2.hitArea.halfHeight = r2.hitArea.height / 2;

    //Calculate the distance vector between the sprites
    vx = r1.hitArea.centerX - r2.hitArea.centerX;
    vy = r1.hitArea.centerY - r2.hitArea.centerY;
    //console.log("r1.hitArea: ",r1.hitArea);
    //console.log("r2.hitArea: ",r2.hitArea);
    // console.log("R1: ",r1);
    // console.log("R2: ",r2);
    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.hitArea.halfWidth + r2.hitArea.halfWidth;
    combinedHalfHeights = r1.hitArea.halfHeight + r2.hitArea.halfHeight;
  }else{
    //Find the half-widths and half-heights of each sprite
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;

    //Find the center points of each sprite
    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;

    //Calculate the distance vector between the sprites
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;

    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;
  }

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {
    //console.log("Math.abs(vx) and combinedHalfWidths: ",Math.abs(vx),combinedHalfWidths);
    //A collision might be occuring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {
      //console.log("Math.abs(vy) and combinedHalfHeights: ",Math.abs(vy),combinedHalfHeights);
      //There's definitely a collision happening
      hit = true;
    } else {

      //There's no collision on the y axis
      hit = false;
    }
  } else {
    //console.log("Math.abs(vx) and combinedHalfWidths: ",Math.abs(vx),combinedHalfWidths);
    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either `true` or `false`
  return hit;
}

//Initializes the main menu listeners
function initMenuListeners(){
  document.getElementById("start-game-button").removeEventListener("click",startGame);
  document.getElementById("start-game-button").addEventListener("click",startGame);
}
function startGame(){
  gameStopped=false;
  document.getElementById("game-start-menu").style.display="none";
  document.getElementById("game-over-scene").style.display="none";
  mapSpeed=defaultMapSpeed;
  generateLogs();
}
function restartGame(){
  document.getElementById("game-start-menu").style.display="none";
  document.getElementById("game-over-scene").style.display="none";
  mario.x = 1000; //sets mario's x-axis
  mario.y = 750; //sets mario's y-axis
  writeUserScore("Devin", gameScore);
  gameScore=0;
  richTextScore.text = `Score: ${gameScore}`;
  gameStopped=false;
  gameHalted=false;
  mapSpeed=defaultMapSpeed;
  removeAllGameObstacles();
  generateLogs();
}
function updateScore(){
  gameScore++;
  richTextScore.text = `Score: ${gameScore}`;
}
function writeUserScore(userId, score){
  firebase.database().ref('users/' + userId + "/score/").push({
    score: score
  });
}
}); //End of docReady function

