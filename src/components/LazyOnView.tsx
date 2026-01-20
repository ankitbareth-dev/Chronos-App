import { useEffect, useRef, useState } from "react";

interface LazyOnViewProps {
  children: React.ReactNode;
  rootMargin?: string;
}

const LazyOnView = ({ children, rootMargin = "200px" }: LazyOnViewProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className="w-full overflow-hidden">
      <div
        className={`transition-all duration-700 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {visible ? children : null}
      </div>
    </div>
  );
};

export default LazyOnView;
