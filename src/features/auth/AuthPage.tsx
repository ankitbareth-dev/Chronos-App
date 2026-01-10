import React from "react";
import {
  FaGoogle,
  FaChartPie,
  FaShieldAlt,
  FaClock,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const handleGoogleSignIn = () => {
    console.log("Initiating Google Sign In...");
    // Add your Google Auth logic here
  };

  const handleClose = () => {
    navigate("/");
  };

  return (
    //
    // FIX FOR NAVBAR OVERLAP:
    // 1. mt-16 lg:mt-20: Pushes content down so it sits BELOW the navbar.
    //    - Assumes Mobile Navbar is ~64px (4rem) and Desktop is ~80px (5rem).
    // 2. min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-5rem)]:
    //    - Calculates height by subtracting the margin size.
    //    - This ensures NO scrollbars (Margin + Height = 100vh).
    //
    <div className="w-full mt-16 lg:mt-20 min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-5rem)] flex items-center justify-center bg-ui-bg font-sans relative overflow-hidden bg-gradient-to-br from-ui-bg to-brand-50">
      {/* --- Main Card (Centered) --- */}
      <div className="w-full max-w-[420px] bg-ui-card rounded-2xl shadow-xl border border-ui-border p-8 sm:p-10 relative z-20 transform transition-all hover:shadow-2xl duration-500">
        {/* Close Button - Top Right of Card */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-ui-muted hover:text-ui-text hover:rotate-90 transition-all duration-300 p-2 rounded-full hover:bg-gray-100"
          aria-label="Close"
        >
          <FaTimes className="text-xl" />
        </button>

        {/* Icon / Logo Area */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-brand-500 to-brand-400 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/30 rotate-3 hover:rotate-6 transition-transform duration-300">
            <FaClock className="text-white text-2xl" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-ui-text mb-2">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent">
              Chronos
            </span>
          </h1>
          <p className="text-ui-muted text-base leading-relaxed">
            Visualize your time, transform your life.
            <br />
            Sign in to start tracking.
          </p>
        </div>

        {/* Auth Form */}
        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            className="group w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 border-2 border-ui-border text-ui-text font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 hover:border-brand-300 hover:shadow-md active:scale-[0.98]"
            type="button"
          >
            {/* Google Icon */}
            <FaGoogle className="text-lg text-red-500 group-hover:scale-110 transition-transform duration-200" />
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-8">
          <div className="h-px bg-ui-border flex-1"></div>
          <span className="text-xs font-semibold text-ui-muted uppercase tracking-wider">
            Secure Access
          </span>
          <div className="h-px bg-ui-border flex-1"></div>
        </div>

        {/* Feature Bullet Points */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-3 text-sm text-ui-muted">
            <div className="w-5 h-5 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
              <FaShieldAlt className="text-xs" />
            </div>
            <span>Encrypted & Private Data</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-ui-muted">
            <div className="w-5 h-5 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
              <FaChartPie className="text-xs" />
            </div>
            <span>Instant Analytics Setup</span>
          </div>
        </div>

        {/* Terms / Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-ui-muted leading-relaxed">
            By continuing, you agree to our{" "}
            <a
              href="#"
              className="text-brand-600 hover:text-brand-500 font-medium hover:underline"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-brand-600 hover:text-brand-500 font-medium hover:underline"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>

      {/* --- Decorative Background Elements (Subtle) --- */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
    </div>
  );
};

export default AuthPage;
