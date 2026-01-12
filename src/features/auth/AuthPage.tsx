import React, { useState } from "react";
import {
  FaGoogle,
  FaChartPie,
  FaShieldAlt,
  FaClock,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { ENV } from "../../config/env";

const baseUrl = ENV.API_BASE_URL;

interface GoogleTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    navigate("/");
  };

  // Google Login Hook
  const googleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse: GoogleTokenResponse) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${baseUrl}/api/auth/google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idToken: tokenResponse.access_token,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Server Error: ${response.statusText}`
          );
        }

        const data = await response.json();

        // Optional: Store token if your backend returns one
        // if (data.token) localStorage.setItem("authToken", data.token);

        // Redirect to dashboard on success
        navigate("/dashboard");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An unknown error occurred.";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError("Google Sign-In was unsuccessful. Please try again.");
      setLoading(false);
    },
    flow: "implicit", // Use implicit flow for client-side retrieval
  });

  const handleGoogleSignIn = () => {
    setError(null);
    googleSignIn();
  };

  return (
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

        {/* Error Message Area */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-600 text-sm">
            <FaTimes className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className={`group w-full flex items-center justify-center gap-3 bg-white border-2 text-ui-text font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 active:scale-[0.98] ${
              loading
                ? "border-gray-200 bg-gray-50 cursor-not-allowed text-gray-400"
                : "border-ui-border hover:bg-gray-50 hover:border-brand-300 hover:shadow-md"
            }`}
            type="button"
          >
            {loading ? (
              <>
                <FaSpinner className="text-lg animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                {/* Google Icon */}
                <FaGoogle className="text-lg text-red-500 group-hover:scale-110 transition-transform duration-200" />
                <span>Continue with Google</span>
              </>
            )}
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
