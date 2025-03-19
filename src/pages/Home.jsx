export default function Home() {
  return (
    <>
      <div>
        <h1> Welcome to the world of Fractals</h1>
        <p>
          Fractals are infinitely complex patterns that repeat at different
          scales, often found in nature, mathematics, and computer graphics.
          They emerge from simple mathematical formulas, yet produce stunningly
          intricate designs. This website allows you to explore and visualize
          some of the most famous fractals, such as the Mandelbrot Set, Julia
          Set, Burning Ship, and Mandelbulb, all rendered in real time using
          WebGL.
          <br />
          Unlike traditional pixel-based rendering, this site leverages GPU
          acceleration to generate fractals dynamically, ensuring smooth{" "}
          <i>(atleast ideally)</i> navigation and deep zooming without
          performance drops. Whether you're here to admire the beauty of
          fractals or analyze their mathematical properties, this interactive
          experience brings them to life with high precision and speed. Dive in,
          experiment with parameters, and uncover the mesmerizing world of
          infinite complexity!
        </p>
      </div>
    </>
  );
}
