import EventList from "@/components/EventList";
import Image from "next/image";
import HeroSection from "@/components/HeroSection"
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="">
      <HeroSection/>
      <EventList/>
      <Footer/>
    </div>
  );
}
