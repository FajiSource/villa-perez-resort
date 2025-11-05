import { Button } from "@mui/material"
import aboutImage from '../assets/about.jpeg'
function About() {
    return (
        // <section
        //     id="about"
        //     className="hero w-full h-screen bg-center bg-cover flex items-center justify-center bg-white flex items-center justify-center gap-10 px-10"
        // >
        //     <img src={aboutImage} alt=""  className="w-80 md:w-96 rounded"/>

        //     <div className="text-black flex flex-col gap-3">
        //         <span className="text-xs flex flex-row items-center gap-3 font-medium">ABOUT US <span className="border-b-2  border-rose w-[50px]"></span></span>
        //         <span className="text-2xl font-bold max-w-xs text-wrap">Swim All Day, Stay All Night.!</span>
        //         <p className="text-black/50 max-w-lg text-sm">
        //             Focused on quility accomodations, personalized experiencel, and seamless booking, our platform is designed
        //             to ensure every traveler sets off their dream holiday with confidence and excitemnent
        //         </p>
        //         <Button variant='contained' className="w-fit">Read More</Button>
        //     </div>
        // </section>
        <section className="section__container about__container" id="about">
            <div className="about__image">
                <img src={aboutImage} alt="about" />
            </div>
            <div className="about__content">
                <p className="section__subheader">ABOUT US</p>
                <h2 className="section__header">Swim All Day, Stay All Night.!</h2>
                <p className="section__description">
                    Focused on quality accommodations, personalized experiences,
                    and seamless booking, our platform is designed to ensure every traveler sets off
                    on their dream holiday with confidence and excitement.
                </p>
                <div className="about__btn">
                    <button className="btn">Read More</button>
                </div>
            </div>
        </section>
    )
}

export default About