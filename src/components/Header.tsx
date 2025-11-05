// import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";
// import { Button } from "@mui/material";
// import { useEffect, useState } from "react";

function Header() {
    // const [isFixed, setIsFixed] = useState(false);

    // useEffect(() => {
    //     const handleScroll = () => {
    //         if (window.scrollY > 200) {
    //             console.log(window.scrollY)
    //             setIsFixed(true);
    //         } else {
    //             setIsFixed(false);
    //         }
    //     };

    //     window.addEventListener("scroll", handleScroll);
    //     return () => window.removeEventListener("scroll", handleScroll);
    // }, []);

    // const scrollToSection = (id: string) => {
    //     const section = document.getElementById(id);
    //     if (section) {
    //         section.scrollIntoView({ behavior: "smooth" });
    //     }
    // };
    return (
        // <header
        //     className={` w-full flex flex-row items-center justify-evenly z-50 h-auto py-2 transition-all duration-300 ease-in-out ${isFixed
        //         ? "fixed top-0 left-0 bg-white shadow-md backdrop-blur-md"
        //         : "absolute top-0 bg-transparent"
        //         }`}
        // >
        //     <Link to={"/"}>
        //         <img src={Logo} alt="logo" className="w-15" />
        //     </Link>

        //     <nav className={`flex items-center gap-5 justify-center flex-row ${isFixed ? 'text-black' : 'text-white'}`}>
        //         <button onClick={() => scrollToSection("hero")} className="hover:text-rose ease-in-out cursor-pointer">
        //             Home
        //         </button>
        //         <button onClick={() => scrollToSection("about")} className="hover:text-rose ease-in-out cursor-pointer">
        //             About
        //         </button>
        //         <button onClick={() => scrollToSection("explore")} className="hover:text-rose ease-in-out cursor-pointer">
        //             Explore
        //         </button>
        //         <button onClick={() => scrollToSection("services")} className="hover:text-rose ease-in-out cursor-pointer">
        //             Services
        //         </button>
        //         <button onClick={() => scrollToSection("contact")} className="hover:text-rose ease-in-out cursor-pointer">
        //             Contact
        //         </button>
        //     </nav>

        //     <div>
        //         <Button variant="contained" className="bg-rose-500">
        //             Login Now
        //         </Button>
        //     </div>
        // </header>
        <>
            <header className="header">
                <nav>
                    <div className="nav__bar">
                        <div className="logo">
                            <a href="/"><img src={Logo} alt="logo" /></a>
                        </div>
                        <div className="nav__menu__btn" id="menu-btn">
                            <i className="ri-menu-line"></i>
                        </div>
                    </div>
                    <ul className="nav__links" id="nav-links">
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#service">Services</a></li>
                        <li><a href="#explore">Explore</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                    <a href="/auth"><button className="btn nav__btn">Login Now</button></a>
                </nav>
                <div className="section__container header__container" id="home">
                    <p>Simple - Unique - Friendly</p>
                    <h1>Where Every Stay Comes<br /> with a <span>Splash</span>.</h1>
                </div>
            </header>
            <section className="section__container booking__container">
                <form action="/" className="booking__form">
                    <div className="input__group">
                        <span><i className="ri-calendar-2-fill"></i></span>
                        <div>
                            <label >CHECK-IN</label>
                            <input type="text" placeholder="Check In" />
                        </div>
                    </div>
                    <div className="input__group">
                        <span><i className="ri-calendar-2-fill"></i></span>
                        <div>
                            <label >CHECK-OUT</label>
                            <input type="text" placeholder="Check Out" />
                        </div>
                    </div>
                    <div className="input__group">
                        <span><i className="ri-user-fill"></i></span>
                        <div>
                            <label >GUEST</label>
                            <input type="text" placeholder="Guest" />
                        </div>
                    </div>
                    <div className="input__group input__btn">
                        <button className="btn">CHECK OUT</button>
                    </div>
                </form>
            </section>
        </>
    );
}

export default Header;
