import React from "react";
import axios from "axios";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoArrowBack } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleProvider, githubProvider, signInWithPopup } from "../firebase";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await axios.post("https://openweatherinsights.onrender.com/api/login", { email, password });
      alert(res.data.message);
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const handleLogin = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("✅ User:", result.user);
      navigate("/home");
    } catch (error) {
      console.error("❌ Login Error:", error);
      alert(error.message);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center text-white p-4"
      style={{
        background:
          "radial-gradient(circle at center, rgba(107, 33, 168, 0.35) 0%, rgba(0, 0, 0, 0.95) 75%)",
      }}
    >
      <div className="w-full max-w-md h-[95vh] bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8 flex flex-col justify-center relative">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-5 left-5 flex items-center gap-2 text-gray-400 hover:text-white transition text-sm font-medium"
        >
          <IoArrowBack size={18} className="text-purple-400" /> Back
        </button>

        {/* Content */}
        <div className="mt-8">
          <h1 className="text-4xl font-bold text-center mb-2 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-center mb-8 text-sm">
            Sign in to your account to continue your journey
          </p>

          {/* OAuth Buttons */}
          <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={() => handleLogin(githubProvider)}
              className="flex items-center justify-center gap-2 border border-gray-700 hover:bg-white/10 transition rounded-xl py-2.5"
            >
              <FaGithub size={20} /> Continue with GitHub
            </button>

            <button
              onClick={() => handleLogin(googleProvider)}
              className="flex items-center justify-center gap-2 border border-gray-700 hover:bg-white/10 transition rounded-xl py-2.5"
            >
              <FcGoogle size={20} /> Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="grow h-px bg-gray-700"></div>
            <span className="px-3 text-gray-500 text-sm">or</span>
            <div className="grow h-px bg-gray-700"></div>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-gray-300 mb-1 text-sm">Email *</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 bg-black/40 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1 text-sm">Password *</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-black/40 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              type="submit"
              className="mt-4 w-full bg-purple-600 hover:bg-purple-700 transition text-white font-semibold py-2.5 rounded-xl shadow-lg"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center text-gray-400 text-sm mt-8">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-purple-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;