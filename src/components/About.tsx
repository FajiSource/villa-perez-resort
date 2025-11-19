import { useNavigate } from "react-router-dom";
import aboutImage from '../assets/about.jpeg'

function About() {
    const navigate = useNavigate();
    return (
       
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
                    <button 
                        className="btn"
                        onClick={() => navigate("/read-more")}
                    >
                        Read More
                    </button>
                </div>
            </div>
        </section>
    )
}

export default About