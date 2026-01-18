import { lazy, Suspense } from "react";
import Hero from "./Hero";
import LazyOnView from "../../components/LazyOnView";

const Features = lazy(() => import("./Features"));
const HowItWorks = lazy(() => import("./HowItWorks"));
const Testimonials = lazy(() => import("./Testimonials"));
const Footer = lazy(() => import("./Footer"));

const LandingPage = () => {
  return (
    <>
      <Hero />
      <Suspense fallback={null}>
        <LazyOnView>
          <Suspense
            fallback={
              <div className="h-[500px] w-full bg-ui-bg animate-pulse" />
            }
          >
            <Features />
          </Suspense>
        </LazyOnView>

        <LazyOnView>
          <Suspense
            fallback={
              <div className="h-[600px] w-full bg-ui-bg animate-pulse" />
            }
          >
            <HowItWorks />
          </Suspense>
        </LazyOnView>

        <LazyOnView>
          <Suspense
            fallback={
              <div className="h-[700px] w-full bg-ui-bg animate-pulse" />
            }
          >
            <Testimonials />
          </Suspense>
        </LazyOnView>

        <LazyOnView rootMargin="0px">
          <Suspense
            fallback={
              <div className="h-[300px] w-full bg-ui-bg animate-pulse" />
            }
          >
            <Footer />
          </Suspense>
        </LazyOnView>
      </Suspense>
    </>
  );
};
export default LandingPage;
