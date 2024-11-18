import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GameCard = ({ id, name, price, duration, startDate, endDate }) => {
  const navigate = useNavigate();
  const [liveGame, setLiveGame] = useState(false)

  useEffect(() => {
    if (startDate && endDate) {
      const localDate = new Date();
      const offset = localDate.getTimezoneOffset();
      localDate.setMinutes(localDate.getMinutes() - offset)
  
      if (localDate >= startDate && localDate < endDate){
        setLiveGame(true)
      }
    }
  }, [startDate, endDate])

  return (
    <button
      onClick={() => navigate(`/game/${id}`)}
      className="border-t border-black w-full"
      style={{
        backgroundColor: "#f3f3f3",
        margin: "0px",
        padding: "16px",
        borderRadius: "8px",
        cursor: "pointer",
      }}
    >
      <div>
        <div className={`flex items-center space-x-1 ${liveGame ? "" : "invisible"}`}> 
          <span className="text-red-400 text-center">LIVE</span>

          <div className="relative flex h-3 w-3 mt-0.5">
            <div className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75"></div>
            <div className="rounded-full w-full bg-red-400"></div>
          </div>
        </div>

        <h3 style={{ fontSize: "18px", fontWeight: "bold"}}>
          {name}
        </h3>
        <p style={{ fontSize: "16px", marginBottom: "4px" }}>{duration}</p>
        <p style={{ fontSize: "16px", marginBottom: "4px" }}>
          {new Intl.DateTimeFormat([], {
            timeZone: 'UTC',
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          }).format(startDate)}
        </p>
        <p
          style={{
            fontSize: "16px",
            color: "#888",
            textAlign: "right",
            marginRight: "8px",
          }}
        >
          Price: ${price}
        </p>
      </div>
    </button>
  );
};

export default GameCard;