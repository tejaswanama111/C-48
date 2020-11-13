var ground;
var obstacle;
var player, playerImg, playerRunning, plyrRunLeft; 
var playerDead, playerJump;
var backgroundImg
var wall, wall1, wall2, wall3;
var PLAY=1;
var END =0;
var gameState = PLAY;
var score = 0;
var life = 5;
var monster, monster1;
var lifeLost, lifeGone;
var invisibleBlock, invisibleBlockGroup;
var bullet, bulletImg;

function preload(){
 backgroundImg = loadImage("image/bg.jpg");
 playerImg = loadImage("player/idle.png");
 playerRunning = loadAnimation("player/Run000.png", "player/Run001.png", "player/Run002.png", "player/Run003.png", "player/Run004.png", "player/Run005.png", "player/Run006.png", "player/Run007.png", "player/Run008.png", "player/Run009.png");
 plyrRunLeft = loadAnimation("playerr/Run000.png", "playerr/Run001.png", "playerr/Run002.png", "playerr/Run004.png", "playerr/Run005.png", "playerr/Run007.png", "playerr/Run008.png", "playerr/Run009.png");
 playerDead = loadAnimation("player/Dead000.png", "player/Dead001.png", "player/Dead002.png", "player/Dead003.png", "player/Dead004.png", "player/Dead005.png", "player/Dead006.png", "player/Dead007.png", "player/Dead008.png", "player/Dead009.png");
 playerJump = loadAnimation("player/Jump000.png", "player/Jump001.png", "player/Jump002.png", "player/Jump003.png", "player/Jump004.png", "player/Jump005.png", "player/Jump006.png", "player/Jump007.png", "player/Jump008.png", "player/Jump009.png");
 lifeLost = loadSound("lostLife.mp3");
 lifeGone = loadSound("lifeGone.wav");
 monster1 = loadAnimation("player/rock.png");
 bulletImg = loadImage("Bullet000.png");
}

function setup(){
  createCanvas(1365, 653);

  // background1 = createSprite(690, 325);
  // background1.addImage("background1", backgroundImg);
  // background1.scale = 2.8;

  wall = createSprite(1355,326, 20, 1365);
  wall.shapeColor="white";

  wall1 = createSprite(10, 326, 20, 1365);
  wall1.shapeColor="white";

  wall2 = createSprite(655,643, 1365, 20);
  wall2.shapeColor="white";

  wall3 = createSprite(665, 10, 1365, 20);
  wall3.shapeColor="white"; 

  player = createSprite(70, 574);
  player.addImage("player", playerImg);
  player.scale = 0.2;
  
  obstacleGroup = new Group();
  invisibleBlockGroup = new Group();
  enemyGroup = new Group();
  bulletGroup = new Group();
}

function draw(){
  background(backgroundImg);

  scoreCount();

  fill("red");
  textSize(35);
  text.depth = 10;
  text("Life : " + life, 60, 70);
  fill("green");
  text("Score : " + score, 250, 70);
 
   if(gameState === PLAY){
    if(keyDown("RIGHT_ARROW")) {
      player.addAnimation("player", playerRunning);
      player.x = player.x + 7;
  }
  
  if(keyDown("LEFT_ARROW")) {
    player.addAnimation("player", plyrRunLeft);
    player.x = player.x - 7;
  }
  
  if(keyDown("UP_ARROW")){
    player.addAnimation("player", playerJump);
    player.y = player.y - 6;
  }
  
  if(keyDown("DOWN_ARROW")){
    player.addAnimation("player", playerRunning);
    player.y = player.y + 6;
  }

  player.bounceOff(obstacleGroup);

  if(player.isTouching(wall) || player.isTouching(wall1) 
  || player.isTouching(wall2) || player.isTouching(wall3))
  {
    life = life-1;
    lifeGone.play();
    player.x = 70;
    player.y = 574;
  }

  if(invisibleBlockGroup.isTouching(player)){
    life = life-1;
    player.x = 70;
    player.y = 574;
    lifeGone.play();
  }

  if(life === 0){
    lifeLost.play();
    player.addAnimation("player", playerDead);
    gameState = END;
  }

  if(enemyGroup.isTouching(player)){
    life = life-1;
    lifeGone.play();
    enemyGroup.destroyEach();
  }

  if(bulletGroup.isTouching(enemyGroup)){
    life = life+1;
    enemyGroup.destroyEach();
    bulletGroup.destroyEach();
  }

  Enemy();
  createObstacle();
  drawSprites();
   }

  if(gameState === END){
      background("lightblue");
      noStroke();
      textSize(40);
      fill("Black");
      text("GAME OVER!!", 570, 327.5);
  }

}

function createObstacle(){
  if(frameCount%60===0){
    obstacle  = createSprite(300, -10, 500, 20);
    obstacle.velocityY = (3+(score/10));
    obstacle.shapeColor=color(244, 226, 101);
    obstacle.x = Math.round(random(100, 1200));
    obstacle.lifetime= 225;

    invisibleBlock = createSprite(300, 5);
    invisibleBlock.width = obstacle.width;
    invisibleBlock.height = 2;
    invisibleBlock.x = obstacle.x;
    invisibleBlock.velocityY = (3+(score/10));
    invisibleBlock.lifetime = 225;
    invisibleBlock.debug = false;
    invisibleBlockGroup.add(invisibleBlock);
    
    obstacleGroup.add(obstacle);
  }
}

function keyPressed(){
  if(keyCode === 32){
    createBullets();
  }
  }

function Enemy() {
  if(World.frameCount%200===0) {
    monster = createSprite(600,200,20,20);
    monster.addAnimation("moving", monster1);
    monster.y = Math.round(random(10,500));   
    
    position = Math.round(random(1,2));
    
    if(position==1)
    {
      monster.x=600;
      monster.velocityX = -(8+(score/10));
    }
    else
    {
      if(position==2) 
      {
        monster.x=0;
        monster.velocityX = (8+(score/10));
   
    monster.setLifetime = 300;
      }
    }
    enemyGroup.add(monster);
  }
}

function scoreCount(){
  if(frameCount%60===0){
    score = score+1;
  }
}

function createBullets(){
  bullet = createSprite(200, 200);
  bullet.x = player.x;
  bullet.y = player.y;
  bullet.velocityX = 5;
  bullet.addImage("bullet", bulletImg);
  bullet.scale = 0.1;
  bulletGroup.add(bullet);
  if(keyDown("RIGHT_ARROW")){
    bullet.velocityX = 5;
  }
  if(keyDown("LEFT_ARROW")){
    bullet.velocityX = -5;
  }
  
}