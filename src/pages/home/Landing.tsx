import About from "../../components/About";
import Header from "../../components/Header";
import BookCards from "../../components/BookCards";
import Services from "../../components/Services";
import Explore from "../../components/Explore";
import Footer from "../../components/Footer";

export default function Landing() {
  return (
    <main className="flex-1 w-screen overflow-x-hidden scroll-smooth ease-in ">
      <Header  />
      {/* <Hero /> */}
      <About />
      <BookCards />
      <Services />
      <Explore/>
      <Footer/>
    </main>
  );
}
