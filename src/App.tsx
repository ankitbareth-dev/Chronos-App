import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./features/landingPage/Hero";
import Features from "./features/landingPage/Features";
import HowItWorks from "./features/landingPage/HowItWorks";
import Testimonials from "./features/landingPage/Testimonials";
import Footer from "./features/landingPage/Footer";

import AuthPage from "./features/auth/Auth";

function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
