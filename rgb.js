
const ws281x = require('rpi-ws281x-v2');


const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})


var red = 255, green = 255, blue = 255, dr=5, dg=5, db=5;
var color;

ws281x.configure({leds:150, gpio:12});
<<<<<<< HEAD

=======
   
>>>>>>> b08989ffb4c4d48e89d645a51ee15c70db8a7f19

function loop() {
	var pixels = new Uint32Array(ws281x.leds);
/*
    if(red>=255 || red<=0){
      dr*=-1;
    }
    red+=dr;

    if(green>=255 || green<=0){
      dg*=-1;
    }
    green+=dg;

    if(blue>=255 || blue<=0){
      db*=-1;
    }
    blue+=db;
    */
    var color = (red << 16) | (green << 8)| blue;
    console.log('0x'+color.toString(16));

    for (var i = 0; i < ws281x.leds; i++){
      pixels[i] = '0x'+color;
    }

    // Render to strip
    ws281x.render(pixels);
  }

function run()
{  // Loop every 100 ms
  //setInterval(function(){loop()}, 100);
	loop();
}

run();
