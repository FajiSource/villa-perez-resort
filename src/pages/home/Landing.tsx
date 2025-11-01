import About from "../../components/About";
import Header from "../../components/Header";
import Hero from "../../components/Hero";
import BookCards from "../../components/BookCards";
import Services from "../../components/Services";
import Explore from "../../components/Explore";

export default function Landing() {
  return (
    <main className="flex-1 w-screen overflow-x-hidden scroll-smooth ease-in ">
      <Header  />
      <Hero />
      <About />
      <BookCards />
      <Services />
      <Explore/>
      <div className="h-[200vh] bg-gray-100"></div>
    </main>
  );
}
