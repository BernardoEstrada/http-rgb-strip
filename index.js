//const ws281x = require('rpi-ws281x-v2');
const Color = require('color');
const express = require('express');
const app = express();
app.listen(8000, () => console.log("Listening at 8000"));
app.use(express.json());

let strip = {
  power: 0,
  brightness: 0,
  color: "000000",
  cycle: 0,
  breathing: 0,
  rainbow: 0
};

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
};

app.get('/q/:val', (request, response) => {
  if(request.params.val == "on"){
    strip.power = 1;
  } else if(request.params.val == "off"){
    strip.power = 0;
  }
  response.status(200).send(strip.power.toString());
});

app.get('/brightness/:bri', (request, response) => {
  if(!isEmptyObject(request.params.bri)){

    if(isNaN(request.params.bri) || request.params.bri>100 || request.params.bri<0){
      response.status(400).send();
    } else{
      strip.brightness = parseInt(request.params.bri);
      response.status(200).send(strip.brightness.toString());
    }
  } else{
    response.status(200).send(strip.brightness.toString());
  }
});
app.get('/brightness', (request, response) => {
  response.status(200).send(strip.brightness.toString());
});

app.get('/set/:col', (request, response) => {
  if(!isEmptyObject(request.params.col)){
    if(isNaN('0x' + request.params.col) || parseInt(request.params.col, 16)>parseInt('0xFFFFFF', 16)){
      response.status(400).send();
    } else{
      strip.color = request.params.col;
      strip.brightness = Color('#' + request.params.col).hsv().array()[2];
      response.status(200).send(strip.color);
    }
  } else{
    response.status(200).send(strip.color);
  }
});
app.get('/set', (request, response) => {
  response.status(200).send(strip.color);
});


app.get('/cycle/:val', (request, response) => {
  if(request.params.val == "on"){
    strip.cycle = 1;
    strip.breathing = 0;
    strip.rainbow = 0;
  } else if(request.params.val == "off"){
    strip.cycle = 0;
  }
  response.status(200).send(strip.cycle.toString());
});

app.get('/breathing/:val', (request, response) => {
  if(request.params.val == "on"){
    strip.cycle = 0;
    strip.breathing = 1;
    strip.rainbow = 0;
  } else if(request.params.val == "off"){
    strip.breathing = 0;
  }
  response.status(200).send(strip.breathing.toString());
});

app.get('/rainbow/:val', (request, response) => {
  if(request.params.val == "on"){
    strip.cycle = 0;
    strip.breathing = 0;
    strip.rainbow = 1;
  } else if(request.params.val == "off"){
    strip.rainbow = 0;
  }
  response.status(200).send(strip.rainbow.toString());
});

function loop(){
  console.log(strip);
};

function run(){
  // Loop every 100 ms
  setInterval(function(){loop()}, 100);
};

run();
