class Wheel {
  constructor(x, y, baseRadius) {
    // x position and y position
    this.x = x;
    this.y = y;
    //Remember start x and y
    this.originalX = x;
    this.originalY = y;
    this.targetX = x;
    this.targetY = y;
    //Base radius and current radius
    this.baseRadius = baseRadius;
    this.radius = baseRadius;
    this.targetRadius = baseRadius;
    this.angle = random(360);
    this.rotationSpeed = random(0.2, 1);
    this.baseRotationSpeed = this.rotationSpeed;    //store original speed
    //Random colors for each part
    this.colors = Array.from({ length: 7 }, () => randomColor());
    //Components of wheels
    this.pinkRingColor = randomColor();
    this.yellowSpikesColor = randomColor();
    this.outerCircleColor = randomColor();
    this.dotColor = randomColor();
    this.dotBgColor = randomColor();
    this.finalCircleColor = randomColor();
    this.curvedLineColor = randomColor();
    //Hover state
    this.isHovered = false;
  }

  //Update angle, size and position smoothing
  update() {
    
    this.angle += this.rotationSpeed;//Rotate
    let d = dist(mouseX, mouseY, this.x, this.y);
    this.isHovered = d < this.radius;
    //Enlarge on hover
    if (this.isHovered) {
      this.targetRadius = this.baseRadius * 1.5;
    } else {
      this.targetRadius = this.baseRadius;//smooth scale
    }
  
    this.radius = lerp(this.radius, this.targetRadius, 0.3);
    this.x = lerp(this.x, this.targetX, 0.3);
    this.y = lerp(this.y, this.targetY, 0.3);
    this.targetX = lerp(this.targetX, this.originalX, 0.05);
    this.targetY = lerp(this.targetY, this.originalY, 0.05);
  }

  //Draw the wheel
  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    angleMode(DEGREES);

    // Draw concentric circles
    noStroke();
    let radii = [this.radius * 0.37, this.radius * 0.32, this.radius * 0.27, this.radius * 0.22, this.radius * 0.17, this.radius * 0.12, this.radius * 0.07];
    for (let i = 0; i < this.colors.length; i++) {
      fill(this.colors[i]);
      ellipse(0, 0, radii[i] * 2);
    }

    // Pink ring
    let pinkRadius = this.radius * 0.45;
    fill(this.pinkRingColor);
    ellipse(0, 0, pinkRadius * 2);

    // Draw spikes
    stroke(this.yellowSpikesColor);
    strokeWeight(2);
    let spikes = 50;
    for (let i = 0; i < spikes; i++) {
      let angle = (360 / spikes) * i;
      let x1 = cos(angle) * (pinkRadius - 6);
      let y1 = sin(angle) * (pinkRadius - 6);
      let x2 = cos(angle) * (pinkRadius + 6);
      let y2 = sin(angle) * (pinkRadius + 6);
      line(x1, y1, x2, y2);
    }

    // Outer circle
    noFill();
    stroke(this.outerCircleColor);
    strokeWeight(3);
    ellipse(0, 0, (pinkRadius + 8) * 2);

    // Dot rings
    let dotRings = 6;
    let initialRadius = pinkRadius + 18;
    let ringSpacing = 13;
    for (let ring = 0; ring < dotRings; ring++) {
      let currentRadius = initialRadius + ring * ringSpacing;
      let dotsNum = 80 - ring * 8;
      let dotSize = 7 - ring * 0.7;

      // Background ring
      strokeWeight(ringSpacing - 2);
      stroke(this.dotBgColor);
      noFill();
      ellipse(0, 0, currentRadius * 2);

      // Dots
      strokeWeight(0);
      fill(this.dotColor);
      for (let j = 0; j < dotsNum; j++) {
        let angle = (360 / dotsNum) * j;
        ellipse(
          cos(angle) * currentRadius,
          sin(angle) * currentRadius,
          dotSize
        );
      }
    }

    // Final outer ring
    noFill();
    stroke(this.finalCircleColor);
    strokeWeight(6);
    ellipse(0, 0, (initialRadius + (dotRings - 1) * ringSpacing + 10) * 2);

    // Center curve
    stroke(this.curvedLineColor);
    strokeWeight(5);
    noFill();
    beginShape();
    vertex(0, 0);
    bezierVertex(30, -20, 60, -30, 90, -60);
    endShape();

    pop();
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
    case 1: // Desert: red + orange +yellow + brown palette
      return color(
        random(80, 255), 
        random(20, 170), 
        random(0, 150)     
      );
    case 2: // Oasis: yellow-green+ pure green+ cyan + dark green + gray palette
      return color(
        random(0,  150),  
        random(80, 255),
        random(20, 170)   
      );
    default:
      return color(random(255), random(255), random(255));
  }
}

//Collision: push neighbors of hovered wheel
function resolveCollisions() {
  for (let i = 0; i < wheels.length; i++) {
    let a = wheels[i];
    if (!a.isHovered) continue;
    for (let j = 0; j < wheels.length; j++) {
      if (i === j) continue;
      let b = wheels[j];
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      let dist = sqrt(dx * dx + dy * dy);
      let minDist = max(a.radius, a.targetRadius) + b.radius;
      if (dist < minDist && dist > 0) {
        let overlap = minDist - dist;
        let moveX = dx / dist * overlap * 1.1;
        let moveY = dy / dist * overlap * 1.1;
        b.targetX += moveX;
        b.targetY += moveY;

        console.log('push', i, j, 'moveX:', moveX, 'moveY:', moveY);
      }
    }
  }
}

//Example setup: dense grid of wheels
function setup() {
  createCanvas(800, 800);
  ellipseMode(CENTER);

  // automatically generate a dense grid of wheels
  let positions = [];
  let baseRadius = 1
  let gap = 10; // gaps between wheels
  let cols = 4;
  let rows = 4;
  let startX = 200;
  let startY = 200;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = startX + i * (baseRadius * 2 + gap);
      let y = startY + j * (baseRadius * 2 + gap);
      positions.push({ x, y });
    }
  }

  for (let pos of positions) {
    wheels.push(new Wheel(pos.x, pos.y, baseRadius));
  }
}
