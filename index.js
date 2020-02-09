const express = require('express');
const app = express();
app.listen(8000, () => console.log("Listening at 8000"));
app.use(express.json());
console.log("qwrg");

let strip = {
  power: 0,
  brightness: 0,
  color: "000000",
  cycle: false,
  breathing: false,
  rainbow: false
}

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

console.log(strip.power);

app.post('/on', (request, response) => {
  strip.power = 1;
  response.status(200).send(strip.power.toString());
});

app.post('/off', (request, response) => {
  strip.power = 0;
  response.status(200).send(strip.power.toString());
});

app.post('/status', (request, response) => {
  response.status(200).send(strip.power.toString());
});

app.post('/brightness', (request, response) => {
  if(!isEmptyObject(request.query)){
    if(isNaN(request.query.brightness) || request.query.brightness>100 || request.query.brightness<0){
      response.status(400).send();
    } else{
      strip.brightness = parseInt(request.query.brightness);
      response.status(200).send(strip.brightness.toString());
    }
  } else{
    response.status(200).send(strip.brightness.toString());
  }
});

app.post('/set', (request, response) => {

  if(!isEmptyObject(request.query)){
    if(isNaN('0x' + request.query.color) || parseInt(request.query.color, 16)>parseInt('0xFFFFFF', 16)){
      response.status(400).send();
    } else{
      strip.color = request.query.color;
      response.status(200).send(strip.color);
    }
  } else{
    response.status(200).send(strip.color);
  }
});

/*
"accessories": [
    {
        "accessory": "HTTP-RGB",
        "name": "RGB Led Strip",
        "service": "Light",

        "switch": {
            "status": "http://localhost/api/v1/status",
            "powerOn": "http://localhost/api/v1/on",
            "powerOff": "http://localhost/api/v1/off"
        },

        "brightness": {
            "status": "http://localhost/api/v1/brightness",
            "url": "http://localhost/api/v1/brightness/%s"
        },

        "color": {
            "status": "http://localhost/api/v1/set",
            "url": "http://localhost/api/v1/set/%s",
            "brightness": true
        }
    }
]
*/
