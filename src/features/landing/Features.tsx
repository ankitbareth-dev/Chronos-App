import {
  FaTh,
  FaPalette,
  FaChartPie,
  FaBell,
  FaCloud,
  FaLock,
} from "react-icons/fa";

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
}

const Features = () => {
  const features: Feature[] = [
    {
      icon: FaTh,
      title: "Visual Matrix",
      description:
        "See your time usage patterns at a glance with our intuitive day/hour matrix visualization.",
    },
    {
      icon: FaPalette,
      title: "Custom Categories",
      description:
        "Create your own color-coded categories to track exactly what matters to you.",
    },
    {
      icon: FaChartPie,
      title: "Insightful Analytics",
      description:
        "Discover patterns and trends with powerful analytics that help you optimize your time.",
    },
    {
      icon: FaBell,
      title: "Smart Reminders",
      description:
        "Set goals and receive gentle nudges to help you stay on track with your time intentions.",
    },
    {
      icon: FaCloud,
      title: "Cloud Sync",
      description:
        "Access your time data from any device with secure cloud synchronization.",
    },
    {
      icon: FaLock,
      title: "Private & Secure",
      description:
        "Your time data is encrypted and never shared with third parties.",
    },
  ];

  return (
    <section className="py-[50px] from-ui-bg to-brand-50" id="features">
      <div className="max-w-[1200px] mx-auto px-5">
        {/* Section Header */}
        <div className="text-center mb-[60px]">
          <h2 className="text-[2.5rem] md:text-[3.5rem] font-bold mb-4 text-ui-text">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent">
              Chronos
            </span>
            ?
          </h2>
          <p className="text-lg md:text-[1.125rem] text-ui-muted max-w-[600px] mx-auto leading-relaxed">
            Our unique approach to time tracking helps you gain insights and
            take control of your time.
          </p>
        </div>

        {/* Features Grid - Responsive: 1 col on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-[30px] shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="w-[60px] h-[60px] bg-brand-500/80 rounded-full flex items-center justify-center mb-5 text-white">
                  <IconComponent className="text-[1.5rem]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-ui-text">
                  {feature.title}
                </h3>
                <p className="text-ui-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
