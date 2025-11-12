import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Typewriter } from "react-simple-typewriter"; // ✨ Typewriter import
import { useAuth } from "../context/AuthContext";
import {
  FaUserCircle,
  FaCloudSun,
  FaCalendarAlt,
  FaWind,
  FaMapMarkedAlt,
  FaSignOutAlt,
} from "react-icons/fa";

const HomePage = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mongoUserData, setMongoUserData] = useState({ name: "", email: "" });
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Fetch MongoDB user details
  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user"));
    if (localUser?.type === "mongo" && localUser.email) {
      axios
        .get(`https://openweatherinsights.onrender.com/api/user?email=${localUser.email}`)
        .then((res) => {
          setMongoUserData({
            name: res.data.name,
            email: res.data.email,
          });
        })
        .catch((err) => console.error("Error fetching user:", err));
    }
  }, []);

  // Logout function — instant redirect
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get display name + email
  const displayName = mongoUserData.name || user?.displayName || "User";
  const displayEmail = mongoUserData.email || user?.email || "";

  const cards = [
    {
      id: "weather",
      title: "Current Weather",
      desc: "Get real-time weather data for any city worldwide.",
      icon: <FaCloudSun className="text-yellow-400 text-5xl sm:text-5xl" />,
      path: "/weather",
    },
    {
      id: "forecast",
      title: "5-Day Forecast",
      desc: "See upcoming weather patterns and predictions.",
      icon: <FaCalendarAlt className="text-purple-400 text-5xl sm:text-5xl" />,
      path: "/forecast",
    },
    {
      id: "air",
      title: "Air Quality (AQI)",
      desc: "Check pollution and air quality levels anywhere.",
      icon: <FaWind className="text-blue-400 text-5xl sm:text-5xl" />,
      path: "/air",
    },
    {
      id: "map",
      title: "Locate on Map",
      desc: "Find your city’s coordinates and view on Google Maps.",
      icon: <FaMapMarkedAlt className="text-green-400 text-5xl sm:text-5xl" />,
      path: "/map",
    },
  ];

  return (
    <div
      className="min-h-screen w-full flex flex-col text-white overflow-x-hidden"
      style={{
        background:
          "radial-gradient(circle at center, rgba(88,28,135,0.45) 0%, rgba(10,10,10,0.95) 85%)",
      }}
    >
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-5 sm:px-10 py-4 sm:py-6 backdrop-blur-md border-b border-white/10 relative z-50">
        <div className="text-lg sm:text-2xl font-semibold tracking-tight text-white/90">
          🌤️ <span className="text-purple-400">OpenWeather</span> Insights
        </div>

        {/* Profile Menu */}
        <div ref={menuRef} className="relative">
          <div
            onClick={() => setMenuOpen(!menuOpen)}
            className="cursor-pointer flex items-center gap-2"
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="User"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-purple-400 hover:scale-105 transition"
              />
            ) : (
              <FaUserCircle className="text-gray-300 text-3xl hover:text-purple-400 transition" />
            )}
          </div>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute right-0 top-full mt-3 bg-black backdrop-blur-2xl border border-white/10 rounded-2xl shadow-xl w-64 sm:w-72 p-5 text-center z-50"
              >
                <div className="flex flex-col items-center justify-center">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-16 h-16 rounded-full mb-3 border border-purple-400 object-cover"
                    />
                  ) : (
                    <FaUserCircle className="text-gray-400 text-6xl mb-3" />
                  )}
                  <h3 className="text-white font-semibold text-lg">{displayName}</h3>
                  <p className="text-gray-400 text-sm mb-4">{displayEmail}</p>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 text-red-400 hover:text-red-500 border border-red-500/30 hover:bg-red-500/10 rounded-full py-2 px-5 text-sm font-medium transition mt-2"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Main Section */}
      <main className="flex flex-col items-center justify-center flex-grow text-center px-4 sm:px-8 py-8 sm:py-12">
        <div className="mb-10 sm:mb-16">
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-3 leading-tight">
            {/* Static part */}
            <span className="text-white">Welcome </span>

            {/* Animated part */}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              <Typewriter
                words={[
                  `to OpenWeather Insights`,
                  `, ${displayName}`,
                ]}
                loop={true}
                cursor
                cursorStyle="|"
                typeSpeed={80}
                deleteSpeed={80}
                delaySpeed={2500}
              />
            </span>
          </h1>

          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-3 mt-4">
            Explore real-time weather data, forecasts, air quality details, and
            location insights — all powered by the OpenWeather API.
          </p>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-8 place-items-center w-full max-w-5xl">
          {cards.map((card) => (
            <Link key={card.id} to={card.path} className="w-full flex justify-center">
              <motion.div
                whileHover={{ scale: 1.07 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/15 rounded-3xl shadow-xl aspect-square w-full max-w-[270px] xs:max-w-[280px] sm:max-w-[300px] md:max-w-[320px] lg:max-w-[340px] flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden hover:border-purple-500 hover:shadow-purple-500/20 transition-all duration-300"
              >
                <div className="flex items-center justify-center w-20 h-20 sm:w-18 sm:h-18 rounded-2xl bg-white/5 border border-white/10 mb-5 group-hover:scale-110 group-hover:bg-purple-500/10 transition-all duration-300">
                  {card.icon}
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                  {card.title}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-[240px] px-2">
                  {card.desc}
                </p>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-15 bg-gradient-to-r from-purple-500 to-pink-500 blur-3xl transition-all duration-300"></div>
              </motion.div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 sm:py-8 text-gray-500 text-xs sm:text-sm border-t border-white/10 mt-auto">
        © {new Date().getFullYear()} OpenWeather Insights — Powered by OpenWeather API
      </footer>
    </div>
  );
};

export default HomePage;