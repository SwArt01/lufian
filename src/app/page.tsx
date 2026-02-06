import { HeroSection } from "@/components/sections/HeroSection";
import { LatestDrops } from "@/components/sections/LatestDrops";
import { Newsletter } from "@/components/sections/Newsletter";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <LatestDrops />
      <Newsletter />
    </div>
  );
}
