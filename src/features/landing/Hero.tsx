import { useEffect, useRef } from "react";
import { FaChartLine, FaLightbulb, FaPalette } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const matrixAnimationRef = useRef<HTMLDivElement>(null);

  // Configuration for the grid
  const cols = 7;
  const rows = 24;
  const totalCells = cols * rows;

  const handleButtonClick = () => {
    navigate("/auth");
  };

  useEffect(() => {
    const container = matrixAnimationRef.current;
    if (!container) return;

    const cells = container.querySelectorAll<HTMLElement>(".matrix-cell");
    const colors = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

    // Initial random colorization
    cells.forEach((cell) => {
      if (Math.random() > 0.85) {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        cell.style.backgroundColor = randomColor;
      } else {
        cell.style.backgroundColor = "#f3f4f6"; // gray-100 equivalent
      }
    });

    // Animation Loop
    const interval = setInterval(() => {
      // Pick a random cell
      const randomCell = cells[Math.floor(Math.random() * cells.length)];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      // Apply color and transform
      randomCell.style.backgroundColor = randomColor;
      randomCell.style.transform = "scale(1.1)";

      // Reset transform and fade out color logic
      setTimeout(() => {
        randomCell.style.transform = "scale(1)";
        if (Math.random() > 0.7) {
          setTimeout(() => {
            randomCell.style.backgroundColor = "transparent";
          }, 1000);
        }
      }, 300);
    }, 200);

    // Cleanup function is crucial for performance to stop the interval
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden pt-[100px] bg-gradient-to-br from-ui-bg to-brand-50">
      <div className="max-w-[1200px] mx-auto px-5 grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-center">
        {/* Left Content */}
        <div className="text-center lg:text-left">
          <h1 className="text-[3.5rem] leading-tight mb-6 font-bold text-ui-text">
            Visualize Your Time,
            <span className="bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent">
              Transform Your Life
            </span>
          </h1>
          <p className="text-[1.25rem] text-ui-muted mb-8">
            Chronos helps you track, analyze, and optimize how you spend your
            time with an intuitive color-coded matrix system.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
            <button
              className="bg-brand-500 hover:bg-brand-600 text-white font-medium px-7 py-3 rounded transition-colors duration-200 shadow-sm hover:shadow-md cursor-pointer"
              onClick={handleButtonClick}
            >
              Get Started — It's Free
            </button>
          </div>

          <div className="flex gap-10 justify-center lg:justify-start">
            <div className="flex flex-col">
              <span className="text-[1.5rem] font-bold text-brand-500">
                10,000+
              </span>
              <span className="text-sm text-ui-muted">Active Users</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[1.5rem] font-bold text-brand-500">
                1M+
              </span>
              <span className="text-sm text-ui-muted">Hours Tracked</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[1.5rem] font-bold text-brand-500">
                4.8/5
              </span>
              <span className="text-sm text-ui-muted">User Rating</span>
            </div>
          </div>
        </div>

        {/* Right Content - Matrix Animation */}
        <div className="relative h-[300px] lg:h-[500px]">
          <div
            className="absolute w-full h-full bg-white rounded-lg shadow-xl overflow-hidden p-4"
            ref={matrixAnimationRef}
          >
            {/* React Rendered Grid */}
            <div
              className="w-full h-full grid gap-0.5"
              style={{
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, 1fr)`,
              }}
            >
              {Array.from({ length: totalCells }).map((_, i) => (
                <div
                  key={i}
                  className="matrix-cell rounded transition-all duration-200 cursor-pointer hover:scale-105 hover:z-10"
                  style={{ backgroundColor: "#f3f4f6" }}
                />
              ))}
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute w-full h-full pointer-events-none">
            <div className="absolute top-[20%] left-[-10%] bg-ui-card p-3 shadow-md rounded-md flex items-center gap-3 font-medium animate-[float_6s_ease-in-out_infinite]">
              <FaChartLine className="text-brand-500 text-xl" />
              <span>Productivity up 37%</span>
            </div>

            <div className="absolute top-[50%] right-[-5%] bg-ui-card p-3 shadow-md rounded-md flex items-center gap-3 font-medium animate-[float_6s_ease-in-out_infinite] animate-delay-[2s]">
              <FaLightbulb className="text-brand-500 text-xl" />
              <span>Discover your patterns</span>
            </div>

            <div className="absolute bottom-[15%] left-[10%] bg-ui-card p-3 shadow-md rounded-md flex items-center gap-3 font-medium animate-[float_6s_ease-in-out_infinite] animate-delay-[4s]">
              <FaPalette className="text-brand-500 text-xl" />
              <span>Customize your categories</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
