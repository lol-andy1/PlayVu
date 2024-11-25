import React, { useState, useEffect } from "react";
import GameCard from "./components/GameCard";
import axios from "axios";

const Search = () => {
  const [games, setGames] = useState([]);
  const [location, setLocation] = useState(null);
  const [distance, setDistance] = useState(10);
  const [sortKey, setSortKey] = useState("id");
  const [manualLocation, setManualLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const geocodeLocation = async (locationInput) => {
    try {
      setIsLoading(true);
      const res = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
        params: {
          q: locationInput,
          key: "31c7fc5d9b594087b094b82c77d6cd2f",
        },
      });
      if (res.data.results.length > 0) {
        const { lat, lng } = res.data.results[0].geometry;
        setLocation({ latitude: lat, longitude: lng });
      } else {
        alert("No results found for the provided location.");
      }
    } catch (err) {
      console.error("Error while geocoding:", err);
      alert("Error fetching location. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredGames = [...games].sort((a, b) => {
    if (sortKey === "price") {
      return (a.price || 0) - (b.price || 0);
    } else if (sortKey === "date") {
      return new Date(a.startDate) - new Date(b.startDate);
    } else if (sortKey === "players") {
      return a.playerCount - b.playerCount;
    }
    return 0;
  });

  useEffect(() => {
    const getGames = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `/api/get-games?latitude=${location.latitude}&longitude=${location.longitude}&distance=${distance * 1.609}`
        );
        const sortedGames = res.data
          .map((game) => ({
            id: game.game_id,
            location: game.location,
            name: game.name,
            startDate: new Date(game.start_date),
            endDate: new Date(game.end_date),
            price: game.price,
            playerCount: game.playerCount,
            max_players: game.max_players,
            picture: game.picture
          }))
          .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        setGames(sortedGames);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (location) {
      getGames();
    }
  }, [location, distance]);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (err) => console.error(err)
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-[80vh]">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Search for Games
        </h1>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-full">
            <p className="text-center text-sm text-gray-600 mb-2">
              Selected Distance: <span className="font-medium">{distance} miles</span>
            </p>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="w-full accent-green-600"
            />
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={requestLocation}
              className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700"
            >
              Search By My Location
            </button>
          </div>
          <span className="text-gray-500 font-medium">OR</span>
          <div className="w-full flex space-x-4">
            <input
              type="text"
              placeholder="Enter a location (City, State)"
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
              className="flex-grow border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <button
              onClick={() => geocodeLocation(manualLocation)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700"
            >
              Search
            </button>
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="sort" className="block mb-2 text-sm font-medium text-gray-700">
            Sort By:
          </label>
          <select
            id="sort"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="w-full border-gray-300 rounded-lg p-2"
          >
            <option value="date">Date</option>
            <option value="price">Price</option>
            <option value="players">Players</option>
          </select>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-600 mt-6">Loading games...</p>
        ) : (
          <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2">
            {filteredGames.length === 0 ? (
              <p className="text-center text-gray-600 col-span-2">
                No games found. Try adjusting your search criteria.
              </p>
            ) : (
              filteredGames.map((game) => (
                <GameCard
                  key={game.id}
                  id={game.id}
                  name={game.name}
                  price={game.price}
                  location={game.location}
                  startDate={game.startDate}
                  endDate={game.endDate}
                  playerCount={game.playerCount}
                  max_players={game.max_players}
                  picture={game.picture}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
