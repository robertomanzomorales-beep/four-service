import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Services from "@/components/home/Services";
import Experience from "@/components/home/Experience";
import Clients from "@/components/home/Clients";
import Contact from "@/components/home/Contact";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <About />
        <Services />
        <Experience />
        <Clients />
        <Contact />
      </main>

      <Footer />
    </>
  );
}