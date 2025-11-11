import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiThunderstorm,
  WiSnow,
  WiFog,
  WiDayCloudy,
} from "react-icons/wi";
import { FaArrowLeft } from "react-icons/fa";

const API_KEY = "03ed03959111bb9fb62af35daef106de";

const getWeatherIcon = (desc) => {
  const d = desc?.toLowerCase() || "";
  if (d.includes("clear")) return <WiDaySunny className="text-yellow-400 text-7xl" />;
  if (d.includes("cloud")) return <WiCloudy className="text-gray-300 text-7xl" />;
  if (d.includes("rain")) return <WiRain className="text-blue-400 text-7xl" />;
  if (d.includes("thunder")) return <WiThunderstorm className="text-purple-400 text-7xl" />;
  if (d.includes("snow")) return <WiSnow className="text-cyan-200 text-7xl" />;
  if (d.includes("fog") || d.includes("mist")) return <WiFog className="text-gray-400 text-7xl" />;
  return <WiDayCloudy className="text-indigo-300 text-7xl" />;
};

const WeatherPage = () => {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city.trim()) return setError("Please enter a city name");
    setError("");
    setLoading(true);
    setData(null);

    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setData(res.data);
    } catch (err) {
      setError("City not found. Please try again.");
      setData(null);
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col text-white overflow-x-hidden"
      style={{
        background:
          "radial-gradient(circle at center, rgba(88,28,135,0.45) 0%, rgba(10,10,10,0.95) 85%)",
      }}
    >
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center py-5 px-4 sm:px-8 border-b border-white/10 backdrop-blur-md">
        <Link
          to="/home"
          className="flex items-center gap-2 text-white/90 hover:text-purple-400 transition"
        >
          <FaArrowLeft className="text-sm" /> Back
        </Link>
        <h1 className="text-lg sm:text-xl font-semibold">
          <span className="text-purple-400">Current Weather</span>
        </h1>
        <div className="w-10"></div>
      </nav>

      {/* Main Content (Vertically Centered) */}
      <main className="flex flex-col items-center justify-center flex-grow text-center px-4 sm:px-8 py-10">
        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Check <span className="text-purple-400">Current Weather</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mb-6">
            Enter a city name to get live temperature, humidity, and other details.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="text"
              placeholder="Enter city name..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-grow px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={fetchWeather}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 font-semibold transition shadow-md w-full sm:w-auto"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </motion.div>

        {/* Error */}
        {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}

        {/* Weather Display */}
        {data && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-12 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8 sm:p-10 w-full max-w-md flex flex-col items-center text-center relative overflow-hidden"
          >
            {/* Soft Glow Background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/10 blur-3xl opacity-0"
              animate={{ opacity: [0.1, 0.2, 0.1] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            ></motion.div>

            {/* Weather Icon */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              {getWeatherIcon(data.weather[0].description)}
            </motion.div>

            <h2 className="text-2xl sm:text-3xl font-bold mt-4">{data.name}</h2>
            <p className="text-gray-400 capitalize text-sm sm:text-base mt-1">
              {data.weather[0].description}
            </p>

            <h1 className="text-5xl sm:text-6xl font-extrabold mt-4">
              {Math.round(data.main.temp)}°C
            </h1>

            <div className="grid grid-cols-2 gap-4 mt-6 text-xs sm:text-sm text-gray-300 w-full max-w-sm">
              <p>
                Humidity: <span className="text-white">{data.main.humidity}%</span>
              </p>
              <p>
                Wind: <span className="text-white">{data.wind.speed} m/s</span>
              </p>
              <p>
                Pressure: <span className="text-white">{data.main.pressure} hPa</span>
              </p>
              <p>
                Visibility:{" "}
                <span className="text-white">{(data.visibility / 1000).toFixed(1)} km</span>
              </p>
            </div>

            <div className="mt-5 text-xs sm:text-sm text-gray-400">
              Feels like{" "}
              <span className="text-white font-semibold">
                {Math.round(data.main.feels_like)}°C
              </span>{" "}
              | Min:{" "}
              <span className="text-white font-semibold">
                {Math.round(data.main.temp_min)}°C
              </span>{" "}
              | Max:{" "}
              <span className="text-white font-semibold">
                {Math.round(data.main.temp_max)}°C
              </span>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-5 sm:py-6 text-gray-500 text-xs sm:text-sm border-t border-white/10 mt-auto w-full">
        © {new Date().getFullYear()} OpenWeather Insights — Powered by OpenWeather API
      </footer>
    </div>
  );
};

export default WeatherPage;