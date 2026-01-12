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
          <Features />
        </LazyOnView>

        <LazyOnView>
          <HowItWorks />
        </LazyOnView>

        <LazyOnView>
          <Testimonials />
        </LazyOnView>

        <LazyOnView rootMargin="0px">
          <Footer />
        </LazyOnView>
      </Suspense>
    </>
  );
};
export default LandingPage;
