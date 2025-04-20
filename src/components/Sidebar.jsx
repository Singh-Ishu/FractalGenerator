import "./Sidebar.css";
import { useEffect } from "react";

export default function Sidebar({ onGenerate }) {
    function saveFractalParamsToLocalStorage() {
        const params = {
            zr: parseFloat(document.getElementById("zr").value) || 0,
            zi: parseFloat(document.getElementById("zi").value) || 0,
            cr: parseFloat(document.getElementById("cr").value) || -0.8,
            ci: parseFloat(document.getElementById("ci").value) || 0.156,
            r: parseFloat(document.getElementById("r").value) || 1,
            g: parseFloat(document.getElementById("g").value) || 1,
            b: parseFloat(document.getElementById("b").value) || 1,
            insideBW: document.getElementById("insideBW").checked,
        };

        localStorage.setItem("fractal2dparams", JSON.stringify(params));
        window.dispatchEvent(new Event("fractal2dparams-update"));

        // Optional: call a callback if needed (like re-rendering)
        if (onGenerate) {
            onGenerate(params);
        }
    }

    return (
        <div className="sidebar">
            <div id="Mandelbrot-Calculation">
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <label htmlFor="zr">Z(r)</label>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    id="zr"
                                    name="zr"
                                    placeholder="0"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="zi">Z(i)</label>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    id="zi"
                                    name="zi"
                                    placeholder="0"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div id="Julia-Calculation">
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <label htmlFor="cr">C(r)</label>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    id="cr"
                                    name="cr"
                                    placeholder="-0.8"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="ci">C(i)</label>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    id="ci"
                                    name="ci"
                                    placeholder="0.156"
                                />
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
                                <input
                                    type="number"
                                    id="r"
                                    name="r"
                                    defaultValue="1"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="g">Green Multiplier:</label>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    id="g"
                                    name="g"
                                    defaultValue="1"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor="b">Blue Multiplier:</label>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    id="b"
                                    name="b"
                                    defaultValue="1"
                                />
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
                                <label className="switch">
                                    <input type="checkbox" id="insideBW" />
                                    <span className="slider round"></span>
                                </label>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <button onClick={saveFractalParamsToLocalStorage}>Generate</button>
        </div>
    );
}
