import React from "react";
import { FaGoogle, FaTimes, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { login } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

interface GoogleTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { loading, error } = useAppSelector((state) => state.auth);

  const handleClose = () => {
    navigate("/");
  };

  const googleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse: GoogleTokenResponse) => {
      try {
        await dispatch(login(tokenResponse.access_token)).unwrap();
        navigate("/dashboard");
      } catch (err) {
        console.error("Login error:", err);
      }
    },
    onError: () => {
      console.error("Google Sign-In failed");
    },
    flow: "implicit",
  });

  const handleGoogleSignIn = () => {
    googleSignIn();
  };

  return (
    // Full viewport height, centered content, uses your bg-ui-bg with a subtle gradient
    <div className="fixed inset-0 bg-ui-bg bg-gradient-to-br from-ui-bg to-brand-50 flex items-center justify-center p-4 sm:p-6 font-sans overflow-y-auto">
      {/* --- Main Login Card --- */}
      <div className="w-full max-w-[420px] bg-ui-card rounded-2xl shadow-xl border border-ui-border p-8 sm:p-10 relative z-20 transform transition-all hover:shadow-2xl duration-300">
        {/* Close Button (Top Right) */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-ui-muted hover:text-ui-text hover:rotate-90 transition-all duration-300 p-2 rounded-full hover:bg-gray-100"
          aria-label="Close"
        >
          <FaTimes className="text-lg" />
        </button>

        {/* --- Header Section (Matching Image Layout) --- */}
        <div className="text-center mb-8">
          <h1 className="text-[2rem] sm:text-[2.5rem] font-bold text-ui-text mb-2 tracking-tight">
            Login
          </h1>
          <p className="text-sm sm:text-base text-ui-muted leading-relaxed">
            Welcome back! Please log in to access your account.
          </p>
        </div>

        {/* --- Error Message --- */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-600 text-sm">
            <FaTimes className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* --- Auth Buttons (Only Google) --- */}
        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className={`group relative w-full flex items-center justify-center gap-3 bg-white border border-ui-border text-ui-text font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-sm hover:shadow-md hover:border-brand-300 ${
              loading ? "cursor-not-allowed opacity-70" : ""
            }`}
            type="button"
          >
            {loading ? (
              <>
                <FaSpinner className="text-xl animate-spin text-brand-500" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <FaGoogle className="text-xl text-red-500 group-hover:scale-110 transition-transform duration-200" />
                <span>Continue with Google</span>
              </>
            )}
          </button>
        </div>

        {/* --- Visual Divider --- */}
        <div className="flex items-center gap-4 my-8">
          <div className="h-px bg-ui-border flex-1"></div>
          <span className="text-xs font-semibold text-ui-muted uppercase tracking-wider">
            Or
          </span>
          <div className="h-px bg-ui-border flex-1"></div>
        </div>

        {/* --- Sign Up Prompt (Replacing the Sign Up button from the image) --- */}
        <div className="text-center">
          <p className="text-sm text-ui-text">
            New to Chronos?{" "}
            <button
              onClick={handleGoogleSignIn}
              className="font-bold text-brand-600 hover:text-brand-500 hover:underline transition-colors cursor-pointer"
            >
              Create an account
            </button>
          </p>
        </div>

        {/* --- Terms Footer --- */}
        <div className="mt-8 text-center">
          <p className="text-[11px] text-ui-muted leading-relaxed px-2">
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

      {/* --- Decorative Background Blobs (Using Brand Colors) --- */}
      <div className="fixed top-20 left-10 w-40 h-40 bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="fixed bottom-20 right-10 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
    </div>
  );
};

export default AuthPage;
