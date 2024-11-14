import React, { useState, useEffect } from "react";
import GameCard from "./components/GameCard";
import axios from "axios";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [games, setGames] = useState([]);
  const [filterKey, setFilterKey] = useState("name");
  const [location, setLocation] = useState(null);
  const [distance, setDistance] = useState("");
  const filterKeys = ["name", "duration", "price", "date"];

  // Filter games based on search query and selected filter key
  const filteredGames = games.filter((game) =>
    game[filterKey]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const getGames = async () => {
      try {
        const res = await axios.get(
          `/api/get-games?latitude=${location.latitude}&longitude=${location.longitude}&distance=${distance}`
        );
        setGames(
          res.data.map((game) => ({
            duration: game.duration,
            name: game.name,
            date: new Date(game.start_date).toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
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
        style={{ padding: "10px 15px", marginBottom: "10px" }}
      >
        Search Near My Location
      </button>
      
      {location && (
        <p>
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </p>
      )}
      </div>
      <div style={{ fontWeight: "bold" }}>To Futher Narrow Your Search:</div>
      <input
        type="text"
        placeholder="Search games"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          padding: "10px",
          width: "100%",
          borderRadius: "5px",
          border: "1px solid #ddd",
        }}
      />
      <div style={{ fontWeight: "bold" }}>Filter by:</div>
      <div style={{ display: "flex", marginBottom: "20px" }}>
        {filterKeys.map((key) => (
          <button
            key={key}
            onClick={() => setFilterKey(key)}
            style={{
              padding: "10px",
              margin: "0 5px",
              backgroundColor: filterKey === key ? "green" : "gray",
              color: "white",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
            }}
          >
            {key}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {filteredGames.map((game, index) => (
          <GameCard
            key={index}
            id={index}
            name={game.name}
            price={game.price}
            duration={game.duration}
            date={game.date}
          />
        ))}
      </div>
    </div>
  );
};

export default Search;
