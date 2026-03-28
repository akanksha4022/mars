import Hero from "./components/Hero";
import Launch from "./components/Launch";
import MarsIntro from "./components/MarsIntro";
import Arrival from "./components/Arrival";
import SpaceSection from "./components/Spacesection";
import LaunchToSpace from "./components/LaunchToSpace";

export default function Home() {
  return (
    <div className="bg-black text-white overflow-x-hidden">
      <Hero />
      {/* <Launch /> */}
      {/* <MarsIntro /> */}
      {/* <SpaceSection /> */}
      <LaunchToSpace />
      <Arrival />
    </div>
  );
}