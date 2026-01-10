import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import Navbar from "./components/Navbar";
import Hero from "./features/landingPage/Hero";
import LazyOnView from "./components/LazyOnView";
const Features = lazy(() => import("./features/landingPage/Features"));
const HowItWorks = lazy(() => import("./features/landingPage/HowItWorks"));
const Testimonials = lazy(() => import("./features/landingPage/Testimonials"));
const Footer = lazy(() => import("./features/landingPage/Footer"));

const AuthPage = lazy(() => import("./features/auth/AuthPage"));

function LandingPage() {
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
}

function App() {
  return (
    <Router>
      <Navbar />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
