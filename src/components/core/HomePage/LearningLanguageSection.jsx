import React from "react";
import HighlightText from "./HighlightText";
import knowyourprogress from "../../../assets/Images/Know_your_progress.png"
import CTAButton from "./Button"
import planyourlesson from "../../../assets/Images/Plan_your_lessons.png";
import comparewithothers from "../../../assets/Images/Compare_with_others.png";

const LearningLanguageSection =()=>{
    return(
        <div className="mt-[130px]">
            <div className="flex flex-col gap-5 items-center">
                <div className="text-center font-semibold text-4xl">
                    Your Swiss knife for
                    <HighlightText text={"learning any language"}/>
                </div>
                <div className="text-ceenter text-richblack-600 mx-auto text-base">
                Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
                </div>
                <div className="flex flex-row items-center justify-center mt-5">
                    <img src={knowyourprogress} alt="KnowYourProgressImage" className="object-contain -mr-32"/>
                    <img src={comparewithothers} alt="CompareWithOthersImage" />
                    <img src={planyourlesson} alt="PlanYourLesson" className="objet-contain -ml-36"/>
                </div>

                <div>
                    <CTAButton active={true} linkto={"/signup"}>Learn More</CTAButton>
                </div>

            </div>
        </div>
    )
}

export default LearningLanguageSection;