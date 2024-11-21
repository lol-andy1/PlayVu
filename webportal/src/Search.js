import React, { useState, useEffect } from "react";
import GameCard from "./components/GameCard";
import axios from "axios";

const Search = () => {
  const [games, setGames] = useState([]);
  const [location, setLocation] = useState(null);
  const [distance, setDistance] = useState("");
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
        setGames(
          res.data.map((game) => ({
            duration: game.duration,
            id: game.game_id,
            location: game.location,
            name: game.name,
            startDate: new Date(game.timezone),
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
    <div style={{ padding: "20px", backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <div>
        <p style={{ marginBottom: "8px" }}>Select Distance:</p>
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          {[10, 25, 50, 100].map((presetDistance) => (
            <button
              key={presetDistance}
              onClick={() => setDistance(presetDistance)}
              style={{
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ddd",
                backgroundColor: distance === presetDistance ? "gray" : "white",
                color: distance === presetDistance ? "white" : "black",
                cursor: "pointer",
              }}
            >
              {presetDistance} miles
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          <button
            onClick={requestLocation}
            className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Use My Location
          </button>

          <input
            type="text"
            placeholder="Enter a Location (City, State)"
            value={manualLocation}
            onChange={(e) => setManualLocation(e.target.value)}
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              width: "100%",
            }}
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
      <div style={{ marginBottom: "16px" }}>
        <label htmlFor="sort" style={{ marginRight: "8px" }}>
          Sort By:
        </label>
        <select
          id="sort"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
        >
          <option value="date">Date</option>
          <option value="price">Price</option>
          <option value="players">Players</option>
        </select>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {filteredGames.map((game, index) => (
          <GameCard
            id={game.id}
            name={game.name}
            price={game.price}
            location={game.location}
            startDate={game.startDate}
            playerCount={game.playerCount}
            max_players={game.max_players}
          />
        ))}
      </div>
    </div>
  );
};

export default Search;
