import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiThunderstorm,
  WiSnow,
  WiFog,
  WiDayCloudy,
} from "react-icons/wi";

const cities = [
  { name: "New York", country: "US" },
  { name: "London", country: "GB" },
  { name: "Delhi", country: "IN" },
  { name: "Tokyo", country: "JP" },
  { name: "Beijing", country: "CN" },
  { name: "Seoul", country: "KR" },
  { name: "Dubai", country: "AE" },
  { name: "Singapore", country: "SG" },
];

const API_KEY = "03ed03959111bb9fb62af35daef106de";

const getWeatherIcon = (desc) => {
  const d = desc.toLowerCase();
  if (d.includes("clear")) return <WiDaySunny className="text-yellow-400" />;
  if (d.includes("cloud")) return <WiCloudy className="text-gray-300" />;
  if (d.includes("rain")) return <WiRain className="text-blue-400" />;
  if (d.includes("thunder")) return <WiThunderstorm className="text-purple-400" />;
  if (d.includes("snow")) return <WiSnow className="text-cyan-200" />;
  if (d.includes("mist") || d.includes("fog")) return <WiFog className="text-gray-400" />;
  return <WiDayCloudy className="text-indigo-300" />;
};

const LandingPage = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchWeather = async () => {
      const responses = await Promise.all(
        cities.map((city) =>
          axios
            .get(
              `https://api.openweathermap.org/data/2.5/weather?q=${city.name},${city.country}&appid=${API_KEY}&units=metric`
            )
            .then((res) => ({
              name: city.name,
              temp: res.data.main.temp,
              humidity: res.data.main.humidity,
              wind: res.data.wind.speed,
              description: res.data.weather[0].description,
            }))
            .catch(() => null)
        )
      );
      setWeatherData(responses.filter(Boolean));
    };
    fetchWeather();
  }, []);

  useEffect(() => {
    if (weatherData.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % weatherData.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [weatherData]);

  const currentCity = weatherData[index];

  return (
    <div
      className="min-h-screen w-full text-white flex flex-col bg-cover bg-center"
      style={{
        background:
          "radial-gradient(circle at center, rgba(107, 33, 168, 0.35) 0%, rgba(0, 0, 0, 0.95) 75%)",
      }}
    >
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-4 xs:px-6 sm:px-10 py-4 sm:py-6 whitespace-nowrap overflow-hidden">
        {/* Logo */}
        <div className="shrink-0 text-base xs:text-lg sm:text-xl font-bold tracking-tight text-white/90">
          🌤️ <span className="text-purple-400">OpenWeather</span> Insights
        </div>
        
        {/* Buttons */}
        <div className="flex gap-2 xs:gap-3 sm:gap-4 flex-nowrap ml-2 sm:ml-6">
          <Link
            to="/login"
            className="w-20 xs:w-24 sm:w-28 text-center px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-600 hover:bg-purple-700 rounded-full font-medium text-xs xs:text-sm sm:text-base      transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="w-20 xs:w-24 sm:w-28 text-center px-3 sm:px-4 py-1.5 sm:py-2 border border-purple-500 text-purple-400 rounded-full hover:bg-purple-500/10 transition     font-medium text-xs xs:text-sm sm:text-base"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row grow items-center justify-center px-6 sm:px-10 py-10 md:py-0 text-center md:text-left">
        {/* Left Text */}
        <div className="md:w-1/2 space-y-6 mb-10 md:mb-0">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
            Access Real-Time <br />{" "}
            <span className="text-purple-400">Weather Insights</span>
          </h1>
          <p className="text-gray-300 max-w-md mx-auto md:mx-0 text-base sm:text-lg">
            Stay informed with accurate and up-to-date weather conditions from
            anywhere in the world. Powered by OpenWeather API.
          </p>
          <div>
            <Link
              to="/signup"
              className="inline-block mt-4 w-36 sm:w-44 text-center px-6 sm:px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-full text-white font-medium transition shadow-lg text-sm sm:text-base"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Animated Weather Card */}
        <div className="md:w-1/2 flex justify-center relative min-h-[300px] sm:min-h-[380px] w-xs">
          <AnimatePresence mode="wait">
            {currentCity && (
              <motion.div
                key={currentCity.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-6 sm:p-8 w-[90%] max-w-[320px] flex flex-col items-center text-center"
              >
                {/* Animated Icon */}
                <motion.div
                  className="text-6xl sm:text-7xl mb-3 sm:mb-4"
                  animate={{
                    scale: [1.1, 1.4, 1.1],
                    rotate: [0, 4, -4, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 5,
                    ease: "easeInOut",
                  }}
                >
                  {getWeatherIcon(currentCity.description)}
                </motion.div>

                <h3 className="text-xl sm:text-2xl font-semibold mb-1">
                  {currentCity.name}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
                  Live Weather
                </p>

                <motion.div
                  className="text-5xl sm:text-6xl font-bold text-white mb-1 sm:mb-2"
                  key={currentCity.temp}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  {Math.round(currentCity.temp)}°C
                </motion.div>

                <p className="text-purple-400 font-medium capitalize mb-3 sm:mb-4 text-sm sm:text-base">
                  {currentCity.description}
                </p>

                <div className="w-full mt-3 sm:mt-4 flex justify-between text-[11px] sm:text-sm text-gray-300">
                  <p>Humidity: {currentCity.humidity}%</p>
                  <p>Wind: {currentCity.wind} km/h</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 sm:py-6 text-gray-500 text-xs sm:text-sm border-t border-white/10">
        © {new Date().getFullYear()} OpenWeather Insights — Powered by OpenWeather API
      </footer>
    </div>
  );
};

export default LandingPage;