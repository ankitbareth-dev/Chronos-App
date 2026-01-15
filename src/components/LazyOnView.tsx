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
      { rootMargin }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [rootMargin]);

  return <div ref={ref}>{visible ? children : null}</div>;
};

export default LazyOnView;
