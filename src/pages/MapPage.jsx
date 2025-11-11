import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaMapMarkedAlt } from "react-icons/fa";

const API_KEY = "03ed03959111bb9fb62af35daef106de";

const MapPage = () => {
  const [city, setCity] = useState("");
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCoordinates = async () => {
    if (!city.trim()) return setError("Please enter a city name");
    setError("");
    setLoading(true);
    setCoords(null);

    try {
      const res = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
      );

      if (!res.data.length) throw new Error("City not found");
      const { lat, lon, name, country, state } = res.data[0];
      setCoords({ lat, lon, name, country, state });
    } catch {
      setError("City not found. Please try again.");
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
          <FaArrowLeft /> Back
        </Link>
        <h1 className="text-lg sm:text-xl font-semibold">
          <span className="text-purple-400">Locate on Map</span>
        </h1>
        <div className="w-10"></div>
      </nav>

      {/* Main Section */}
      <main className="flex flex-col items-center justify-center grow text-center px-4 sm:px-10 py-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Find Your <span className="text-purple-400">City on Map</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mb-6">
            Get your city’s exact coordinates and view it on Google Maps.
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
              onClick={fetchCoordinates}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 font-semibold transition shadow-md w-full sm:w-auto"
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </div>
        </motion.div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {/* Map Display */}
        {coords && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full flex flex-col items-center"
          >
            {/* City Info Card */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-lg p-8 sm:p-10 text-center mb-8 w-full max-w-md">
              <FaMapMarkedAlt className="text-6xl text-purple-400 mx-auto mb-3" />
              <h2 className="text-3xl font-bold mb-1">{coords.name}</h2>
              <p className="text-gray-400 text-sm">
                {coords.state ? `${coords.state}, ` : ""}
                {coords.country}
              </p>

              <div className="mt-4 text-gray-300 text-sm">
                Latitude:{" "}
                <span className="text-white font-semibold">
                  {coords.lat.toFixed(3)}
                </span>{" "}
                | Longitude:{" "}
                <span className="text-white font-semibold">
                  {coords.lon.toFixed(3)}
                </span>
              </div>
            </div>

            {/* Embedded Map */}
            <div className="rounded-3xl overflow-hidden border border-white/20 shadow-2xl w-full max-w-3xl">
              <iframe
                title="Google Map"
                width="100%"
                height="400"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${coords.lat},${coords.lon}&z=11&output=embed`}
              ></iframe>
            </div>
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

export default MapPage;