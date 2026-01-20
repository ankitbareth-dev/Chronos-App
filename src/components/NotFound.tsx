import { useNavigate } from "react-router-dom";
import { FaClock, FaGhost, FaHome, FaArrowLeft } from "react-icons/fa";

import { useAppSelector } from "../app/hooks";
import { selectAuth } from "../features/auth/authSlice";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector(selectAuth);

  const handlePrimaryAction = () => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    } else {
      navigate(-1);
    }
  };

  const handleSecondaryAction = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-ui-bg text-ui-text relative overflow-hidden font-sans antialiased selection:bg-brand-100 selection:text-brand-900 z-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-400/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "0s" }}
        ></div>

        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-category-orange/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-category-green/5 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="relative z-10 bg-ui-card/90 backdrop-blur-xl border border-ui-border p-6 md:p-10 rounded-3xl shadow-2xl max-w-lg w-[90%] mx-4 text-center flex flex-col items-center">
        <div className="relative mb-8 group cursor-default">
          <div className="absolute inset-0 bg-brand-500/20 rounded-full blur-xl group-hover:bg-brand-500/30 transition-all duration-500"></div>
          <div className="relative bg-ui-bg border border-brand-100 p-6 rounded-full text-brand-500 shadow-inner transform group-hover:scale-105 transition-transform duration-500 ease-out">
            <FaClock className="w-20 h-20 animate-spin-slow" />
          </div>

          <div className="absolute -bottom-3 -right-3 bg-white border border-ui-border p-3 rounded-full shadow-lg text-ui-muted animate-bounce">
            <FaGhost className="w-7 h-7" />
          </div>
        </div>

        <h1 className="text-7xl font-black text-ui-text mb-2 tracking-tighter">
          404
        </h1>
        <h2 className="text-2xl font-bold text-ui-text mb-4">Page Not Found</h2>
        <p className="text-ui-muted mb-8 leading-relaxed text-sm md:text-base">
          Oops! It seems you've wandered into a time loop that doesn't exist.
          The page or resource you are looking for is currently unavailable.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={handlePrimaryAction}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-500 text-white font-semibold shadow-lg shadow-brand-500/30 hover:bg-brand-600 hover:shadow-brand-600/40 transition-all duration-300 active:scale-95"
          >
            {isAuthenticated ? (
              <>
                <FaHome className="text-sm" />
                Dashboard
              </>
            ) : (
              <>
                <FaArrowLeft className="text-sm" />
                Go Back
              </>
            )}
          </button>

          <button
            onClick={handleSecondaryAction}
            className="flex-1 px-6 py-3.5 rounded-xl border border-ui-border text-ui-text font-semibold hover:bg-ui-bg hover:border-brand-300 hover:text-brand-600 transition-all duration-300 active:scale-95"
          >
            Home
          </button>
        </div>

        <div className="mt-8 w-full grid grid-cols-8 gap-1 opacity-20">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full ${i % 3 === 0 ? "bg-category-green" : i % 3 === 1 ? "bg-category-orange" : "bg-brand-500"}`}
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-4 text-ui-muted text-xs md:text-sm">
        Chronos &copy; {new Date().getFullYear()}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.05); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFound;
