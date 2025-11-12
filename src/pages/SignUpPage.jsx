import React, { useState } from "react";
import axios from "axios";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoArrowBack } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../firebase";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://openweatherinsights.onrender.com/api/signup", form);
      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  const handleOAuthSignup = async (provider) => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/home");
    } catch (err) {
      console.error("OAuth Signup Error:", err);
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white p-4" style={{
        background:
          "radial-gradient(circle at center, rgba(107, 33, 168, 0.35) 0%, rgba(0, 0, 0, 0.95) 75%)",
      }}>
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8">
        <button
          onClick={() => navigate("/")}
          className="absolute top-5 left-5 text-gray-400 hover:text-white"
        >
          <IoArrowBack size={18} />
        </button>

        <h1 className="text-4xl font-bold text-center mb-2">Create Account</h1>
        <p className="text-gray-400 text-center mb-8">Join the community — quick and easy</p>

        {/* OAuth */}
        <div className="flex flex-col gap-3 mb-6">
          <button
            onClick={() => handleOAuthSignup(githubProvider)}
            className="flex items-center justify-center gap-2 border border-gray-700 rounded-xl py-2.5"
          >
            <FaGithub size={20} /> Sign up with GitHub
          </button>

          <button
            onClick={() => handleOAuthSignup(googleProvider)}
            className="flex items-center justify-center gap-2 border border-gray-700 rounded-xl py-2.5"
          >
            <FcGoogle size={20} /> Sign up with Google
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="grow h-px bg-gray-700"></div>
          <span className="px-3 text-gray-500 text-sm">or</span>
          <div className="grow h-px bg-gray-700"></div>
        </div>

        {/* Email Signup */}
        <form onSubmit={handleEmailSignup} className="flex flex-col gap-4">
          <input
            name="name"
            placeholder="Full name"
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 bg-black/40 border border-gray-700 rounded-xl"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 bg-black/40 border border-gray-700 rounded-xl"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 bg-black/40 border border-gray-700 rounded-xl"
          />
          <button
            type="submit"
            className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded-xl"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-8">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;