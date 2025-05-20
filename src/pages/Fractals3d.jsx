import Card from "../components/Card";
import "./fractalinfo.css" 

export default function Fractals3d() {
    return (
        <div className="fractal-info-page-container">
            <div className="card-carousel">
                <Card
                    Name={"Mandelbulb"}
                    Image_URL={"src/assets/PlainMandelbulb.png"}
                />
            </div>
        </div>
    );
}
