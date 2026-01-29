import HeroSection from "./components/heroScetion";
import Banner from "./components/banner";
import ValueOfDaySection from "./components/ValueOfDaySection";
import ProductSale from "./components/productsale";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ValueOfDaySection />
      {/* <Banner /> */}
    </div>
  );
}
