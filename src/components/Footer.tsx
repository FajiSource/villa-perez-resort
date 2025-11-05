// import { Button } from '@mui/material'
// import beachLogo from '../assets/beach-logo.png'
// import { FaFacebookSquare } from "react-icons/fa";
// import { FaInstagramSquare } from "react-icons/fa";
// import { FaYoutube } from "react-icons/fa";
import Logo from "../assets/logo.png";

export default function Footer() {
    return (
        // <footer className='w-full flex items-center justify-center bg-black/90 p-10 gap-5'>
        //     <div className='w-52 flex flex-col gap-5 h-64'>
        //         <img src={beachLogo} alt="" className='w-14 ' />
        //         <p className='text-xs text-white/50'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae incidunt reprehenderit, autem sunt in eos quasi tempore consequuntur! Ex a at inventore veritatis corrupti, cumque et facilis alias repellendus dolor.</p>
        //         <Button variant="contained" className="rounded-sm! text-xs! w-fit">Book Now</Button>

        //     </div>
        //     <div className='w-52 flex flex-col gap-5 h-64'>
        //         <span className='text-white font-medium'>QUICK LINKS</span>
        //         <div className='flex flex-col gap-2'>
        //             <p className='text-xs text-white/50'>epellendus dolor.</p>
        //             <p className='text-xs text-white/50'>epellendus dolor.</p>
        //             <p className='text-xs text-white/50'>epellendus dolor.</p>
        //             <p className='text-xs text-white/50'>epellendussssss dolor.</p>
        //         </div>

        //     </div>
        //     <div className='w-52 flex flex-col gap-5 h-64'>
        //         <span className='text-white font-medium'>OUR SERVICES</span>
        //         <div className='flex flex-col gap-2'>
        //             <p className='text-xs text-white/50'>epellendus dolor.</p>
        //             <p className='text-xs text-white/50'>epellendus dolor.</p>
        //             <p className='text-xs text-white/50'>epellendus dolor.</p>
        //             <p className='text-xs text-white/50'>epellendussssss dolor.</p>
        //         </div>
        //     </div>
        //      <div className='w-52 flex flex-col gap-5 h-64' id='contact'>
        //         <span className='text-white font-medium'>CONTACT US</span>
        //         <div className='flex flex-col gap-2'>
        //             <p className='text-xs text-white/50'>epellendus dolor.</p>
        //             <div className='flex flex-row gap-2 items-center'>
        //                <FaFacebookSquare />
        //                 <FaInstagramSquare />
        //                 <FaYoutube />
        //             </div>
        //         </div>
        //     </div>
        // </footer>
        <footer className="footer" id="contact">
            <div className="section__container footer__container">
                <div className="footer__col">
                    <div className="logo">
                        <a href="/"><img src={Logo} alt="logo" /></a>
                    </div>
                    <p className="section__description">
                        Unwind in style with our exclusive collection of resorts,
                        where comfort, luxury, and adventure come together to create the
                        getaway of your dreams..
                    </p>
                    <button className="btn">Book Now</button>
                </div>
                <div className="footer__col">
                    <h4>QUICK LINKS</h4>
                    <ul className="footer__links">
                        <li><a href="#">Browse Destinations</a></li>
                        <li><a href="#">Special Offers</a></li>
                        <li><a href="#">Room Types</a></li>
                        <li><a href="#">Cottage</a></li>
                        <li><a href="#">Customer Reviews & Ratings</a></li>
                    </ul>
                </div>
                <div className="footer__col">
                    <h4>OUR SERVICES</h4>
                    <ul className="footer__links">
                        <li><a href="#">Rooms</a></li>
                        <li><a href="#">Cottage</a></li>
                        <li><a href="#">Party Space</a></li>
                        <li><a href="#">Large Parking Area</a></li>
                    </ul>
                </div>
                <div className="footer__col">
                    <h4>CONTACT US</h4>
                    <ul className="footer__links">
                        <li><a href="#">Cristina Ege</a></li>
                    </ul>
                    <div className="footer__socials">
                        <a href="#"><img src="facebook.png" alt="facebook" /></a>
                        <a href="#"><img src="instagram.png" alt="instagram" /></a>
                        <a href="#"><img src="youtube.png" alt="youtube" /></a>
                        <a href="#"><img src="twitter.png" alt="twitter" /></a>
                    </div>
                </div>
            </div>
            <div className="footer__bar">
                Copyright © 2023 Web Design Mastery. All rights reserved.
            </div>
        </footer>
    )
}
