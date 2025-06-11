let wheels = [];
//Making the radius slightly larger will make the effect of resolveCollisions more noticeable.
let baseRadius = 65; 

// Define the offset of an overall noise
let textNoiseOffset = 0;

//Add a noise effect to make the text look less monotonous.
function displayNoisyText(msg, x, y) {
  const xOff = (noise(textNoiseOffset) - 0.5) * 30;    // Horizontal jitter ±15px
  const yOff = (noise(textNoiseOffset + 100) - 0.5) * 15; // vertical jitter ±7.5px
  text(msg, x + xOff, y + yOff);
  textNoiseOffset += 0.02;
}

// There are three themes: ocean, desert, and oasis, and all three have different sounds to go with the theme.
let oceanSound, desertSound, oasisSound;
let song;
let themeNames = ['Ocean', 'Desert', 'Oasis'];

//‘lucky wheel' explanations (different for each theme, incorporating The Wheel of Fortune)
let explanations = [
  '"Tides rise and fall; fortunes flow like waves."',
  '"The desert’s expanse holds miracles in stillness."',
  '"An oasis heart; life blooms amid the sands."'
];

let themeIndex;
let state = 0; // state = 0 opening page1; state = 1 opening page2; state = 2 begining game
let luckyWheelIndex = -1; // Index of Lucky wheel
let maxSoundDist = 400; // Distance of maximum sound impact

function preload() {
  oceanSound = loadSound('assets/ocean.wav');
  desertSound = loadSound('assets/desert.wav');
  oasisSound = loadSound('assets/oasis.wav');
}

function setup() {
  createCanvas(800, 800);
  ellipseMode(CENTER);
   textFont('Georgia')

 // Randomly selected themes
  themeIndex = floor(random(themeNames.length));
  song = [oceanSound, desertSound, oasisSound][themeIndex];
  song.setVolume(0.5);
  song.pan(0);

  // Keep specified positions
  let positions = [
    { x:  90, y: 100 }, { x: 330, y:  30 }, { x: 570, y: -40 },
    { x:  50, y: 340 }, { x: 280, y: 270 }, { x: 510, y: 200 },
    { x: 740, y: 130 }, { x:  10, y: 580 }, { x: 240, y: 510 },
    { x: 470, y: 440 }, { x: 700, y: 360 }, { x: -20, y: 830 },
    { x: 210, y: 750 }, { x: 440, y: 680 }, { x: 670, y: 600 },
    { x: 620, y: 850 }, { x: 860, y: 770 }
  ];

  for (let pos of positions) {
    wheels.push(new Wheel(pos.x, pos.y, baseRadius));
  }
}

function draw() {
  background('#2E5F72');
  fill(255);
  textAlign(CENTER, CENTER);

  // state 0: show intro title, give a background about this game and themes
  if (state === 0) {
  textSize(22);
  displayNoisyText(
    'UNDER THE EVER-ROTATING WHEELS', 
    width/2, height/2 -22
    
  ); 

  textSize(22);
  displayNoisyText(
     'HOW DO CHOICES AND THE UNKNOWN INTERTWINE?',
    width/2, height/2 
    
  ); 

  // guidance to next step
   textSize(12);
   displayNoisyText(
    'Click anywhere to continue',
    width/2, height/2 + 330
  );
  return;
}

// state 1: show instructions, guide user how to play this game
if (state === 1) {
  textSize(22);
  displayNoisyText(
    'Follow the sound to find your own Lucky Wheel',
    width/2, height/2 - 20
  );

  textSize(16);
  displayNoisyText(
    'Move your mouse to locate the lively wheel',
    width/2, height/2 + 20
  );

  textSize(12);
  displayNoisyText(
    'Click anywhere to start',
    width/2, height/2 + 330
  );
  return;
}

// state 3: show result message, prompt to restart  
 if (state === 3) {
    textSize(24);
    displayNoisyText(
           `Congratulations! You found the ${themeNames[themeIndex]} Lucky Wheel!
           \n${explanations[themeIndex]}`,
      width / 2, height / 2

    );

    textSize(12);
     displayNoisyText(
    'Click anywhere to restart',
    width/2, height/2 + 330
  );
    return;}

  // state 2: game display
  for (let w of wheels) w.update();
  resolveCollisions();
  for (let w of wheels) w.display();

}

