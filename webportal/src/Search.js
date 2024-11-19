import React, { useState, useEffect } from "react";
import GameCard from "./components/GameCard";
import axios from "axios";

const Search = () => {
  const [games, setGames] = useState([]);
  const [location, setLocation] = useState(null);
  const [distance, setDistance] = useState("");
  const [sortKey, setSortKey] = useState("id");

  const timeToSeconds = (time) => {
    if (!time) return 0; // Handle undefined or null durations
    const parts = time.split(":").map(Number); // Split by ":" and convert to numbers
    const [hours = 0, minutes = 0, seconds = 0] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  };

  // Sorting logic
  const filteredGames = [...games].sort((a, b) => {
    if (sortKey === "price") {
      return (a.price || 0) - (b.price || 0);
    } else if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "duration") {
      return timeToSeconds(a.duration) - timeToSeconds(b.duration);
    } else {
      return 0;
    }
  });

  useEffect(() => {
    const getGames = async () => {
      try {
        if (location){
          const res = await axios.get(
            `/api/get-games?latitude=${location.latitude}&longitude=${location.longitude}&distance=${distance*1.609}`
          );
          setGames(
            res.data.map((game) => ({
              duration: game.duration,
              name: game.name,
              startDate: new Date(game.timezone),
              price: game.price,
            }))
          );
        }

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

      <button
        onClick={requestLocation}
        style={{
          padding: "10px",
          margin: "0 5px",
          backgroundColor: "gray",
          color: "white",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
          marginBottom: "16px"
        }}
      >
        Search Near My Location
      </button>
      
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
          <option value="duration">Duration</option>
        </select>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {filteredGames.map((game, index) => (
          <GameCard
            key={index}
            id={index}
            name={game.name}
            price={game.price}
            duration={game.duration}
            startDate={game.startDate}
          />
        ))}
      </div>
    </div>
  );
};

export default Search;
