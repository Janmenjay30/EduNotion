import React from "react";
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg";
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg";
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg";
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg";
import timelineimage from "../../../assets/Images/TimelineImage.png";


const timeline=[
    {
        Logo:Logo1,
        heading:"Leadership",
        Description:"Fully committed to the success company",
    },
    {
        Logo:Logo2,
        heading:"responsibility",
        Description:"Fully committed to the success company",
    },
    {
        Logo:Logo3,
        heading:"Flexibility",
        Description:"Fully committed to the success company",
    },
    {
        Logo:Logo4,
        heading:"Solve the problem",
        Description:"Fully committed to the success company",
    }
]


const TimelineSection=()=>{
    return(
        <div>
            <div className="flex flex-row items-center gap-15">

                <div className="w-[45%] flex flex-col gap-5">
                    {
                        timeline.map((element,index)=>{
                            return(
                                <div className="flex flex-row gap-6 space-y-3 justify-start" key={index}>
                                    <div className="w-[50px] h-[50px]  flex items-center">
                                        <img src={element.Logo}/>
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-[18px] ">{element.heading}</h2>
                                        <p className="text-base-">{element.Description}</p>
                                    </div>
                                </div>

                            )
                        })
                    }

                </div>
                <div className="relative shadow-blue-200">
                    <img src={timelineimage} className="shadow-white object-cover h-fit" />

                    <div className="absolute bg-caribbeangreen-700 flex flex-row text-white uppercase py-10 
                    left-[50%] translate-x-[-40%] translate-y-[-50%]">
                        <div className="flex flex-row gap-5 items-center border-r border-caribbeangreen-200 px-7">
                            <p className="text-3xl font-bold text-white">10</p>
                            <p className="text-caribbeangreen-400 text-sm">Years of experience</p>
                        </div>

                        <div className="flex gap-5 items-center px-7 ">
                        <p className="text-3xl font-bold text-white">250</p>
                        <p className="text-caribbeangreen-400 text-sm">Type of Courses</p>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default TimelineSection