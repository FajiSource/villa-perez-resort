import { Button } from "@mui/material";
export default function BookCards() {
    return (
        <section 
         id='services'
        className="w-full h-screen flex items-center justify-center flex-col text-black gap-10">
            <div>
                <div className="text-left mb-10 max-w-xs">
                    <span className="text-sm flex flex-row items-center gap-3 font-medium">Villa Perez<span className="border-b-2  border-rose w-[50px]"></span></span>
                    <span className="text-2xl font-bold ">The Most Memorable Rest Time Starts Here.</span>
                </div>

                <div className="flex flex-row justify-evenly gap-10">
                    <div className="w-72 bg-white h-auto relative text-black rounded-lg shadow-2xl">
                        <div className="w-full h-1/2 relative rounded-t-lg">
                            <img src="/images/cottage-sample.jpg" alt="" className="w-full h-full rounded-t-lg" />
                        </div>
                        <div className="h-1/2 w-full p-3">
                            <span className="font-medium text-sm">Rooms</span>
                            <p className="text-xs text-black/50">Lorem ipsum dolor sit apiciatis, libero consequuntur, dolore et nostrum minus, hic quae! Ullam facere quis deleniti repellendus doloremque.</p>
                            <span className="text-xs text-black/50 block mb-2 mt-2 ">Starting from <span className="text-black font-medium">2,600 Pesos</span></span>
                            <Button variant="contained" className="">Book Now</Button>
                        </div>
                    </div>
                    <div className="w-72 bg-white h-auto relative text-black rounded-lg shadow-2xl">
                        <div className="w-full h-1/2 relative rounded-t-lg">
                            <img src="/images/cottage-sample.jpg" alt="" className="w-full h-full rounded-t-lg" />
                        </div>
                        <div className="h-1/2 w-full p-3">
                            <span className="font-medium text-sm">Rooms</span>
                            <p className="text-xs text-black/50">Lorem ipsum dolor sit apiciatis, libero consequuntur, dolore et nostrum minus, hic quae! Ullam facere quis deleniti repellendus doloremque.</p>
                            <span className="text-xs text-black/50 block mb-2 mt-2 ">Starting from <span className="text-black font-medium">2,600 Pesos</span></span>
                            <Button variant="contained" className="">Book Now</Button>
                        </div>
                    </div>
                    <div className="w-72 bg-white h-auto relative text-black rounded-lg shadow-2xl">
                        <div className="w-full h-1/2 relative rounded-t-lg">
                            <img src="/images/cottage-sample.jpg" alt="" className="w-full h-full rounded-t-lg" />
                        </div>
                        <div className="h-1/2 w-full p-3">
                            <span className="font-medium text-sm">Rooms</span>
                            <p className="text-xs text-black/50">Lorem ipsum dolor sit apiciatis, libero consequuntur, dolore et nostrum minus, hic quae! Ullam facere quis deleniti repellendus doloremque.</p>
                            <span className="text-xs text-black/50 block mb-2 mt-2 ">Starting from <span className="text-black font-medium">2,600 Pesos</span></span>
                            <Button variant="contained" className="">Book Now</Button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
