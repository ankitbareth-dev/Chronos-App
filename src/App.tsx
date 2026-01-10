import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import Navbar from "./components/Navbar";
import Hero from "./features/landingPage/Hero";
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
        <Features />
        <HowItWorks />
        <Testimonials />
        <Footer />
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