function mouseMoved() {
   if (state < 2) return;   // Only active during gameplay; ignore if state < 2

    // Calculate volume based on distance to the lucky wheel: closer = louder
  let vol = 0;
  if (luckyWheelIndex >= 0) {
    const lw = wheels[luckyWheelIndex];
    const d = dist(mouseX, mouseY, lw.x, lw.y);
    vol = map(maxSoundDist - d, 0, maxSoundDist, 0.5, 1, true);
  }

  song.setVolume(vol);

  // Pan sound left/right based on mouse X position
  let pan = map(mouseX, 0, width, -1, 1, true);
  song.pan(pan);
}


function mouseClicked() {

  if (state === 3) {
      // stop sound and reload
    if (song.isPlaying()) song.stop();
    window.location.reload();
    return;}

   // Connect to intro page
  if (state === 0) {
    state = 1;
    return;
  }

 //start game and pick lucky wheel
  if (state === 1) {
    togglePlay();
    luckyWheelIndex = floor(random(wheels.length));
    state = 2;
    return;
  }

  // state===2 only clicking the lucky wheel counts
  for (let i = 0; i < wheels.length; i++) {
    let w = wheels[i];
    if (dist(mouseX, mouseY, w.x, w.y) < w.radius) {
      if (i === luckyWheelIndex) {
        noLoop();
        song.stop();
        state = 3;
        
      }
      break;
    }
  }

  
}

function togglePlay() {
    // Toggle play/pause
  if (song.isPlaying()) song.stop();
  else song.loop();
}

function resolveCollisions() {
  const dotRings    = 6;   // Number of dot rings
  const ringSpacing = 13;  // Spacing between rings
  const extraOffset = 10;   // Extra offset for outer ring

  for (let i = 0; i < wheels.length; i++) {
    let a = wheels[i];
    if (!a.isHovered) continue;  // Only push neighbors when hovered

    // Calculate outer ring radius for A 
    const pinkA  = a.radius * 0.45;
    const initA  = pinkA + 18;
    const outerA = initA + (dotRings - 1) * ringSpacing + extraOffset;

    for (let j = 0; j < wheels.length; j++) {
      if (i === j) continue;
      let b = wheels[j];

      //  Calculate outer ring radius for B
      const pinkB  = b.radius * 0.45;
      const initB  = pinkB + 18;
      const outerB = initB + (dotRings - 1) * ringSpacing + extraOffset;

      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = sqrt(dx * dx + dy * dy);
      const minDist = outerA + outerB;

      if (dist < minDist && dist > 0) {
         // Push wheels apart on overlap
        const overlap = minDist - dist;
        const moveX = (dx / dist) * overlap * 1.1;
        const moveY = (dy / dist) * overlap * 1.1;
        b.targetX += moveX;
        b.targetY += moveY;
      }
    }
  }
}

// Generate a random colour based on the current theme.
// themeIndex variable: 0=Ocean, 1=Desert, 2=Oasis.
function randomColor() {
  switch (themeIndex) {
    case 0: // Ocean: blue-green+blue+violet
      return color(
        random(0, 150),   
        random(20, 170), 
        random(80, 255)  
      );
    case 1: // Desert: red + orange + yellow + brown palette
      return color(
        random(80, 255), 
        random(20, 170), 
        random(0, 150)     
      );
    case 2: // Oasis: yellow-green + pure green + cyan + dark green + gray palette
      return color(
        random(0,  150),  
        random(80, 255),
        random(20, 170)   
      );
    default:
      return color(random(255), random(255), random(255));
  }
}
