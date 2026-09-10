import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/hero/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Work } from "@/components/sections/Work";
import { Timeline } from "@/components/sections/Timeline";
import { Portraits } from "@/components/sections/Portraits";
import { Skills } from "@/components/sections/Skills";
import { CharacterSheet } from "@/components/sections/CharacterSheet";
import { Gallery } from "@/components/sections/Gallery";
import { Cycling } from "@/components/sections/Cycling";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Work />
        <Timeline />
        <Portraits />
        <Skills />
        <CharacterSheet />
        <Gallery />
        <Cycling />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
