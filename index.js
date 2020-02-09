const ws281x = require('rpi-ws281x-v2');
ws281x.configure({leds:150, gpio:12, strip:"grb", brightness:255});


const Color = require('color');
const express = require('express');
const app = express();
app.listen(4000, () => console.log("Listening at 4000"));
app.use(express.json());

let strip = {
  power: 0,
  color: Color("#000000"),
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
    strip.cycle = 0;
    strip.breathing = 0;
    strip.rainbow = 0;
  }
	run();
  response.status(200).send(strip.power.toString());
});

app.get('/brightness/:bri', (request, response) => {
  if(!isEmptyObject(request.params.bri)){

    if(isNaN(request.params.bri) || request.params.bri>100 || request.params.bri<0){
      response.status(400).send();
    } else{
      strip.color = Color.hsv(strip.color.hsv().array()[0],strip.color.hsv().array()[1],parseInt(request.params.bri));
      run();
      response.status(200).send(strip.color.hsv().array()[2].toString());
    }
  } else{
    response.status(200).send(strip.color.hsv().array()[2].toString());
  }
});
app.get('/brightness', (request, response) => {
  response.status(200).send(strip.color.hsv().array()[2].toString());
});

app.get('/set/:col', (request, response) => {
  if(!isEmptyObject(request.params.col)){
    if(isNaN('0x' + request.params.col) || parseInt(request.params.col, 16)>parseInt('0xFFFFFF', 16)){
      response.status(400).send();
    } else{
      strip.color = Color.hsv(Color('#' + request.params.col).hsv().array()[0],Color('#' + request.params.col).hsv().array()[1],strip.color.hsv().array()[2]);
      //strip.color = Color('#' + request.params.col);
      //strip.brightness = Color('#' + request.params.col).hsv().array()[2];
      run();
      response.status(200).send(strip.color.hex().replace('#',''));
    }
  } else{
    response.status(200).send(strip.color.hex().replace('#',''));
  }
});
app.get('/set', (request, response) => {
  response.status(200).send(strip.color.hex().replace('#', ''));
});


app.get('/cycle/:val', (request, response) => {
  if(request.params.val == "on" && strip.power==1){
    strip.cycle = 1;
    strip.breathing = 0;
    strip.rainbow = 0;
  } else if(request.params.val == "off"){
    strip.cycle = 0;
  }
  run();
  response.status(200).send(strip.cycle.toString());
});

app.get('/breathing/:val', (request, response) => {
  if(request.params.val == "on" && strip.power==1){
    strip.cycle = 0;
    strip.breathing = 1;
    strip.rainbow = 0;
  } else if(request.params.val == "off"){
    strip.breathing = 0;
  }
  run();
  response.status(200).send(strip.breathing.toString());
});

app.get('/rainbow/:val', (request, response) => {
  if(request.params.val == "on" && strip.power==1){
    strip.cycle = 0;
    strip.breathing = 0;
    strip.rainbow = 1;
  } else if(request.params.val == "off"){
    strip.rainbow = 0;
  }
  run();
  response.status(200).send(strip.rainbow.toString());
});

let cycleRep, breathingRep, rainbowRep;
function run(){
  if(!strip.cycle && !strip.breathing && !strip.rainbow){
    clearInterval(breathingRep);
    clearInterval(cycleRep);
    clearInterval(rainbowRep);
    cycleRep=null;
    breathingRep=null;
    rainbowRep=null;


    let pixels = new Uint32Array(ws281x.leds);

    for (let i = 0; i < ws281x.leds; i++){
      if(strip.power==1){
        pixels[i] = strip.color.hex().replace('#','0x');
      } else {
        pixels[i] = "0x000000";
      }
    }
    // Render to strip
    ws281x.render(pixels);
  }else if(strip.cycle){
    clearInterval(breathingRep);
    clearInterval(rainbowRep);
    breathingRep=null;
    rainbowRep=null;
    if(!cycleRep){
      cycleRep = setInterval(cycleLoop, 20);
    }
  }else if(strip.breathing){
    clearInterval(cycleRep);
    clearInterval(rainbowRep);
    cycleRep=null;
    rainbowRep=null;
    if(!breathingRep){
      breathingRep = setInterval(breathingLoop, 20);
    }
  }else if(strip.rainbow){
    clearInterval(breathingRep);
    clearInterval(cycleRep);
    cycleRep=null;
    breathingRep=null;
    if(!rainbowRep){
      rainbowRep = setInterval(rainbowLoop, 5);
    }
  }
}

let ledIndex = 0;
let fade = {
  v: 0,
  dv: 0.01
};

function cycleLoop(){
  let pixels = new Uint32Array(ws281x.leds);
  let i;
  for (i = 0; i < ws281x.leds; i++){
    pixels[i] = strip.color.hex().replace('#','0x');
  }
  for(i=0; i<=15; i++){
    pixels[(ledIndex+i)%ws281x.leds] = strip.color.darken(i/15).hex().replace('#','0x');
  }
  i++
  for (; i>=0; i--){
      pixels[(ledIndex+31-i)%ws281x.leds] = strip.color.darken(i/15).hex().replace('#','0x')
  }
  // Render to strip
  ws281x.render(pixels);
  ledIndex=(ledIndex+1)%ws281x.leds;
}

function breathingLoop(){
  let pixels = new Uint32Array(ws281x.leds);

  for (let i = 0; i < ws281x.leds; i++){
    pixels[i] = strip.color.darken(fade.v).hex().replace('#','0x');
  }
  // Render to strip
  ws281x.render(pixels);

  if(fade.v>0.65 || fade.v<0){
    fade.dv*=-1;
  }
  fade.v+=fade.dv;
}
function rainbowLoop(){
  let pixels = new Uint32Array(ws281x.leds);

  for (let i = 0; i < ws281x.leds; i++){
    pixels[i] = Color("#FF0000").rotate((i+ledIndex)*360/ws281x.leds).hex().replace('#','0x');
  }
  // Render to strip
  ws281x.render(pixels);
  ledIndex=(ledIndex+1)%ws281x.leds;
}

run();
