import React from "react";
import CurrentWeather from "./components/CurrentWeather";

export default function App() {
  return (
    <div
      style={{
        background: "#e8f0fe",
        minHeight: "100vh",
        paddingTop: "30px",
      }}
    >
      <h1 style={{ textAlign: "center" }}>🌦️ Google-Style Weather</h1>
      <CurrentWeather />
    </div>
  );
}
