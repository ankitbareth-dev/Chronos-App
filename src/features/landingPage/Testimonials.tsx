import { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface Testimonial {
  content: string;
  author: string;
  role: string;
  image: string;
}

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  const testimonials: Testimonial[] = [
    {
      content:
        "Chronos has completely changed how I view my time. I've identified patterns I never noticed before and increased my productive hours by 30%.",
      author: "Sarah J.",
      role: "Product Manager",
      image: "https://randomuser.me/api/portraits/women/32.jpg",
    },
    {
      content:
        "As a freelancer, tracking where my time goes is crucial. Chronos makes it visual and simple. I can now see exactly how I'm spending my days.",
      author: "Michael T.",
      role: "Freelance Designer",
      image: "https://randomuser.me/api/portraits/men/54.jpg",
    },
    {
      content:
        "I've tried many time tracking apps, but Chronos is the only one I've stuck with. The visual matrix makes it so satisfying to see my progress.",
      author: "Priya K.",
      role: "Software Engineer",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  ];

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  // Setup autoplay
  useEffect(() => {
    const startAutoplay = () => {
      autoplayRef.current = setInterval(() => {
        goToNextSlide();
      }, 5000);
    };

    const stopAutoplay = () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };

    startAutoplay();

    const sliderElement = sliderRef.current;
    if (sliderElement) {
      sliderElement.addEventListener("mouseenter", stopAutoplay);
      sliderElement.addEventListener("mouseleave", startAutoplay);
    }

    return () => {
      stopAutoplay();
      if (sliderElement) {
        sliderElement.removeEventListener("mouseenter", stopAutoplay);
        sliderElement.removeEventListener("mouseleave", startAutoplay);
      }
    };
  }, []);

  return (
    <section className="py-[100px] bg-ui-bg">
      <div className="max-w-[1200px] mx-auto px-5">
        {/* Header */}
        <div className="text-center mb-[60px]">
          <h2 className="text-[2.5rem] font-bold mb-4 text-ui-text">
            What Our Users Say
          </h2>
          <p className="text-lg text-ui-muted max-w-[600px] mx-auto leading-relaxed">
            Join thousands of people who have transformed their relationship
            with time.
          </p>
        </div>

        {/* Slider Wrapper */}
        <div className="max-w-[800px] mx-auto">
          <div className="relative w-full overflow-hidden" ref={sliderRef}>
            <div
              className="flex transition-transform duration-500 ease-in-out w-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div className="flex-none w-full px-5" key={index}>
                  <div className="bg-white rounded-lg shadow-sm p-8 h-full">
                    <div className="mb-5">
                      <p className="text-lg italic text-gray-700 leading-relaxed">
                        &quot;{testimonial.content}&quot;
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.author}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-ui-text mb-1">
                          {testimonial.author}
                        </h4>
                        <p className="text-sm text-ui-muted">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-5 mt-10">
          <button
            className="w-10 h-10 rounded-full bg-white border border-ui-border flex items-center justify-center cursor-pointer transition-all hover:bg-brand-500 hover:text-white hover:border-brand-500"
            onClick={goToPrevSlide}
            aria-label="Previous testimonial"
          >
            <FaArrowLeft className="text-gray-500 hover:text-white transition-colors" />
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <span
                key={index}
                className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${
                  index === currentSlide
                    ? "bg-brand-500 scale-110"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => goToSlide(index)}
              ></span>
            ))}
          </div>

          <button
            className="w-10 h-10 rounded-full bg-white border border-ui-border flex items-center justify-center cursor-pointer transition-all hover:bg-brand-500 hover:text-white hover:border-brand-500"
            onClick={goToNextSlide}
            aria-label="Next testimonial"
          >
            <FaArrowRight className="text-gray-500 hover:text-white transition-colors" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
