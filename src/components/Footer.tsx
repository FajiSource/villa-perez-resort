import { Button } from '@mui/material'
import beachLogo from '../assets/beach-logo.png'
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
export default function Footer() {
    return (
        <footer className='w-full flex items-center justify-center bg-black/90 p-10 gap-5'>
            <div className='w-52 flex flex-col gap-5 h-64'>
                <img src={beachLogo} alt="" className='w-14 ' />
                <p className='text-xs text-white/50'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae incidunt reprehenderit, autem sunt in eos quasi tempore consequuntur! Ex a at inventore veritatis corrupti, cumque et facilis alias repellendus dolor.</p>
                <Button variant="contained" className="rounded-sm! text-xs! w-fit">Book Now</Button>

            </div>
            <div className='w-52 flex flex-col gap-5 h-64'>
                <span className='text-white font-medium'>QUICK LINKS</span>
                <div className='flex flex-col gap-2'>
                    <p className='text-xs text-white/50'>epellendus dolor.</p>
                    <p className='text-xs text-white/50'>epellendus dolor.</p>
                    <p className='text-xs text-white/50'>epellendus dolor.</p>
                    <p className='text-xs text-white/50'>epellendussssss dolor.</p>
                </div>

            </div>
            <div className='w-52 flex flex-col gap-5 h-64'>
                <span className='text-white font-medium'>OUR SERVICES</span>
                <div className='flex flex-col gap-2'>
                    <p className='text-xs text-white/50'>epellendus dolor.</p>
                    <p className='text-xs text-white/50'>epellendus dolor.</p>
                    <p className='text-xs text-white/50'>epellendus dolor.</p>
                    <p className='text-xs text-white/50'>epellendussssss dolor.</p>
                </div>
            </div>
             <div className='w-52 flex flex-col gap-5 h-64' id='contact'>
                <span className='text-white font-medium'>CONTACT US</span>
                <div className='flex flex-col gap-2'>
                    <p className='text-xs text-white/50'>epellendus dolor.</p>
                    <div className='flex flex-row gap-2 items-center'>
                       <FaFacebookSquare />
                        <FaInstagramSquare />
                        <FaYoutube />
                    </div>
                </div>
            </div>
        </footer>
    )
}
