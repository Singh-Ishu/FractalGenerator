const canvas = document.getElementById("drawing-board");
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;

const maxIteration = 3000;

function mandelbrotGenerator(xc = 0, yc = 0, rmul = 1, gmul = 1, bmul = 1) {
  let points = [];

  for (let px = 0; px < width; px++) {
    for (let py = 0; py < height; py++) {
      // Scale pixel coordinate to Mandelbrot scale
      let x0 = (px / width) * (0.47 + 2.0) - 2.0;
      let y0 = (py / height) * (1.12 + 1.12) - 1.12;

      let x = xc;
      let y = yc;
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
          : `${(iteration * rmul) % 256}, 
          ${(iteration * gmul) % 256}, 
          ${(iteration * bmul) % 256}`;

      points.push({ x: px, y: py, color: `(${colorValue})` });
    }
  }

  return points;
}

function burningShipGenerator(xc = 0, yc = 0, rmul = 1, gmul = 1, bmul = 1) {
  let points = [];

  for (let px = 0; px < width; px++) {
    for (let py = 0; py < height; py++) {
      // Scale pixel coordinate to Burning Ship scale
      let x0 = (px / width) * (2.5 + 2.0) - 2.0;
      let y0 = (py / height) * (2.0 + 1.5) - 1.5;

      let x = xc;
      let y = yc;
      let iteration = 0;

      while (x * x + y * y <= 4 && iteration < maxIteration) {
        let xtemp = x * x - y * y + x0;
        y = Math.abs(2 * x * y) + y0; // Burning Ship uses absolute value
        x = Math.abs(xtemp); // Absolute value applied to x
        iteration++;
      }

      // Convert iteration count to a color
      let colorValue =
        iteration === maxIteration
          ? "0,0,0"
          : `${(iteration * rmul) % 256}, 
          ${(iteration * gmul) % 256}, 
          ${(iteration * bmul) % 256}`;

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

let points;
if (document.title === "Fractalite-Mandelbrot") {
  points = mandelbrotGenerator();
} else if (document.title === "Fractalite-BurningShip") {
  points = burningShipGenerator();
}

plotPoints(points);

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".sidebar button").forEach((button) => {
    button.addEventListener("click", () => {
      // Get input values and convert them to numbers
      const rmul = parseFloat(document.getElementById("r").value) || 1;
      const gmul = parseFloat(document.getElementById("g").value) || 1;
      const bmul = parseFloat(document.getElementById("b").value) || 10;

      const xc = parseFloat(document.getElementById("x").value) || 0;
      const yc = parseFloat(document.getElementById("y").value) || 0;

      ctx.clearRect(0, 0, width, height);

      // Generate and plot the new fractal

      if (document.title === "Fractalite-Mandelbrot") {
        points = mandelbrotGenerator(xc, yc, rmul, gmul, bmul);
      } else if (document.title === "Fractalite-BurningShip") {
        points = burningShipGenerator(xc, yc, rmul, gmul, bmul);
      }

      plotPoints(points);
    });
  });
});
