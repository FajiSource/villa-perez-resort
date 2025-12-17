import Logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

function Header() {
    const { isAuthenticated } = useAuth();
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const headerContainer = document.querySelector('.header__container');
            if (headerContainer) {
                const containerRect = headerContainer.getBoundingClientRect();
                setIsSticky(containerRect.top < -50);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
   
    return (
        
        <>
            <header className="header">
                <nav className={isSticky ? 'nav--sticky' : ''}>
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
                    {isAuthenticated ? (
                        <Link to="/dashboard">
                            <button className="btn nav__btn">Dashboard</button>
                        </Link>
                    ) : (
                        <Link to="/auth">
                            <button className="btn nav__btn">Login Now</button>
                        </Link>
                    )}
                </nav>
                <div className="section__container header__container" id="home">
                    <p>Simple - Unique - Friendly</p>
                    <h1>Where Every Stay Comes<br /> with a <span>Splash</span>.</h1>
                </div>
            </header>
            {/* <section className="section__container booking__container">
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
            </section> */}
        </>
    );
}

export default Header;
