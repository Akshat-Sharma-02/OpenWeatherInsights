import React from "react";
import { useLocation, Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { FaArrowLeft } from "react-icons/fa";

const DayDetailPage = () => {
  const { state } = useLocation();
  const { dayData = [], city = "" } = state || {};

  if (!dayData.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-b from-purple-900/40 to-black">
        <p>No data available. Go back and try again.</p>
        <Link to="/forecast" className="mt-3 text-purple-400 underline">
          Back
        </Link>
      </div>
    );
  }

  const chartData = dayData.map((item) => ({
    time: item.dt_txt.split(" ")[1].slice(0, 5),
    temp: Math.round(item.main.temp),
  }));

  const mainDesc = dayData[0].weather[0].description;

  return (
    <div
      className="min-h-screen w-full flex flex-col text-white px-4 sm:px-10"
      style={{
        background:
          "radial-gradient(circle at center, rgba(88,28,135,0.45) 0%, rgba(10,10,10,0.95) 85%)",
      }}
    >
      <nav className="w-full flex justify-between items-center py-5 border-b border-white/10 backdrop-blur-md">
        <Link
          to="/forecast"
          className="flex items-center gap-2 text-white/90 hover:text-purple-400 transition"
        >
          <FaArrowLeft /> Back
        </Link>
        <h1 className="text-lg sm:text-xl font-semibold">
          <span className="text-purple-400">{city}</span> — Hourly Forecast
        </h1>
        <div className="w-10"></div>
      </nav>

      <main className="flex flex-col items-center justify-center flex-grow py-10 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 capitalize">
          {new Date(dayData[0].dt_txt).toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}{" "}
          — <span className="text-purple-400">{mainDesc}</span>
        </h2>

        <div className="w-full max-w-4xl h-80 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-5">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(30,30,30,0.8)",
                  borderRadius: "10px",
                  border: "none",
                  color: "#fff",
                }}
              />
              <Line type="monotone" dataKey="temp" stroke="#a855f7" strokeWidth={3} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </main>

      <footer className="text-center py-5 text-gray-500 text-xs sm:text-sm border-t border-white/10 mt-auto">
        © {new Date().getFullYear()} OpenWeather Insights — Powered by OpenWeather API
      </footer>
    </div>
  );
};

export default DayDetailPage;