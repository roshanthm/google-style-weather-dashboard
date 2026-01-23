import React, { useState } from "react";
import { getCurrentWeather } from "../api";

export default function CurrentWeather() {
  const [city, setCity] = useState("Kottayam,IN");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  async function handleSearch() {
    setError("");
    setWeather(null);

    try {
      const data = await getCurrentWeather(city);
      setWeather(data);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "30px auto",
        padding: "20px",
        borderRadius: "16px",
        background: "white",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: "15px" }}>🌍 Weather</h2>

      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city (example: Dubai or Kottayam,IN)"
        style={{
          padding: "10px",
          width: "80%",
          borderRadius: "10px",
          border: "1px solid #ccc",
        }}
      />

      <br />

      <button
        onClick={handleSearch}
        style={{
          marginTop: "15px",
          padding: "10px 20px",
          borderRadius: "10px",
          border: "none",
          background: "#4285F4",
          color: "white",
          cursor: "pointer",
        }}
      >
        Search
      </button>

      {error && (
        <p style={{ color: "red", marginTop: "15px" }}>❌ {error}</p>
      )}

      {weather && (
        <div style={{ marginTop: "20px" }}>
          <h2>{weather.city}</h2>
          <h1 style={{ fontSize: "48px" }}>{weather.temp}°C</h1>

          <p>{weather.description}</p>

          <p>💧 Humidity: {weather.humidity}%</p>
          <p>🌬️ Wind: {weather.wind_speed} m/s</p>
        </div>
      )}
    </div>
  );
}
