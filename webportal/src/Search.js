import React, { useState, useEffect } from "react";
import GameCard from "./components/GameCard";
import axios from "axios";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [games, setGames] = useState([]);
  const [filterKey, setFilterKey] = useState("name");
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
        const res = await axios.get(
          `/api/get-games?latitude=${location.latitude}&longitude=${location.longitude}&distance=${distance*1.609}`
        );
        setGames(
          res.data.map((game) => ({
            duration: game.duration,
            name: game.name,
            date: game.start_date,
            price: game.price,
          }))
        );
      } catch (err) {
        console.error(err);
      }
    };

    getGames();
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
      <input
        type="number"
        placeholder="Enter distance in miles"
        value={distance}
        onChange={(e) => setDistance(e.target.value)}
        style={{
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
          width: "100%",
        }}
      />

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
            date={new Date(game.date).toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
        ))}
      </div>
    </div>
  );
};

export default Search;
