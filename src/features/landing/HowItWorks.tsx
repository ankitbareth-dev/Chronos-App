import { useState, useMemo } from "react";
import {
  FaLightbulb,
  FaHandPointer,
  FaStar,
  FaTrophy,
  FaChartLine,
  FaInfoCircle,
} from "react-icons/fa";

// --- Types ---
interface Category {
  name: string;
  color: string;
}

interface CellData {
  id: number;
  color: string;
}

const HowItWorks = () => {
  const [categories, setCategories] = useState<Category[]>([
    { name: "Deep Work", color: "#6366f1" },
    { name: "Exercise", color: "#10b981" },
    { name: "Family Time", color: "#f59e0b" },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#4f46e5");
  const [showAddForm, setShowAddForm] = useState(false);

  // Generate matrix state once (7 cols x 12 rows = 84 cells)
  const [matrixCells, setMatrixCells] = useState<CellData[]>(
    Array.from({ length: 84 }, (_, i) => ({ id: i, color: "#f1f5f9" }))
  );

  const [categoryUsage, setCategoryUsage] = useState<Record<string, number>>({
    "Deep Work": 0,
    Exercise: 0,
    "Family Time": 0,
  });
  const [mostUsedCategory, setMostUsedCategory] = useState<string | null>(null);

  const timeRanges = [
    "6-7 AM",
    "7-8 AM",
    "8-9 AM",
    "9-10 AM",
    "10-11 AM",
    "11-12 PM",
    "12-1 PM",
    "1-2 PM",
    "2-3 PM",
    "3-4 PM",
    "4-5 PM",
    "5-6 PM",
  ];

  // --- Handlers ---

  const handleCellClick = (index: number) => {
    setMatrixCells((prev) => {
      const newCells = [...prev];
      const currentCell = newCells[index];
      let newColor = currentCell.color;

      if (selectedCategory) {
        // Apply Selected Category
        newColor = selectedCategory.color;
        updateCategoryUsage(selectedCategory.name);
      } else {
        // Cycle Logic
        const colors = [
          categories[0].color,
          categories[1].color,
          categories[2].color,
          "#f1f5f9",
        ];

        // Find current color index
        let currentIndex = colors.indexOf(currentCell.color);
        if (currentIndex === -1) currentIndex = 3; // Default to clear if unknown color

        // Move to next color
        currentIndex = (currentIndex + 1) % colors.length;
        newColor = colors[currentIndex];

        if (currentIndex < 3) {
          updateCategoryUsage(categories[currentIndex].name);
        }
      }

      newCells[index] = { ...currentCell, color: newColor };
      return newCells;
    });
  };

  const updateCategoryUsage = (categoryName: string) => {
    setCategoryUsage((prev) => {
      const newUsage = {
        ...prev,
        [categoryName]: (prev[categoryName] || 0) + 1,
      };

      let maxUsage = 0;
      let maxCat: string | null = null;
      for (const [cat, count] of Object.entries(newUsage)) {
        if (count > maxUsage) {
          maxUsage = count;
          maxCat = cat;
        }
      }
      setMostUsedCategory(maxCat);
      return newUsage;
    });
  };

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim() !== "") {
      const newCat = { name: newCategoryName, color: newCategoryColor };
      setCategories([...categories, newCat]);
      setNewCategoryName("");
      setNewCategoryColor("#4f46e5");
      setShowAddForm(false);
      setCategoryUsage((prev) => ({ ...prev, [newCategoryName]: 0 }));
    }
  };

  // Calculate stats for UI to avoid repetitive calculations in render
  const userInteractions = useMemo(() => {
    return matrixCells.filter((c) => c.color !== "#f1f5f9").length;
  }, [matrixCells]);

  return (
    <section className="py-[50px]  bg-ui-bg" id="how-it-works">
      <div className="max-w-[1200px] mx-auto px-5">
        {/* Header */}
        <div className="text-center mb-[60px]">
          <h2 className="text-[2.5rem] md:text-[3.5rem] font-bold mb-4 text-ui-text">
            How{" "}
            <span className="bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
              Chronos
            </span>{" "}
            Works
          </h2>
          <p className="text-lg text-ui-muted max-w-[600px] mx-auto leading-relaxed">
            Three simple steps to transform how you understand and use your
            time.
          </p>
        </div>

        <div className="flex flex-col gap-[60px] md:gap-[80px]">
          {/* --- Step 1 --- */}
          <div className="flex flex-col md:flex-row gap-[30px]">
            <div className="w-full md:w-auto flex-shrink-0">
              <div className="w-[60px] h-[60px] bg-brand-500 text-white rounded-full flex items-center justify-center text-3xl font-bold">
                1
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-[1.5rem] md:text-[2rem] font-semibold mb-4 text-ui-text">
                Create Your Categories
              </h3>
              <p className="text-ui-muted leading-relaxed mb-6">
                Define what matters to you with custom color-coded categories
                like "Deep Work," "Exercise," or "Family Time." Categorizing
                your activities helps you visualize how you spend your time and
                identify patterns.
              </p>

              <div className="rounded-lg shadow-sm bg-white overflow-hidden">
                <div className="p-5 flex flex-col gap-4">
                  {categories.map((category, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                        selectedCategory === category
                          ? "bg-brand-50 border-l-4 border-brand-500"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleCategoryClick(category)}
                    >
                      <div
                        className="w-5 h-5 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="font-medium text-ui-text">
                        {category.name}
                      </span>
                    </div>
                  ))}

                  {showAddForm ? (
                    <div className="flex flex-wrap gap-2 p-3 bg-ui-bg border border-ui-border rounded-md">
                      <input
                        type="text"
                        placeholder="Category name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="flex-1 min-w-[150px] px-3 py-2 border border-ui-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                      <input
                        type="color"
                        value={newCategoryColor}
                        onChange={(e) => setNewCategoryColor(e.target.value)}
                        className="w-[40px] h-[36px] border border-ui-border rounded cursor-pointer"
                      />
                      <button
                        className="bg-brand-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-brand-600 transition-colors"
                        onClick={handleAddCategory}
                      >
                        Add
                      </button>
                      <button
                        className="bg-gray-200 text-gray-600 px-4 py-2 rounded text-sm font-medium hover:bg-gray-300 transition-colors"
                        onClick={() => setShowAddForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div
                      className="flex items-center gap-3 p-2 border border-dashed border-ui-border rounded-md cursor-pointer hover:bg-brand-50 transition-colors"
                      onClick={() => setShowAddForm(true)}
                    >
                      <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-xs text-white">
                        +
                      </div>
                      <span className="text-sm text-ui-muted">
                        Add Category
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-gray-100 px-5 py-3 flex items-center gap-3 border-t border-ui-border">
                  <FaLightbulb className="text-brand-500 text-lg" />
                  <p className="text-sm text-gray-600 m-0">
                    Click on a category to select it, then use it to fill in
                    your time matrix in step 2.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* --- Step 2 --- */}
          <div className="flex flex-col md:flex-row gap-[30px]">
            <div className="w-full md:w-auto flex-shrink-0">
              <div className="w-[60px] h-[60px] bg-brand-500 text-white rounded-full flex items-center justify-center text-3xl font-bold">
                2
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-[1.5rem] md:text-[2rem] font-semibold mb-4 text-ui-text">
                Track Your Time
              </h3>
              <p className="text-ui-muted leading-relaxed mb-6">
                Click on the matrix to log how you spent each hour of your day.
                It's quick, visual, and satisfying. The matrix represents your
                week, with days as columns and hours as rows. Try clicking on
                the cells below to see how it works!
              </p>

              <div className="rounded-lg shadow-sm bg-white overflow-hidden">
                <div className="w-full overflow-x-auto p-1">
                  <div className="flex min-w-[300px] p-4">
                    {/* Time Labels */}
                    <div className="flex flex-col justify-between pr-4 mr-2 border-r border-ui-border relative top-6 pb-4">
                      {timeRanges.map((time, index) => (
                        <div
                          key={index}
                          className="text-[10px] md:text-xs text-ui-muted font-medium text-right pr-1"
                        >
                          {time}
                        </div>
                      ))}
                    </div>

                    {/* Matrix */}
                    <div className="flex-1 flex flex-col">
                      <div className="grid grid-cols-7 gap-[2px] mb-1 text-center">
                        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                          <span
                            key={day}
                            className="text-[10px] md:text-xs text-ui-muted font-bold"
                          >
                            Day {day}
                          </span>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 grid-rows-12 gap-[2px] w-full h-[240px] md:h-[360px] bg-white">
                        {matrixCells.map((cell, index) => (
                          <div
                            key={cell.id}
                            onClick={() => handleCellClick(index)}
                            className="matrix-cell rounded transition-all duration-200 cursor-pointer bg-gray-50 hover:scale-105 hover:shadow-sm hover:z-10 min-h-0 min-w-0"
                            style={{ backgroundColor: cell.color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 px-5 py-3 flex items-center gap-3 border-t border-ui-border">
                  <FaHandPointer className="text-brand-500 text-lg" />
                  <p className="text-sm text-gray-600 m-0">
                    {selectedCategory
                      ? `Click on any cell to fill it with the selected "${selectedCategory.name}" category.`
                      : "Select a category above, then click on cells to fill them. Or click directly to cycle through colors."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* --- Step 3 --- */}
          <div className="flex flex-col md:flex-row gap-[30px]">
            <div className="w-full md:w-auto flex-shrink-0">
              <div className="w-[60px] h-[60px] bg-brand-500 text-white rounded-full flex items-center justify-center text-3xl font-bold">
                3
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-[1.5rem] md:text-[2rem] font-semibold mb-4 text-ui-text">
                Gain Insights
              </h3>
              <p className="text-ui-muted leading-relaxed mb-6">
                Review your patterns, identify opportunities for improvement,
                and celebrate your progress. Chronos automatically analyzes your
                time data to provide meaningful insights about your habits and
                productivity.
              </p>

              <div className="rounded-lg shadow-sm bg-white overflow-hidden p-5">
                {userInteractions > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Insight Card 1 */}
                    <div className="bg-ui-bg border border-ui-border p-4 rounded-lg hover:-translate-y-1 transition-transform">
                      <div className="flex items-center gap-3 mb-3">
                        <FaStar className="text-brand-500" />
                        <h4 className="font-bold text-ui-text text-sm">
                          Activity Summary
                        </h4>
                      </div>
                      <div className="text-xl font-bold text-gray-700 mb-1">
                        {userInteractions} cells filled
                      </div>
                      <p className="text-xs text-ui-muted">
                        You've tracked {userInteractions} time blocks in your
                        demo matrix.{" "}
                        {userInteractions > 10
                          ? "Great progress!"
                          : "Keep going!"}
                      </p>
                    </div>

                    {/* Insight Card 2 */}
                    <div className="bg-ui-bg border border-ui-border p-4 rounded-lg hover:-translate-y-1 transition-transform">
                      <div className="flex items-center gap-3 mb-3">
                        <FaTrophy className="text-brand-500" />
                        <h4 className="font-bold text-ui-text text-sm">
                          Most Used Category
                        </h4>
                      </div>
                      <div className="text-xl font-bold text-gray-700 mb-1">
                        {mostUsedCategory || "None yet"}
                      </div>
                      <p className="text-xs text-ui-muted">
                        {mostUsedCategory
                          ? `You've spent most of your time on ${mostUsedCategory} activities.`
                          : "Start filling in the matrix to see your most used category."}
                      </p>
                    </div>

                    {/* Insight Card 3 - Distribution */}
                    <div className="bg-ui-bg border border-ui-border p-4 rounded-lg hover:-translate-y-1 transition-transform">
                      <div className="flex items-center gap-3 mb-3">
                        <FaChartLine className="text-brand-500" />
                        <h4 className="font-bold text-ui-text text-sm">
                          Time Distribution
                        </h4>
                      </div>
                      <div className="flex flex-col gap-3">
                        {categories.map((category) => {
                          const usage = categoryUsage[category.name] || 0;
                          const percentage =
                            userInteractions > 0
                              ? Math.round((usage / userInteractions) * 100)
                              : 0;
                          return (
                            <div
                              key={category.name}
                              className="flex items-center gap-2"
                            >
                              <span className="text-xs text-ui-muted w-16 truncate">
                                {category.name}
                              </span>
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${percentage}%`,
                                    backgroundColor: category.color,
                                  }}
                                ></div>
                              </div>
                              <span className="text-xs font-bold w-8 text-right">
                                {percentage}%
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-10 bg-ui-bg border border-dashed border-ui-border rounded-lg text-center">
                    <FaInfoCircle className="text-4xl text-brand-500 mb-4" />
                    <h4 className="font-bold text-xl text-gray-700 mb-2">
                      Insights will appear here
                    </h4>
                    <p className="text-sm text-ui-muted max-w-[400px]">
                      Fill in some cells in the matrix above to see your
                      insights.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
