let wheels = [];
let baseRadius = 65; // 更小的圆，便于稀疏分布也能碰撞

function setup() {
  createCanvas(800, 800);
  ellipseMode(CENTER);

  // 保留手动指定的 positions
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

  // 1) 更新所有轮子的旋转、hover 状态 & 平滑插值
  for (let w of wheels) {
    w.update();
  }

  // 2) 以最外圈碰撞判定，推动邻居
  resolveCollisions();

  // 3) 绘制
  for (let w of wheels) {
    w.display();
  }
}

// 只有被 hover 的 wheel 会以它的“最外圈”来推开周围的 wheels
function resolveCollisions() {
  const dotRings    = 6;   // 与 wheel.js 中 display() 一致
  const ringSpacing = 13;
  const extraOffset = 10;  // 最外圈多出的 10px

  for (let i = 0; i < wheels.length; i++) {
    let a = wheels[i];
    if (!a.isHovered) continue;

    // —— 计算 A 的最外圈半径 —— 
    const pinkA  = a.radius * 0.45;
    const initA  = pinkA + 18;
    const outerA = initA + (dotRings - 1) * ringSpacing + extraOffset;

    for (let j = 0; j < wheels.length; j++) {
      if (i === j) continue;
      let b = wheels[j];

      // —— 计算 B 的最外圈半径 —— 
      const pinkB  = b.radius * 0.45;
      const initB  = pinkB + 18;
      const outerB = initB + (dotRings - 1) * ringSpacing + extraOffset;

      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = sqrt(dx * dx + dy * dy);
      const minDist = outerA + outerB;

      if (dist < minDist && dist > 0) {
        const overlap = minDist - dist;
        const moveX = (dx / dist) * overlap * 1.1;
        const moveY = (dy / dist) * overlap * 1.1;
        b.targetX += moveX;
        b.targetY += moveY;
      }
    }
  }
}

// 随机颜色生成函数，和原来完全一致
function randomColor() {
  return color(random(255), random(255), random(255));
}
