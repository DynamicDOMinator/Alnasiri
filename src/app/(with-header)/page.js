import HeroSection from "../components/Home/HeroSection";
import SecondSection from "../components/Home/SecondSection";
import ThirdSection from "../components/Home/ThiedSection";
import ForthSection from "../components/Home/ForthSection";
import FifthSection from "../components/Home/FifthSection";
export const metadata = {
  title: "Alnasiri",
  description: "Generated by create next app",
};
export default function Home() {
  return (
    <>
      <HeroSection />
      <SecondSection />
      <ThirdSection />
      <ForthSection />
      <FifthSection />
    </>
  );
}
