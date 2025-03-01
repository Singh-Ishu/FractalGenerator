import "./Sidebar.css";
import { updateFractalParams } from "../utils/Mandelbrot";

export default function Sidebar({ onGenerate }) {
  return (
    <div className="sidebar">
      <div id="Fractal-Calculation">
        <table>
          <tbody>
            <tr>
              <td>
                <label htmlFor="zr">Z(r)</label>
              </td>
              <td>
                <input type="number" id="zr" name="zr" placeholder="0" />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="zi">Z(i)</label>
              </td>
              <td>
                <input type="number" id="zi" name="zi" placeholder="0" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div id="Fractal-Appearance">
        <table>
          <tbody>
            <tr>
              <td>
                <label htmlFor="r">Red Multiplier:</label>
              </td>
              <td>
                <input type="number" id="r" name="r" defaultValue="1" />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="g">Green Multiplier:</label>
              </td>
              <td>
                <input type="number" id="g" name="g" defaultValue="1" />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="b">Blue Multiplier:</label>
              </td>
              <td>
                <input type="number" id="b" name="b" defaultValue="1" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div id="specials">
        <table>
          <tbody>
            <tr>
              <td>
                <label>Inside B/W:</label>
              </td>
              <td>
                <label class="switch">
                  <input type="checkbox" />
                  <span class="slider round"></span>
                </label>
              </td>
            </tr>
            <tr>
              <td>
                <label>Dynamic Colouring:</label>
              </td>
              <td>
                <label class="switch">
                  <input type="checkbox" />
                  <span class="slider round"></span>
                </label>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <button onClick={updateFractalParams}>Generate</button>
    </div>
  );
}
