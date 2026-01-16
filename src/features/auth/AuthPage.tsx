import { useState } from "react";
import { FaGoogle, FaTimes, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { login } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  ToastItem,
  type LocalToast,
  type ToastType,
} from "../../components/Toast";

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { loading } = useAppSelector((state) => state.auth);
  const [toasts, setToasts] = useState<LocalToast[]>([]);

  const showToast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleClose = () => {
    navigate("/");
  };

  const googleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await dispatch(login(tokenResponse.access_token)).unwrap();
        showToast("Welcome back!", "success");
        navigate("/dashboard");
      } catch (err) {
        const errorMessage =
          typeof err === "string" ? err : "Login failed. Please try again.";
        showToast(errorMessage, "error");
      }
    },
    onError: () => {
      showToast("Google Sign-In failed. Please try again.", "error");
    },
    flow: "implicit",
  });

  return (
    <div className="fixed inset-0 bg-ui-bg bg-gradient-to-br from-ui-bg to-brand-50 flex items-center justify-center p-4 sm:p-6 font-sans overflow-y-auto">
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem
              toast={toast}
              onRemove={() =>
                setToasts((prev) => prev.filter((t) => t.id !== toast.id))
              }
            />
          </div>
        ))}
      </div>

      <div className="w-full max-w-[420px] bg-ui-card rounded-2xl shadow-xl border border-ui-border p-8 sm:p-10 relative z-20 transform transition-all hover:shadow-2xl duration-300">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-ui-muted hover:text-ui-text hover:rotate-90 transition-all duration-300 p-2 rounded-full hover:bg-gray-100"
          aria-label="Close"
        >
          <FaTimes className="text-lg" />
        </button>

        <div className="text-center mb-8">
          <h1 className="text-[2rem] sm:text-[2.5rem] font-bold text-ui-text mb-2 tracking-tight">
            Login
          </h1>
          <p className="text-sm sm:text-base text-ui-muted leading-relaxed">
            Welcome back! Please log in to access your account.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => googleSignIn()}
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

        <div className="flex items-center gap-4 my-8">
          <div className="h-px bg-ui-border flex-1"></div>
          <span className="text-xs font-semibold text-ui-muted uppercase tracking-wider">
            Or
          </span>
          <div className="h-px bg-ui-border flex-1"></div>
        </div>

        <div className="text-center">
          <p className="text-sm text-ui-text">
            New to Chronos?{" "}
            <button
              onClick={() => googleSignIn()}
              className="font-bold text-brand-600 hover:text-brand-500 hover:underline transition-colors cursor-pointer"
            >
              Create an account
            </button>
          </p>
        </div>

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

      <div className="fixed top-20 left-10 w-40 h-40 bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="fixed bottom-20 right-10 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
    </div>
  );
};

export default AuthPage;
