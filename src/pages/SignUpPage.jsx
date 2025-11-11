import React from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoArrowBack } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../firebase";

const SignUpPage = () => {
  const navigate = useNavigate();

  // 🔹 Handle both Google & GitHub Sign Up
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
    <div className="min-h-screen w-full flex items-center justify-center text-white p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div
        className="absolute inset-0 animate-pulse-slow"
        style={{
          background:
            "radial-gradient(circle at center, rgba(107, 33, 168, 0.4) 0%, rgba(0, 0, 0, 1) 75%)",
          filter: "blur(20px)",
          zIndex: 0,
        }}
      ></div>

      {/* Glass Card */}
      <div className="relative z-10 w-full max-w-md h-[95vh] bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8 flex flex-col justify-center">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-5 left-5 flex items-center gap-2 text-gray-400 hover:text-white transition text-sm font-medium"
        >
          <IoArrowBack size={18} className="text-purple-400" />
          Back
        </button>

        <div className="mt-8">
          <h1 className="text-4xl font-bold text-center mb-2 tracking-tight">
            Create Account
          </h1>
          <p className="text-gray-400 text-center mb-8 text-sm">
            Join the community — it’s quick and easy
          </p>

          {/* OAuth Buttons */}
          <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={() => handleOAuthSignup(githubProvider)}
              className="flex items-center justify-center gap-2 border border-gray-700 hover:bg-white/10 transition rounded-xl py-2.5"
            >
              <FaGithub size={20} /> Sign up with GitHub
            </button>

            <button
              onClick={() => handleOAuthSignup(googleProvider)}
              className="flex items-center justify-center gap-2 border border-gray-700 hover:bg-white/10 transition rounded-xl py-2.5"
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

          {/* Manual Sign-up Form (Fallback) */}
          <form className="flex flex-col gap-4">
            <div>
              <label className="block text-gray-300 mb-1 text-sm">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="Your full name"
                className="w-full px-4 py-2.5 bg-black/40 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1 text-sm">
                Email *
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 bg-black/40 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1 text-sm">
                Password *
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-black/40 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              type="submit"
              className="mt-4 w-full bg-purple-600 hover:bg-purple-700 transition text-white font-semibold py-2.5 rounded-xl shadow-lg"
            >
              Create Account
            </button>
          </form>
        </div>

        {/* Footer */}
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