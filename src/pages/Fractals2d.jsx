import Card from "../components/Card";
import "./fractalinfo.css"

export default function Fractals2d() {
    return (
        <div className="fractal-info-page-container">
            <div className="card-carousel">
                <Card
                    Name="Mandelbrot"
                    Equation={1}
                    Image_URL={"src/assets/PlainMandelbrot.png"}
                />
                <Card
                    Name="Julia"
                    Equation={1}
                    Image_URL={"src/assets/PlainJulia.png"}
                />
                <Card
                    Name="Burning-Ship"
                    Equation={1}
                    Image_URL={"src/assets/PlainBurningShip.png"}
                />
            </div>
        </div>
    );
}
