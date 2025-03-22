export default function Mandelbulb() {
  return (
    <>
      <div>
        <>
          <p>
            The <strong>Mandelbulb</strong> is an extension of the Mandelbrot
            Set into three dimensions, offering a breathtaking volumetric
            fractal visualization. Unlike the 2D fractals, the Mandelbulb is
            computed using spherical coordinates and higher-degree polynomial
            operations. A common formulation is:
          </p>
          <p>
            z<sub>n+1</sub> = z<sub>n</sub>
            <sup>d</sup> + c
          </p>
          <p>
            where <i>d</i> is typically set to <strong>8</strong> or other
            integer values to achieve a 3D fractal structure. The Mandelbulb
            reveals complex, bulbous formations with deep crevices, ridges, and
            self-repeating details, mimicking organic forms like coral or alien
            landscapes. Exploring the Mandelbulb in 3D provides a unique
            perspective on fractals beyond the traditional flat plane.
          </p>
        </>
      </div>
    </>
  );
}
