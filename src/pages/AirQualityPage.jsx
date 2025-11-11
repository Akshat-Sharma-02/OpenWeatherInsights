import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaSmog } from "react-icons/fa";

const API_KEY = "03ed03959111bb9fb62af35daef106de";

// Calculate AQI using PM2.5 (US EPA formula)
const calculateAQI = (pm25) => {
  if (pm25 <= 12) return { aqi: ((50 / 12) * pm25).toFixed(0), label: "Good", color: "text-green-400" };
  if (pm25 <= 35.4) return { aqi: ((49 / 23.4) * (pm25 - 12.1) + 51).toFixed(0), label: "Moderate", color: "text-yellow-400" };
  if (pm25 <= 55.4) return { aqi: ((49 / 20) * (pm25 - 35.5) + 101).toFixed(0), label: "Unhealthy for Sensitive", color: "text-orange-400" };
  if (pm25 <= 150.4) return { aqi: ((49 / 94.9) * (pm25 - 55.5) + 151).toFixed(0), label: "Unhealthy", color: "text-red-400" };
  if (pm25 <= 250.4) return { aqi: ((99 / 99.9) * (pm25 - 150.5) + 201).toFixed(0), label: "Very Unhealthy", color: "text-purple-400" };
  return { aqi: ((99 / 249.5) * (pm25 - 250.5) + 301).toFixed(0), label: "Hazardous", color: "text-pink-500" };
};

const AirQualityPage = () => {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAQI = async () => {
    if (!city.trim()) return setError("Please enter a city name");
    setError("");
    setLoading(true);
    setData(null);

    try {
      // Get city coordinates
      const geo = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
      );

      if (!geo.data.length) throw new Error("City not found");

      const { lat, lon, name } = geo.data[0];

      // Get AQI data
      const aqiRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );

      const components = aqiRes.data.list[0].components;
      const pm25 = components.pm2_5;
      const aqiData = calculateAQI(pm25);

      setData({
        city: name,
        coords: { lat, lon },
        components,
        aqi: aqiData.aqi,
        category: aqiData.label,
        color: aqiData.color,
      });
    } catch {
      setError("City not found. Please try again.");
    }

    setLoading(false);
  };

  const pollutantUnits = {
    co: "μg/m³",
    no: "μg/m³",
    no2: "μg/m³",
    o3: "μg/m³",
    so2: "μg/m³",
    pm2_5: "μg/m³",
    pm10: "μg/m³",
    nh3: "μg/m³",
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col text-white"
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
          <FaArrowLeft /> Back
        </Link>
        <h1 className="text-lg sm:text-xl font-semibold">
          <span className="text-purple-400">Air Quality Index</span>
        </h1>
        <div className="w-10"></div>
      </nav>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center grow text-center px-4 sm:px-10 py-10">
        <div className="w-full max-w-md mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Check <span className="text-purple-400">Air Quality</span> in Your City
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mb-6">
            Get accurate AQI value and pollutant levels (PM2.5, PM10, O₃, etc.)
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="text"
              placeholder="Enter city name..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="grow px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={fetchAQI}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 font-semibold transition shadow-md w-full sm:w-auto"
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {/* AQI Result */}
        {data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl flex flex-col items-center"
          >
            {/* AQI Summary */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-lg p-8 sm:p-10 text-center mb-8 w-full max-w-md">
              <FaSmog className="text-6xl text-purple-400 mx-auto mb-3" />
              <h2 className="text-3xl font-bold mb-2">{data.city}</h2>
              <p className={`text-5xl font-extrabold ${data.color}`}>
                {data.aqi}
              </p>
              <p className={`text-lg font-semibold mt-2 ${data.color}`}>
                {data.category}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Based on PM2.5 concentration
              </p>
            </div>

            {/* Pollutant Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 w-full max-w-5xl">
              {Object.entries(data.components).map(([key, value]) => (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-md p-5 flex flex-col items-center justify-center hover:border-purple-500 hover:shadow-purple-500/20 transition-all duration-300"
                >
                  <h3 className="uppercase text-sm font-semibold text-purple-300 mb-2">
                    {key}
                  </h3>
                  <p className="text-2xl font-bold">{value.toFixed(1)}</p>
                  <p className="text-gray-400 text-xs">
                    {pollutantUnits[key] || ""}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Coordinates */}
            <p className="text-gray-400 text-xs mt-6">
              Coordinates: {data.coords.lat.toFixed(2)}, {data.coords.lon.toFixed(2)}
            </p>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-5 sm:py-6 text-gray-500 text-xs sm:text-sm border-t border-white/10 mt-auto">
        © {new Date().getFullYear()} OpenWeather Insights — Powered by OpenWeather API
      </footer>
    </div>
  );
};

export default AirQualityPage;