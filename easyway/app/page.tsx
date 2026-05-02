import Image from "next/image";
import Navbar from "./components/navbar";
import ServiceCard from "./components/services";
import CTASection from "./components/ctasection";
import Footer from "./components/footer";
import HeroSlider from "./components/hero";
import TruckFlyIn from "./components/TruckFlyIn";
import WhyBookOnline from "./components/WhyBookOnline";
import ReviewsSection from "./components/ReviewsSection"
export default function Home() {
  return (
    <div>
      {/* <Navbar /> */}
      <HeroSlider />
      <ServiceCard />
      <WhyBookOnline />
      <ReviewsSection />
      <TruckFlyIn />
      <CTASection />
      

      {/* <Footer /> */}

    </div>
  );
}
