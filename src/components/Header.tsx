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
    return (
        <header
            className={`w-full flex flex-row items-center justify-evenly z-50 h-auto py-2 transition-all duration-300 ${isFixed
                ? "fixed top-0 left-0 bg-white shadow-md backdrop-blur-md"
                : "absolute top-0 bg-transparent"
                }`}
        >
            <Link to={"/"}>
                <img src={Logo} alt="logo" className="w-24" />
            </Link>

            <nav className="flex items-center gap-5 justify-center flex-row text-black">
                <NavLink to={"/"}>Home</NavLink>
                <NavLink to={"/about"}>About</NavLink>
                <NavLink to={"/services"}>Services</NavLink>
                <NavLink to={"/explore"}>Explore</NavLink>
                <NavLink to={"/contact"}>Contact</NavLink>
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
