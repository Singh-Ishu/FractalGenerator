import Card from "../components/Card";

export default function Fractals2d() {
    return (
        <>
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
        </>
    );
}
