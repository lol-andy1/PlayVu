import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GameCard = ({ id, name, price, location, startDate, playerCount, max_players, endDate, field }) => {
  const navigate = useNavigate();
  const [liveGame, setLiveGame] = useState(false);

  useEffect(() => {
    if (startDate && endDate) {
      const localDate = new Date();
      const offset = localDate.getTimezoneOffset();
      localDate.setMinutes(localDate.getMinutes() - offset);

      if (localDate >= startDate && localDate < endDate) {
        setLiveGame(true);
      }
    }
  }, [startDate, endDate]);

  return (
    <button
      onClick={() => navigate(`/game-details/${id}`)}
      className="w-full border-t border-black bg-gray-100 p-4 rounded-lg cursor-pointer mb-4"
    >
      <div>
        <div className={`flex items-center space-x-1 ${liveGame ? "" : "invisible"}`}>
          <span className="text-red-400">LIVE</span>
          <div className="relative flex h-3 w-3 mt-0.5">
            <div className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75"></div>
            <div className="rounded-full w-full bg-red-400"></div>
          </div>
        </div>
      
        <h3 className="text-lg font-bold">{name}</h3>
        <p className="text-sm mb-1">{location}</p>
        <p className="text-sm mb-1">{new Date(startDate).toLocaleString()}</p>
        <div className="flex justify-between px-2 text-gray-500">
          {playerCount !== null &&
            <p>{playerCount} / {max_players}</p>
          }
          <p>Price: {price ? `$${price}` : "Free"}</p>
        </div>

      </div>
    </button>
  );
};

export default GameCard;
