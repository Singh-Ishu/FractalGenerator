import "./Card.css";

export default function Card({ Name, Equation, Image_URL }) {
    return (
        <div className="card-container">
            <img src={Image_URL} alt={Name} height={300} />
            <div className="card-text">
                <h1>{Name}</h1>
                <h2>Equation: {Equation}</h2>
            </div>
        </div>
    );
}
