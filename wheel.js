class Wheel {
  constructor(x, y, baseRadius) {
    this.x = x;
    this.y = y;
    this.originalX = x;
    this.originalY = y;
    this.targetX = x;
    this.targetY = y;
    this.baseRadius = baseRadius;
    this.radius = baseRadius;
    this.targetRadius = baseRadius;
    this.angle = random(360);
    this.rotationSpeed = random(0.2, 1);
    this.colors = Array.from({ length: 7 }, () => randomColor());
    this.pinkRingColor = randomColor();
    this.yellowSpikesColor = randomColor();
    this.outerCircleColor = randomColor();
    this.dotColor = randomColor();
    this.dotBgColor = randomColor();
    this.finalCircleColor = randomColor();
    this.curvedLineColor = randomColor();
    this.isHovered = false;
  }

  update() {
    this.angle += this.rotationSpeed;
    let d = dist(mouseX, mouseY, this.x, this.y);
    this.isHovered = d < this.radius;
    if (this.isHovered) {
      this.targetRadius = this.baseRadius * 1.5;
    } else {
      this.targetRadius = this.baseRadius;
    }
    this.radius = lerp(this.radius, this.targetRadius, 0.3);
    this.x = lerp(this.x, this.targetX, 0.3);
    this.y = lerp(this.y, this.targetY, 0.3);
    this.targetX = lerp(this.targetX, this.originalX, 0.05);
    this.targetY = lerp(this.targetY, this.originalY, 0.05);
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    angleMode(DEGREES);

    // 中心同心圆
    noStroke();
    let radii = [this.radius * 0.37, this.radius * 0.32, this.radius * 0.27, this.radius * 0.22, this.radius * 0.17, this.radius * 0.12, this.radius * 0.07];
    for (let i = 0; i < this.colors.length; i++) {
      fill(this.colors[i]);
      ellipse(0, 0, radii[i] * 2);
    }

    // 粉色环
    let pinkRadius = this.radius * 0.45;
    fill(this.pinkRingColor);
    ellipse(0, 0, pinkRadius * 2);

    // 尖刺
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

    // 外圈
    noFill();
    stroke(this.outerCircleColor);
    strokeWeight(3);
    ellipse(0, 0, (pinkRadius + 8) * 2);

    // 外环点
    let dotRings = 6;
    let initialRadius = pinkRadius + 18;
    let ringSpacing = 13;
    for (let ring = 0; ring < dotRings; ring++) {
      let currentRadius = initialRadius + ring * ringSpacing;
      let dotsNum = 80 - ring * 8;
      let dotSize = 7 - ring * 0.7;

      // 白色背景环
      strokeWeight(ringSpacing - 2);
      stroke(this.dotBgColor);
      noFill();
      ellipse(0, 0, currentRadius * 2);

      // 红色点
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

    // 最外圈
    noFill();
    stroke(this.finalCircleColor);
    strokeWeight(6);
    ellipse(0, 0, (initialRadius + (dotRings - 1) * ringSpacing + 10) * 2);

    // 中心红色曲线
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

// 随机颜色生成
function randomColor() {
  return color(random(255), random(255), random(255));
}

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

        // 调试输出
        console.log('push', i, j, 'moveX:', moveX, 'moveY:', moveY);
      }
    }
  }
}

function setup() {
  createCanvas(800, 800);
  ellipseMode(CENTER);

  // 自动生成密集圆阵列
  let positions = [];
  let baseRadius = 1
  let gap = 10; // 圆之间的间隙
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