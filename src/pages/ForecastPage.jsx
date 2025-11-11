import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
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
  if (d.includes("clear")) return <WiDaySunny className="text-yellow-400 text-6xl" />;
  if (d.includes("cloud")) return <WiCloudy className="text-gray-300 text-6xl" />;
  if (d.includes("rain")) return <WiRain className="text-blue-400 text-6xl" />;
  if (d.includes("thunder")) return <WiThunderstorm className="text-purple-400 text-6xl" />;
  if (d.includes("snow")) return <WiSnow className="text-cyan-200 text-6xl" />;
  if (d.includes("fog") || d.includes("mist")) return <WiFog className="text-gray-400 text-6xl" />;
  return <WiDayCloudy className="text-indigo-300 text-6xl" />;
};

const ForecastPage = () => {
  const [city, setCity] = useState("");
  const [groupedData, setGroupedData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchForecast = async () => {
    if (!city.trim()) return setError("Please enter a city name");
    setError("");
    setLoading(true);

    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );

      const grouped = {};
      res.data.list.forEach((item) => {
        const date = item.dt_txt.split(" ")[0];
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(item);
      });

      setGroupedData(Object.entries(grouped).map(([date, items]) => ({ date, items })));
    } catch {
      setError("City not found. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col text-white"
      style={{
        background:
          "radial-gradient(circle at center, rgba(88,28,135,0.45) 0%, rgba(10,10,10,0.95) 85%)",
      }}
    >
      <nav className="w-full flex justify-between items-center py-5 px-4 sm:px-8 border-b border-white/10 backdrop-blur-md">
        <Link to="/home" className="flex items-center gap-2 text-white/90 hover:text-purple-400 transition">
          <FaArrowLeft /> Back
        </Link>
        <h1 className="text-lg sm:text-xl font-semibold">
          <span className="text-purple-400">5-Day Forecast</span>
        </h1>
        <div className="w-10"></div>
      </nav>

      <main className="flex flex-col items-center justify-center flex-grow py-10 px-4 sm:px-10 text-center">
        <div className="w-full max-w-md">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Find Your City’s <span className="text-purple-400">Forecast</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mb-6">
            Click on a day to view detailed hourly data.
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
              onClick={fetchForecast}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 font-semibold transition shadow-md w-full sm:w-auto"
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </div>
        </div>

        {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}

        {groupedData.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mt-12 w-full max-w-3xl mx-auto space-y-5"
          >
            {groupedData.map((day, idx) => {
              const temps = day.items.map((i) => i.main.temp);
              const desc = day.items[Math.floor(day.items.length / 2)].weather[0].description;
              const avgTemp = Math.round(temps.reduce((a, b) => a + b, 0) / temps.length);

              return (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.03 }}
                  onClick={() =>
                    navigate(`/forecast/${day.date}`, {
                      state: { dayData: day.items, city },
                    })
                  }
                  className="cursor-pointer relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-lg p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between hover:border-purple-500 hover:shadow-purple-500/20 transition-all"
                >
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-purple-300">
                      {new Date(day.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                    </h3>
                    <p className="text-gray-400 capitalize">{desc}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    {getWeatherIcon(desc)}
                    <p className="text-3xl font-bold mt-1">{avgTemp}°C</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </main>

      <footer className="text-center py-5 sm:py-6 text-gray-500 text-xs sm:text-sm border-t border-white/10 mt-auto">
        © {new Date().getFullYear()} OpenWeather Insights — Powered by OpenWeather API
      </footer>
    </div>
  );
};

export default ForecastPage;