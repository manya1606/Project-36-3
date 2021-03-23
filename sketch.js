var dog, happyDog, database, foodS, foodStock
var feedDog
var addFood
var fedTime, lastFed
var foodObj
var changeState, readState
var bedroom, garden, washroom

function preload()
{
  dog=loadImage( "images/dogImg1.png")
  happyDog=loadImage ( "images/dogImg.png")
  bedroom=loadImage("virtual-pet-images/Bed Room.png")
  garden=loadImage("virtual-pet-images/Garden.png")
  washroom=loadImage("virtual-pet-images/Wash Room.png")
  sadDog=loadImage("virtual-pet-images/Lazy.png")
}

function setup() {
  database=firebase.database()
  createCanvas(500,500);
  pet=createSprite(250,300,150,150)
  pet.addImage (dog)
  
  pet.scale=0.15

  foodStock=database.ref('Food');
    foodStock.on("value", readStock)

    foodObj = new Food()

    feed=createButton("Feed The Dog");
    feed.position(630,65);
    feed.mousePressed(feedDog);

    addFood=createButton("Add Food");
    addFood.position(730,65);
    addFood.mousePressed(addFood);

    readState=database.ref('gameState');
    readState.on("value", function(data){
      gameState=data.val()
    });

    fedTime=database.ref('feedTime');
    fedTime.on("value", function(data){
      lastFed=data.val()
    });

    
  
}


function draw() {  
  background(46,139,87)

  if (keyDown("UP_ARROW")){
    writeStock(foodS);
    pet.addImage(happyDog)
  }

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
  
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Fed : "+ lastFed%12 + "PM", 70,30);
  } else if (lastFed==0){
    text("Last Fed : 12 AM",350,30);
  } else {
    text("Last Fed : "+ lastFed + "AM", 70,30);
  }

  currentTime=hour();
    if(currentTime==(lastFed+1)){
        update("Playing");
        foodObj.garden();
    }else if(currentTime==(lastFed+2)){
        update("Sleeping");
        foodObj.bedroom();
    }else if(currentTime> (lastFed+2) && currentTime <(lastFed+4)) {
        update("Bathing");
        foodObj.washroom();
    } else{
        update("Hungry")
        foodObj.display();
    }

    if(gameState!=="Hungry"){
      feed.hide()
      addFood.hide()
      dog.remove()
    } else{
      feed.show()
      addFood.show()
      dog.addImage(sadDog) 
    }
    
  
  //textSize(20)
  //fill("white")
  //text("Press UP Arrow Key To Feed The Dog",130,10,300,20)

  textSize(20)
  fill("white")
  text("Food Remaining:  20",160,120,400,200)

  foodObj.display();

  drawSprites()
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS)
}

function writeStock(x){

  if(x<=0){
    x=0;
  } else{
    x=x-1
  }

  database.ref('/').update({
    Food:x
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update
}


function feedDog(){
  dog.addImage(happyDog);
  
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    fedTime:hour()
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}
