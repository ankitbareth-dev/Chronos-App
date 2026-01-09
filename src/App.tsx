import Navbar from "./components/Navbar";
import Hero from "./features/landingPage/Hero";
import Features from "./features/landingPage/Features";
import HowItWorks from "./features/landingPage/HowItWorks";
import Testimonials from "./features/landingPage/Testimonials";

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
    </>
  );
}

export default App;
