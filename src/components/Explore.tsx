import { Button } from "@mui/material";

export default function Explore() {
    return (
        // <section 
        // id="explore"
        // className="w-full pb-20 text-black relative flex  items-start flex-col ">
        //     <div className="text-center flex flex-col w-full items-center justify-center mb-10 max-w-xs self-center">
        //         <span className="text-sm flex flex-row items-center gap-3 font-medium">EXPLORE<span className="border-b-2  border-rose w-[50px]"></span></span>
        //         <span className="text-3xl font-bold ">What's New Today.</span>
        //     </div>
        //     <div className="flex w-1/2 items-center gap-3 self-center">
        //         <div className="shadow-lg p-5 roudned-lg flex flex-col w-72 gap-2">
        //             <span className="text-black/50 text-xs ">10th DEC 2025</span>
        //             <span className="font-medium text-sm">Anniversary Discount</span>
        //             <Button variant="outlined" className="rounded-lg! w-fit text-sm!">Continue</Button>
        //         </div>
        //     </div>
        // </section>
        <>
            <section className="section__container banner__container">
                <div className="banner__content">
                    <div className="banner__card">
                        <h4>1</h4>
                        <p>Properties Available</p>
                    </div>
                    <div className="banner__card">
                        <h4>100+</h4>
                        <p>Reservation Completed</p>
                    </div>
                    <div className="banner__card">
                        <h4>400+</h4>
                        <p>Happy Customers</p>
                    </div>
                </div>
            </section>
            <section className="explore" id="explore">
                <p className="section__subheader">EXPLORE</p>
                <h2 className="section__header">What's New Today.</h2>
                <div className="explore__bg">
                    <div className="explore__content">
                        <p className="section__description">10th DEC 2025</p>
                        <h4>Anniversary Discount.</h4>
                        <button className="btn">Continue</button>
                    </div>
                </div>
            </section>
        </>

    )
}
