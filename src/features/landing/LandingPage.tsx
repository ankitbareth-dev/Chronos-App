import { lazy, Suspense } from "react";
import Hero from "./Hero";
import LazyOnView from "../../components/LazyOnView";
import SectionPlaceholder from "../../components/SectionPlaceholder";

const Features = lazy(() => import("./Features"));
const HowItWorks = lazy(() => import("./HowItWorks"));
const Testimonials = lazy(() => import("./Testimonials"));
import Footer from "./Footer";

const LandingPage = () => {
  return (
    <>
      <Hero />

      <Suspense fallback={null}>
        <LazyOnView>
          <Suspense fallback={<SectionPlaceholder height="500px" />}>
            <Features />
          </Suspense>
        </LazyOnView>

        <LazyOnView>
          <Suspense fallback={<SectionPlaceholder height="600px" />}>
            <HowItWorks />
          </Suspense>
        </LazyOnView>

        <LazyOnView>
          <Suspense fallback={<SectionPlaceholder height="700px" />}>
            <Testimonials />
          </Suspense>
        </LazyOnView>

        <Footer />
      </Suspense>
    </>
  );
};

export default LandingPage;
