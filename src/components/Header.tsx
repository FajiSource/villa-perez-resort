import { Link, NavLink } from "react-router-dom";
import Logo from "../assets/beach-logo.png";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";

function Header() {
    const [isFixed, setIsFixed] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 200) {
                console.log(window.scrollY)
                setIsFixed(true);
            } else {
                setIsFixed(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };
    return (
        <header
            className={`w-full flex flex-row items-center justify-evenly z-50 h-auto py-2 transition-all duration-300 ease-in-out ${isFixed
                ? "fixed top-0 left-0 bg-white shadow-md backdrop-blur-md"
                : "absolute top-0 bg-transparent"
                }`}
        >
            <Link to={"/"}>
                <img src={Logo} alt="logo" className="w-24" />
            </Link>

            <nav className={`flex items-center gap-5 justify-center flex-row ${isFixed ? 'text-black' : 'text-white'}`}>
                <button onClick={() => scrollToSection("hero")} className="hover:text-rose ease-in-out cursor-pointer">
                    Home
                </button>
                <button onClick={() => scrollToSection("about")} className="hover:text-rose ease-in-out cursor-pointer">
                    About
                </button>
                <button onClick={() => scrollToSection("explore")} className="hover:text-rose ease-in-out cursor-pointer">
                    Explore
                </button>
                <button onClick={() => scrollToSection("services")} className="hover:text-rose ease-in-out cursor-pointer">
                    Services
                </button>
                <button onClick={() => scrollToSection("contact")} className="hover:text-rose ease-in-out cursor-pointer">
                    Contact
                </button>
            </nav>

            <div>
                <Button variant="contained" className="bg-rose-500">
                    Login Now
                </Button>
            </div>
        </header>
    );
}

export default Header;
