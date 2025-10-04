import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import HighlightText from '../components/core/HomePage/HighlightText';
import CTAButton from '../components/core/HomePage/Button';
import Banner from "../banner.mp4"; // Ensure this path is correct and the video file exists
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import TimelineSection from "../components/core/HomePage/TimelineSection";
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection";
import InstructorSection from "../components/core/HomePage/InstructorSection";
import ExploreMore from "../components/core/HomePage/ExploreMore";
import Footer from "../components/core/HomePage/footer";


const Home = () => {
    return (
        <div>
            {/* Section 1 */}
            <div className="relative mx-auto flex flex-col w-11/12 items-center text-white max-w-maxContent justify-between">

                <Link to="/signup">
                    <div className="group m-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit">
                        <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] group-hover:bg-richblack-900">
                            <p>Become an Instructor</p>
                            <FaArrowRight />
                        </div>
                    </div>
                </Link>

                <div className="text-center text-4xl font-semibold mt-7">
                    Empower Your Future With
                    <HighlightText text={" Coding Skills"} />
                </div>

                <div className="mt-4 w-[90%] text-center text-lg font-bold text-richblack-300">
                    With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
                </div>

                <div className="flex flex-row gap-7 mt-8">
                    <CTAButton active={true} linkto={"/signup"}>
                        Learn More
                    </CTAButton>

                    <CTAButton active={false} linkto={"/signup"}>
                        Book a Demo
                    </CTAButton>
                </div>

                <div className="shadow-blue-200 mx-3 my-12">
                    <video
                        muted
                        loop
                        autoPlay
                    >
                        <source src={Banner} type="video/mp4" />
                    </video>
                </div>

                {/* Code section 1 */}
                <div>
                    <CodeBlocks
                        position={"lg:flex-row"}
                        heading={
                            <div className="text-4xl font-semibold" >
                                Unlock Your
                                <HighlightText text={"coding potential"}></HighlightText>
                                with our online courses
                            </div>
                        }
                        subheading={
                            <div>
                                Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you.
                            </div>
                        }

                        ctabtn1={
                            {
                                btnText: "try it yourself",
                                linkto: "/signup",
                                active: true,
                            }
                        }
                        ctabtn2={
                            {
                                btnText: "Learn More",
                                linkto: "/login",
                                active: false,
                            }
                        }
                        // Corrected HTML syntax in codeblock string
                        codeblock={`<!DOCTYPE html>
<html>
<head>
    <title>Example</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1><a href="/">Header</a></h1>
    <nav>
        <a href="one/">One</a>
        <a href="two/">Two</a>
        <a href="three/">Three</a>
    </nav>
</body>
</html>`}
                        codeColor={"text-yellow-25"}
                    />
                </div>

                {/* Code section 2 */}
                <div>
                    <CodeBlocks
                        position={"lg:flex-row-reverse"}
                        heading={
                            <div className="text-4xl font-semibold" >
                                Start
                                <HighlightText text={"Coding in Seconds"}></HighlightText>
                            </div>
                        }
                        subheading={
                            <div>
                                Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson.
                            </div>
                        }
                        ctabtn1={
                            {
                                btnText: "Continue Lessons",
                                linkto: "/signup",
                                active: true,
                            }
                        }
                        ctabtn2={
                            {
                                btnText: "Learn More",
                                linkto: "/login",
                                active: false,
                            }
                        }
                        // Corrected HTML syntax in codeblock string
                        codeblock={`<!DOCTYPE html>
<html>
<head>
    <title>Example</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1><a href="/">Header</a></h1>
    <nav>
        <a href="one/">One</a>
        <a href="two/">Two</a>
        <a href="three/">Three</a>
    </nav>
</body>
</html>`}
                        codeColor={"text-yellow-25"}
                    />
                </div>
                <ExploreMore />
            </div>

            {/* Section 2 */}
            <div className="bg-pure-greys-5 text-richblack-700">
                <div className="homepage_bg h-[310px]">
                    <div className="w-11/12 max-w-maxContent flex flex-col items-center gap-5 mx-auto">
                        <div className="h-[150px]"></div>
                        <div className="flex flex-row gap-7 text-white">
                            <CTAButton
                                active={true} linkto={"/catalog"}>
                                <div className="flex items-center gap-3">
                                    Explore Full Catalog
                                    <FaArrowRight />
                                </div>
                            </CTAButton>
                            <CTAButton
                                active={false} linkto={"/signup"} >
                                Learn More
                            </CTAButton>
                        </div>
                    </div>
                </div>

                <div className="mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7 pb-[130px]">
                    <div className="flex flex-row gap-5 mb-10 mt-[95px]">
                        <div className="text-4xl font-semibold w-[45%]">
                            Get the skills you need for a job
                            {/* Corrected 'text-bold' to 'font-bold' */}
                            <div className="font-bold bg-gradient-to-r from-[#5433FF] via-[#20BDFF] to-[#A5FECB] text-transparent bg-clip-text">
                                Job that is in demand
                            </div>
                        </div>

                        <div className="flex flex-col gap-10 w-[40%] items-start ">
                            <div>
                                The modern StudyNotion dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                            </div>
                            <CTAButton active={true} linkto={"/signup"}>
                                <div>Learn More</div>
                            </CTAButton>
                        </div>
                    </div>

                    <TimelineSection />
                    <LearningLanguageSection />
                </div>
            </div>

            {/* Section 3 */}
            <div className="w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8
            bg-richblack-900 text-white"> {/* Removed 'first-letter' class */}

                <InstructorSection />

                {/* review slider */}

            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Home;