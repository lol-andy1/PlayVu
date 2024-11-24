import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GameCard = ({ id, name, price, location, startDate, playerCount, max_players, endDate, field }) => {
  const navigate = useNavigate();
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const now = new Date();

      setIsLive(now >= start && now < end);
    }
  }, [startDate, endDate]);

  return (
    <div
      onClick={() => navigate(`/game-details/${id}`)}
      className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md border border-gray-200 cursor-pointer transition-transform transform hover:scale-105 hover:shadow-xl mb-4"
    >
      <div className="p-4">

        <div className="flex items-center justify-between">

          <h3 className="text-xl font-semibold text-gray-800 truncate">{name}</h3>

          {isLive && (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-red-500 bg-red-100 px-2 py-1 rounded-full">
                LIVE
              </span>
              <div className="relative flex h-3 w-3">
                <div className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75"></div>
                <div className="rounded-full h-3 w-3 bg-red-500"></div>
              </div>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 mt-1">{location}</p>

        <p className="text-sm text-gray-500 mt-1">{new Date(startDate).toLocaleString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}</p>

        {field && <p className="text-sm text-gray-500 mt-1">Field: {field}</p>}

        <div className="flex justify-between items-center mt-3">
          {playerCount !== null ? (
            <p className="text-sm text-gray-700">
              <span className="font-medium">{playerCount}</span> / {max_players} players
            </p>
          ) : (
            <p className="text-sm text-gray-700">No players yet</p>
          )}
          <p className="text-sm text-gray-700 font-medium">
            {price ? `$${price.toFixed(2)}` : "Free"}
          </p>
        </div>
      </div>

      <div className="h-1 w-full bg-gradient-to-r from-green-400 to-blue-500 rounded-b-lg"></div>
    </div>
  );
};

export default GameCard;
