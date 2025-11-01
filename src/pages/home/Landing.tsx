import About from "../../components/About";
import Header from "../../components/Header";
import Hero from "../../components/Hero";
import Services from "../../components/Services";

export default function Landing() {
  return (
    <main className="flex-1  w-screen h-screen overflow-x-hidden relative">
        <Header/>
        <Hero/>
        <About/>
        <Services/>
    </main>
  )
}
