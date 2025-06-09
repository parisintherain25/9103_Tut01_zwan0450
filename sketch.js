let wheels = [];
let baseRadius = 120; // 更小的圆，便于稀疏分布也能碰撞

function setup() {
  createCanvas(800, 800);
  ellipseMode(CENTER);

  // 保留手动指定的positions
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
  for (let w of wheels) {
    w.update();
  }
  resolveCollisions();
  for (let w of wheels) {
    w.display();
  }
}

// push neighbors away when a wheel is hovered
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
      // 让碰撞判定更灵敏，适当减小界定值
      let minDist = (a.radius + b.radius) * 0.85;
      if (dist < minDist && dist > 0) {
        let overlap = minDist - dist;
        let moveX = dx / dist * overlap * 1.1;
        let moveY = dy / dist * overlap * 1.1;
        b.targetX += moveX;
        b.targetY += moveY;
      }
    }
  }
}

function randomColor() {
  return color(random(255), random(255), random(255));
}
