import HeroSection from "./components/heroScetion";
import Banner from "./components/banner";
import ValueOfDaySection from "./components/ValueOfDaySection";
import ProductSale from "./components/productsale";
import Categories from "./components/Categories";
import DiscountCouponModal from "./components/DiscountCouponModal";

export default function Home() {
  return (
    <div className="min-h-screen">
      <DiscountCouponModal />
      <HeroSection />
      <Categories />
      <ValueOfDaySection />
  
    </div>
  );
}
