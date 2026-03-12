import { Suspense } from "react";
import HeroSection from "./components/heroScetion";
import Banner from "./components/banner";
import ValueOfDaySection from "./components/ValueOfDaySection";
import Categories from "./components/Categories";
import DiscountCouponModal from "./components/DiscountCouponModal";

export default function Home() {
  return (
    <div className="min-h-screen">
      <DiscountCouponModal />
      <HeroSection />
      <Suspense fallback={<div className="container mx-auto px-4 py-10 text-center text-gray-500">Loading…</div>}>
        <Categories />
        <ValueOfDaySection />
      </Suspense>
    </div>
  );
}
