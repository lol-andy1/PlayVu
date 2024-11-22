import React, { useState, useEffect } from "react";
import GameCard from "./components/GameCard";
import axios from "axios";

const Search = () => {
  const [games, setGames] = useState([]);
  const [location, setLocation] = useState(null);
  const [distance, setDistance] = useState(10);
  const [sortKey, setSortKey] = useState("id");
  const [manualLocation, setManualLocation] = useState("");

  // Function to geocode a manual location input
  const geocodeLocation = async (locationInput) => {
    try {
      const res = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json`,
        {
          params: {
            q: locationInput,
            key: "31c7fc5d9b594087b094b82c77d6cd2f",
          },
        }
      );
      if (res.data.results.length > 0) {
        const { lat, lng } = res.data.results[0].geometry;
        setLocation({ latitude: lat, longitude: lng });
      } else {
        console.error("No results found for the provided location.");
      }
    } catch (err) {
      console.error("Error while geocoding:", err);
    }
  };

  // Sorting logic
  const filteredGames = [...games].sort((a, b) => {
    if (sortKey === "price") {
      return (a.price || 0) - (b.price || 0);
    } else if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "players") {
      return a.playerCount - b.playerCount;
    } else {
      return 0;
    }
  });

  useEffect(() => {
    const getGames = async () => {
      try {
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
            sub_field_id: game.field,
            playerCount: game.playerCount,
            max_players: game.max_players,
          }))
          .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        setGames(sortedGames);
      } catch (err) {
        console.error(err);
      }
    };
    if (location) {
      getGames();
    }
  }, [location, distance]);

  // Request and update location using browser geolocation API
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
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="p-4 bg-white min-h-screen">
      <div>
        <p className="text-center mt-2">
          Selected Distance: <strong>{distance} miles</strong>
        </p>
        <div className="mb-4">
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex justify-center mb-4">
          <button
            onClick={requestLocation}
            className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Search By My Location
          </button>
        </div>
        <p className="text-center mt-2">OR</p>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Enter a Location (City, State)"
            value={manualLocation}
            onChange={(e) => setManualLocation(e.target.value)}
            className="p-2 text-lg border border-gray-300 rounded w-full"
          />
          <button
            onClick={() => geocodeLocation(manualLocation)}
            className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Search
          </button>
        </div>
      </div>

      {/* Dropdown or buttons for selecting sorting criteria */}
      <div className="mb-4">
        <label htmlFor="sort" className="mr-2">
          Sort By:
        </label>
        <select
          id="sort"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="date">Date</option>
          <option value="price">Price</option>
          <option value="players">Players</option>
        </select>
      </div>

      {/* Conditional Rendering for No Results */}
      <div className="flex flex-col items-center">
        {filteredGames.length === 0 ? (
          <p className="text-lg text-gray-600 mt-6">
            No results found. Try adjusting distance or searching in a different location.
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
              field={game.field}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Search;
