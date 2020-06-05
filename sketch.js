let intro = [1];
var swipeUrl = "https:" + "//p5js.org/";
// empty array of bubbles 
let bubbles = [];

//load fonts
let LHFConvectaBASE;
let ArialNarrow;
function preload() {
  LHFConvectaBASE = loadFont('LHFConvectaBASE.otf');
  ArialNarrow = loadFont('Arial Narrow.ttf');
}
//----start scene----
let timer = 10;
let startingCanvas;

//----PoseNet----
let video;
let poseNet;
leftWristX = 640;
leftWristY = 480;
rightWristX = 0;
rightWristY = 480;

w = 640;
h = 480;
let r = 10; //size of ellipse
let x = 320; //canvas width/2
let y = 240; //canvas height/2

function setup() {
  background("clear");
  video = createCapture(VIDEO);
  video.size(w, h);
  createCanvas(w, h);
  video.hide();
  poseNet = ml5.poseNet(video, modelReady);
  //turn this on after 10 seconds 
  poseNet.on('pose', gotPoses);
// startingCanvas = createGraphics(w,h);
  for (let i = 0; i < 1; i++) {
    let x = width / 2;
    let y = height / 2;
    let r = 50;
    let b = new swipeToStart(x, y, r,swipeUrl);
    intro.push(b);
  }
}

gotPoses = function(poses) {
  console.log(poses);
  if (poses.length > 0) {
    lX = poses[0].pose.keypoints[9].position.x;
    lY = poses[0].pose.keypoints[9].position.y;
    rX = poses[0].pose.keypoints[10].position.x;
    rY = poses[0].pose.keypoints[10].position.y;

    leftWristX = lerp(leftWristX, lX, 0.5);
    leftWristY = lerp(leftWristY, lY, 0.5);
    rightWristX = lerp(rightWristX, rX, 0.5);
    rightWristY = lerp(rightWristY, rY, 0.5);
  }
}

function modelReady() { //event callback tells me when its finished loading model
  console.log('model ready');
}


function draw() {
  // background(0);
  push();
  translate(w, 0);
  scale(-1, 1);
  image(video, 0, 0, w, h);
  pop();

  d = dist(leftWristX, leftWristY, rightWristX, rightWristY);
   translate(width, 0);
  scale(-1, 1);

 //draw wrist detection after 10 seconds
  if (frameCount % 60 == 0 && timer > 0) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
    timer--;
} if (timer == 0) {
   //flip posenet balls to track left and right as we see them
  fill(255);
  noStroke();
  ellipse(leftWristX, leftWristY, 5);
  fill(255);
  ellipse(rightWristX, rightWristY, 5);
    //swipe for intro to disappear 
  intro[1].Swipe(mouseX, mouseY);
}
  drawScene1();
  drawSwipeScene();
  
  if(this.alive==false){
    //load bubbles
    GameBegins();
  }

}
function drawScene1(){
  textSize(0);
  text(timer, width/2, height/2);
}
//-------DRAWS SPHERE + 
function drawSwipeScene(){
  intro[1].show();   
}

function GameBegins(){
   push();
  //draw all bubbles in array
  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].Show();
  }
  pop(); //keeps style of bubbles seperate 
}



// ----------------------------------------------------
//                SWIPE INTERACTION CLASS
// ----------------------------------------------------

class swipeToStart {
  constructor(x, y, r,url) {
    this.x = x;
    this.y = y;
    this.r = r
    this.url = url;
    this.alive = true

  }
  Swipe(rx, ry) {
    let alive = true;
    let d = dist(rx, ry, this.x, this.y);
    if (d < this.r) {
      alive = false;
      this.x = 100000;
      this.y = 100000;
//open link function is called
      openLink(this.url);
    }
  }
  show() {
    noStroke();
    fill(255, 255, 0);
    stroke(255);
    ellipse(this.x, this.y, this.r * 2);
    //flip text back to normal 
    translate(width, 0);
    scale(-1, 1);
    //swipe to start 
    textFont(LHFConvectaBASE);
    textSize(20);
    noStroke();
    fill(255);
    textAlign(CENTER);
    // scale(-1, 1);
    text('swipe to start', this.x, this.y);
     textFont(ArialNarrow);
    text('please stand 2m from your laptop', this.x, this.y-200);
  }
}

// adapted from: forum.processing.org/two/discussion/8809/link- function#Comment_33474
function openLink(url, winName, options) {
  if(url) {
    winName && open(url, winName, options) || (location = url);    
  }
  else {
    console.warn("no URL specified");
  }
}

