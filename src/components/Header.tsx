import { Link, NavLink } from 'react-router-dom'
import Logo from '../assets/beach-logo.png'
import { Button } from '@mui/material'
function Header() {
    return (
        <header className="w-full flex flex-row items-center justify-evenly h-auto bg-transparent absolute top-0 py-2">
            <Link to={"/"}> <img src={Logo} alt="logo" className='w-24' /></Link>
            <nav className='flex items-center gap-5 justify-center flex-row'>
                <NavLink to={"/"}>
                    Home
                </NavLink>
                <NavLink to={"/"}>
                    About
                </NavLink>
                <NavLink to={"/"}>
                    Services
                </NavLink>
                <NavLink to={"/"}>
                    Explore
                </NavLink>
                <NavLink to={"/"}>
                    Contract
                </NavLink>
            </nav>
            <div>
                <Button variant="contained" className='bg-rose rounded!'>
                    Login Now
                </Button>
            </div>
        </header>
    )
}

Header.propTypes = {}

export default Header
