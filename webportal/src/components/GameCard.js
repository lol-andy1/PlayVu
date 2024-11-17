import { useNavigate } from "react-router-dom";

const GameCard = ({ id, name, price, duration, date }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/game/${id}`)}
      style={{
        backgroundColor: "#f3f3f3",
        margin: "16px",
        padding: "16px",
        borderRadius: "8px",
        width: "320px",
        border: "none",
        cursor: "pointer",
      }}
    >
      <div>
        <h3 style={{ fontSize: "18px", fontWeight: "bold", marginTop: "8px" }}>
          {name}
        </h3>
        <p style={{ fontSize: "16px", marginBottom: "4px" }}>{duration}</p>
        <p style={{ fontSize: "16px", marginBottom: "4px" }}>{date}</p>
        <p
          style={{
            fontSize: "16px",
            color: "#888",
            textAlign: "right",
            marginRight: "8px",
          }}
        >
          Price: {price ? `$${price}` : "Free"}
        </p>
      </div>
    </button>
  );
};

export default GameCard;