import serviceImage from '../assets/beach-bg.jpg'
import { RiShieldStarLine } from "react-icons/ri";
import { MdCleanHands } from "react-icons/md";
import { FaCarRear, FaRegMap } from "react-icons/fa6";

function Services() {
    return (
        <section className='w-full h-screen'>
            <div className='w-full h-2/4.5 bg-center bg-cover relative flex justify-end px-40'
                style={{ backgroundImage: `url(${serviceImage})` }}>
                <div className='bg-white w-3/8 text-black h-full px-10 py-5 relative'>
                    <div className="text-left mb-10 max-w-xs">
                        <span className="text-sm flex flex-row items-center gap-3 font-medium">SERVICES<span className="border-b-2  border-rose w-[50px]"></span></span>
                        <span className="text-3xl font-bold ">Strive Only For The Best.</span>
                    </div>

                    <div className='flex gap-4 flex-col'>
                        <div className='flex flex-row items-center gap-5 text-sm '>
                            <span className='text-2xl p-2 text-center items-center text-blue-500 bg-blue-300 rounded-full'> <RiShieldStarLine /></span>
                            <span className='font-medium'> High Class Security</span>
                        </div>
                        <div className='flex flex-row items-center gap-5 text-sm '>
                            <span className='text-2xl p-2 text-center items-center text-pink-500 bg-pink-300 rounded-full'> <MdCleanHands /> </span>
                            <span className='font-medium'> Cleanliness</span>
                        </div>
                        <div className='flex flex-row items-center gap-5 text-sm '>
                            <span className='text-2xl p-2 text-center items-center text-violet-500 bg-violet-300 rounded-full'> <FaCarRear className=' ' /></span>
                            <span className='font-medium'> Spacious Parking</span>
                        </div>
                        <div className='flex flex-row items-center gap-5 text-sm '>
                            <span className='text-2xl p-2 text-center items-center text-red-500 bg-red-300 rounded-full'> <FaRegMap className=' ' /></span>
                            <span className='font-medium'> Easy to Find</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full h-1/2 flex items-center justify-center' >
                <div className='flex flex-row justify-evenly items-center p-10 shadow-2xl w-2/3 rounded-2xl'>
                    <div className='text-center text-black'>
                        <span className='block text-2xl font-medium'>1</span>
                        <span className='text-black/50'>Properties Available</span>
                    </div>

                    <div className='text-center text-black'>
                        <span className='block text-2xl font-medium'>100+</span>
                        <span className='text-black/50'>Reservation Completed</span>
                    </div>
                    <div className='text-center text-black'>
                        <span className='block text-2xl font-medium'>1</span>
                        <span className='text-black/50'>Happy Customers</span>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Services