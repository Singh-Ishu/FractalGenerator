export default function BurningShip() {
  return (
    <>
      <div>
        <p>
          The <strong>Burning Ship fractal</strong> is a chaotic and mesmerizing
          fractal variation that follows a modification of the Mandelbrot
          equation. Instead of using the standard complex squaring operation, it
          applies absolute values to the real and imaginary components
          separately:
        </p>
        <p>
          z<sub>n+1</sub> = (|Re(z<sub>n</sub>)| + i |Im(z<sub>n</sub>)|)
          <sup>2</sup> + c
        </p>
        <p>
          This small tweak results in a fractal with a{" "}
          <strong>sharp, jagged, ship-like appearance</strong>, in contrast to
          the smooth curves of the Mandelbrot Set. The fractal often resembles a
          turbulent seascape, giving it the name "Burning Ship." By zooming into
          different regions, one can uncover a landscape of branching structures
          and intricate, chaotic formations.
        </p>
      </div>
    </>
  );
}
