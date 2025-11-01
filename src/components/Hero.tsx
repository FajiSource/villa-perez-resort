import { FaRegCalendarAlt, FaUser } from 'react-icons/fa';
import backgroundImage from '../assets/beach-bg.jpg';
import { Button } from '@mui/material';

export default function Hero() {
    return (
        <section
            className="hero w-full h-screen bg-center bg-cover flex items-center justify-center "
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <h1 className='text-5xl font-bold text-white text-center max-w-2xl'>Where Every Stay Comes with a <span className='text-rose'>Splash</span></h1>

            <div className='absolute bottom-0 transform  w-1/2 bg-white flex items-center justify-evenly p-5 rounded-md  translate-y-10'>
                <div className='flex items-center gap-2 text-black w-fit h-fit'>
                    <FaRegCalendarAlt  className='text-lg text-rose'/>
                    <div className='flex flex-col'>
                        <span className='font-medium text-sm'>CHECK-IN</span>
                        <span className='text-xs text-black/50'>Check in</span>
                    </div>
                </div>
                <div className='flex items-center gap-2 text-black w-fit h-fit'>
                    <FaRegCalendarAlt  className='text-lg text-rose'/>
                    <div className='flex flex-col'>
                        <span className='font-medium text-sm'>CHECK-OUT</span>
                        <span className='text-xs text-black/50'>Check Out</span>
                    </div>
                </div>
                <div className='flex items-center gap-2 text-black w-fit h-fit'>
                    <FaUser   className='text-lg text-rose'/>
                    <div className='flex flex-col'>
                        <span className='font-medium text-sm'>GUEST</span>
                        <span className='text-xs text-black/50'>Guest</span>
                    </div>
                </div>
                <div className='flex items-center gap-2 text-black w-fit h-fit'>
                    <Button variant='contained'>CHECK OUT</Button>
                </div>
            </div>
        </section>
    );
}
