import "./Sidebar.css";

export default function Sidebar() {
  return (
    <div className="sidebar">
      {/* Fractal Calculation Section */}
      <div id="Fractal-Calculation">
        <table>
          <tbody>
            <tr>
              <td>
                <label htmlFor="zr">Z(r)</label>
              </td>
              <td>
                <input type="number" id="zr" name="zr" defaultValue="0" />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="zi">Z(i)</label>
              </td>
              <td>
                <input type="number" id="zi" name="zi" defaultValue="0" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Fractal Appearance Section */}
      <div id="Fractal-Appearance">
        <table>
          <tbody>
            <tr>
              <td>
                <label htmlFor="r">Red Multiplier</label>
              </td>
              <td>
                <input type="number" id="r" name="r" defaultValue="1" />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="g">Green Multiplier</label>
              </td>
              <td>
                <input type="number" id="g" name="g" defaultValue="1" />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="b">Blue Multiplier</label>
              </td>
              <td>
                <input type="number" id="b" name="b" defaultValue="1" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <button>Generate</button>
    </div>
  );
}
