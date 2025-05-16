import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import PopularItems from "../components/PopularItems";
import HowItWorks from "../components/HowItWorks";

import Footer from "../components/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="overflow-y-auto">
        <Hero />
        <PopularItems />
        <HowItWorks />
      </main>

      <Footer />
    </div>
  );
}
