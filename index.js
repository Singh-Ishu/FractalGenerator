const canvas = document.getElementById("drawing-board");
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;
const maxIteration = 1000;

// Generate Mandelbrot set points
function mandelbrotGenerator() {
  let points = [];

  for (let px = 0; px < width; px++) {
    for (let py = 0; py < height; py++) {
      // Scale pixel coordinate to Mandelbrot scale
      let x0 = (px / width) * (0.47 + 2.0) - 2.0;
      let y0 = (py / height) * (1.12 + 1.12) - 1.12;

      let x = 0;
      let y = 0;
      let iteration = 0;

      while (x * x + y * y <= 4 && iteration < maxIteration) {
        let xtemp = x * x - y * y + x0;
        y = 2 * x * y + y0;
        x = xtemp;
        iteration++;
      }

      // Convert iteration count to a color
      let colorValue =
        iteration === maxIteration
          ? "0,0,0"
          : `${(iteration * 3) % 256}, 
          ${(iteration * 2) % 256}, 
          ${(iteration * 10) % 256}`;

      points.push({ x: px, y: py, color: `(${colorValue})` });
    }
  }

  return points;
}

function plotPoints(points) {
  points.forEach(({ x, y, color }) => {
    ctx.fillStyle = `rgb${color}`;
    ctx.fillRect(x, y, 1, 1);
  });
}

const points = mandelbrotGenerator();
plotPoints(points);
