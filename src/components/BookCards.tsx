import { Button } from "@mui/material";
import parking from '../assets/parking.jpg';
import videoke from '../assets/videoke.jpg';
import room from '../assets/room.jpg';

export default function BookCards() {
    return (
        // <section 
        //  id='services'
        // className="w-full h-screen flex items-center justify-center flex-col text-black gap-10">
        //     <div>
        //         <div className="text-left mb-10 max-w-xs">
        //             <span className="text-sm flex flex-row items-center gap-3 font-medium">Villa Perez<span className="border-b-2  border-rose w-[50px]"></span></span>
        //             <span className="text-2xl font-bold ">The Most Memorable Rest Time Starts Here.</span>
        //         </div>

        //         <div className="flex flex-row justify-evenly gap-10">
        //             <div className="w-72 bg-white h-auto relative text-black rounded-lg shadow-2xl">
        //                 <div className="w-full h-1/2 relative rounded-t-lg">
        //                     <img src="/images/cottage-sample.jpg" alt="" className="w-full h-full rounded-t-lg" />
        //                 </div>
        //                 <div className="h-1/2 w-full p-3">
        //                     <span className="font-medium text-sm">Rooms</span>
        //                     <p className="text-xs text-black/50">Lorem ipsum dolor sit apiciatis, libero consequuntur, dolore et nostrum minus, hic quae! Ullam facere quis deleniti repellendus doloremque.</p>
        //                     <span className="text-xs text-black/50 block mb-2 mt-2 ">Starting from <span className="text-black font-medium">2,600 Pesos</span></span>
        //                     <Button variant="contained" className="">Book Now</Button>
        //                 </div>
        //             </div>
        //             <div className="w-72 bg-white h-auto relative text-black rounded-lg shadow-2xl">
        //                 <div className="w-full h-1/2 relative rounded-t-lg">
        //                     <img src="/images/cottage-sample.jpg" alt="" className="w-full h-full rounded-t-lg" />
        //                 </div>
        //                 <div className="h-1/2 w-full p-3">
        //                     <span className="font-medium text-sm">Rooms</span>
        //                     <p className="text-xs text-black/50">Lorem ipsum dolor sit apiciatis, libero consequuntur, dolore et nostrum minus, hic quae! Ullam facere quis deleniti repellendus doloremque.</p>
        //                     <span className="text-xs text-black/50 block mb-2 mt-2 ">Starting from <span className="text-black font-medium">2,600 Pesos</span></span>
        //                     <Button variant="contained" className="">Book Now</Button>
        //                 </div>
        //             </div>
        //             <div className="w-72 bg-white h-auto relative text-black rounded-lg shadow-2xl">
        //                 <div className="w-full h-1/2 relative rounded-t-lg">
        //                     <img src="/images/cottage-sample.jpg" alt="" className="w-full h-full rounded-t-lg" />
        //                 </div>
        //                 <div className="h-1/2 w-full p-3">
        //                     <span className="font-medium text-sm">Rooms</span>
        //                     <p className="text-xs text-black/50">Lorem ipsum dolor sit apiciatis, libero consequuntur, dolore et nostrum minus, hic quae! Ullam facere quis deleniti repellendus doloremque.</p>
        //                     <span className="text-xs text-black/50 block mb-2 mt-2 ">Starting from <span className="text-black font-medium">2,600 Pesos</span></span>
        //                     <Button variant="contained" className="">Book Now</Button>
        //                 </div>
        //             </div>

        //         </div>
        //     </div>
        // </section>
        <section className="section__container room__container">
            <p className="section__subheader">Villa Perez</p>
            <h2 className="section__header">The Most Memorable Rest Time Starts Here.</h2>
            <div className="room__grid">
                <div className="room__card">
                    <div className="room__card__image">
                        <img src={room} alt="room" />
                        <div className="room__card__icons">
                            <span><i className="ri-heart-fill"></i></span>
                            <span><i className="ri-paint-fill"></i></span>
                            <span><i className="ri-shield-star-line"></i></span>
                        </div>
                    </div>
                    <div className="room__card__details">
                        <h4>Rooms</h4>
                        <p>
                            Rooms villa perez offer 2 room both room has 2 bedroom and comfort room
                            and toilet and shower.
                        </p>
                        <h5>Starting from <span>2,600 Pesos</span></h5>
                        <button className="btn">Book Now</button>
                    </div>
                </div>
                <div className="room__card">
                    <div className="room__card__image">
                        <img src={videoke} alt="room" />
                        <div className="room__card__icons">
                            <span><i className="ri-heart-fill"></i></span>
                            <span><i className="ri-paint-fill"></i></span>
                            <span><i className="ri-shield-star-line"></i></span>
                        </div>
                    </div>
                    <div className="room__card__details">
                        <h4>Cottage</h4>
                        <p>
                            Villa Perez have 6 cottage available to rent and videoke
                        </p>
                        <h5>Starting from <span>500 pesos</span></h5>
                        <button className="btn">Book Now</button>
                    </div>
                </div>
                <div className="room__card">
                    <div className="room__card__image">
                        <img src={parking} alt="room" />
                        <div className="room__card__icons">
                            <span><i className="ri-heart-fill"></i></span>
                            <span><i className="ri-paint-fill"></i></span>
                            <span><i className="ri-shield-star-line"></i></span>
                        </div>
                    </div>
                    <div className="room__card__details">
                        <h4>Party Space</h4>
                        <p>
                            Whatever you're celebrating, we've got the perfect space for it.
                            Birthdays, reunions, or just because—every occasion fits here!
                        </p>
                        <h5>Starting from <span>3,000 Pesos</span></h5>
                        <button className="btn">Book Now</button>
                    </div>
                </div>
            </div>
        </section>
    )
}
