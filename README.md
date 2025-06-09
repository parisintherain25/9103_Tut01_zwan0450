# Wheels of Fortune – p5.js Rendering

This is the A part of our group work: data generation and rendering structure for Pacita Abad's *Wheels of Fortune*.

## Files

- `index.html`: main HTML entry
- `sketch.js`: p5.js setup & draw loop
- `wheel.js`: Wheel class and pattern drawing
- `style.css`: basic styles

## My Contribution

I created the data and rendering system. Each Wheel has position, rotation, radius, color palette, and pattern style (`dots`, `concentric`, `lines`). This modular design allows easy extension for animation and interaction by other teammates.

## How to Run

1. Clone the repo
2. Open `index.html` in browser


# Rotation Animation – Added by Katherine

I implemented the rotation functionality (part B) for each wheel object. 

## My contribution:
- Adding `angle` and `rotationSpeed` to each `Wheel` instance in `wheel.js`
- Creating an `update()` method to increment the angle on each frame
- Modifying the `draw()` loop in `sketch.js` to call `update()` and enable continuous animation

## How to adjust the rotation speed of each wheel:
```js
// Fixed speed for all wheels (same rotation speed)
this.rotationSpeed = 0.5;

// Random speed for variation between wheels
this.rotationSpeed = random(0.2, 1);