var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score,sun,sunAnimation;

var jumpSound , checkPointSound, dieSound


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  sunAnimation = loadImage("sun.png");
   
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkpointSound = loadSound("checkpoint.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  sun = createSprite(width-50,100,10,10);
  sun.addAnimation("sun",sunAnimation);
  sun.scale = 0.1

  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(width/2,height-90,width,125);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
   
  

  
  invisibleGround = createSprite(width/2,height,width-30,200);
  invisibleGround.visible = false;
  
  //crear grupos de obstáculos y nubes
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  trex.setCollider("circle",0,0,40);
  
  
  score = 0;
  
}

function draw() {
  
  background(180);
  //mostrar puntuación
  text("Puntuación: "+ score, width-150,50);
  
  
  if(gameState === PLAY){
    

    
    
    //mover el suelo
    ground.velocityX = -(4+3*score/200);
    //puntuación
    score = score + Math.round(getFrameRate()/60);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    if(touches.lenght > 0 || keyDown("space")&& trex.y >= height-150) {
        trex.velocityY = -12;
      jumpSound.play()
      touches = []
    }

    trex.velocityY = trex.velocityY + 0.8
  
    //aparecer las nubes
    spawnClouds();
  
    //aparecer obstáculos en el suelo
    spawnObstacles();
    
    if(score%500===0){
      checkpointSound.play();
    }
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }


    if(score>5000){
      ground.velocityX = -6

    }
  }
   else if (gameState === END) {
     var gameOverImg,restartImg
     restartImg = loadImage("restart.png")
     gameOverImg = loadImage("gameOver.png")
    
     gameOver = createSprite(width/2,height-330);
     gameOver.addImage(gameOverImg);
   
     restart = createSprite(width/2,height-300);
     restart.addImage(restartImg);
     console.log("jaja noob")
     gameOver.scale = 0.5;
     restart.scale = 0.5;

      if (mousePressedOver(restart)){
        reset()
      }
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      trex.velocityY = 0
     
      trex.changeAnimation("collided", trex_collided);
     
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);



   }
  
 
  //evitar que el trex caiga
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function spawnClouds() {
  //escribir aquí el código para aparecer las nubes
  if (frameCount % 60 === 0) {
     cloud = createSprite(width,height-3*(height/4),40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //asignar lifetime a la variable
    cloud.lifetime = 234;
    
    //ajustar la profundidad
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //agregar cada nube al grupo
   cloudsGroup.add(cloud);
    }
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,height-100,10,40);
   obstacle.velocityX = -(6+3*score/600);
   
    //generar obstáculos al azar
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //asignar escala y lifetime al obstáculo           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //agregar cada obstáculo al grupo
    obstaclesGroup.add(obstacle);
 }
}

function reset() {
gameState = PLAY
score = 0 
trex.changeAnimation("running", trex_running);
obstaclesGroup.destroyEach()
cloudsGroup.destroyEach()
gameOver.visible=false
restart.visible=false
}