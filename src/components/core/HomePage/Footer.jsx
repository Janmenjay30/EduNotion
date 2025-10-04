import React from "react";
// import { DiVim } from "react-icons/di"; // DiVim was imported but not used, so it's removed to clean up

const Footer = () => {
    return (
        // Added a main container for consistent styling, often used for background
        <div className="bg-richblack-900 text-richblack-200">
            <div className="grid grid-cols-1 md:grid-cols-2 w-11/12 mx-auto divide-x divide-richblack-400 pb-10 pt-9">

                {/* Left side */}
                {/* Changed to md:grid-cols-3 for responsiveness */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 pr-4 md:pr-0">
                    <div className="space-y-4 cursor-pointer">
                        {/* Company Section */}
                        <div className="text-[#eeeff1] text-2xl font-bold hover:text-[#a9aaab]">StudyNotion</div>
                        <div className="text-[#AFB2BF] text-lg font-bold hover:text-[#eceff2]">Company</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">About</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Careers</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Affiliates</div>

                        {/* Social Media Icons - Corrected SVG attributes */}
                        <div className="flex flex-row text-[#AFB2BF] gap-4 ">
                            <a href="#" aria-label="Facebook" className="hover:text-[#eceff2]"> {/* Added className and aria-label for accessibility */}
                                <svg className="h-5 w-5 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                </svg>
                            </a>
                            <a href="#" aria-label="Twitter" className="hover:text-[#eceff2]"> {/* Added className and aria-label for accessibility */}
                                <svg className="h-5 w-5 text-neutral-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                                    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                                </svg>
                            </a>
                            <a href="#" aria-label="YouTube" className="hover:text-[#eceff2]"> {/* Added className and aria-label for accessibility */}
                                <svg className="h-5 w-5 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                                </svg>
                            </a>
                            <a href="#" aria-label="LinkedIn" className="hover:text-[#eceff2]"> {/* Added className and aria-label for accessibility */}
                                <svg className="h-5 w-5 text-neutral-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" />
                                    <path d="M17.788 5.108A9 9 0 1021 12h-8" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Resources Section */}
                    <div className="text-[#AFB2BF] cursor-pointer space-y-4">
                        <div className="text-[#AFB2BF] text-lg font-bold hover:text-[#eceff2]">Resources</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Articles</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Blog</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Chart sheets</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Code challenges</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Docs</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Projects</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Videos</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Workspaces</div>
                        <div className="text-[#AFB2BF] text-xl font-bold hover:text-[#eceff2]">Support</div>
                        <div className="text-[#AFB2BF] hover:text-[#eceff2]">Help center</div>
                    </div>

                    {/* Plans and Community Section */}
                    <div className="text-[#AFB2BF] cursor-pointer space-y-4">
                        <div className="text-[#AFB2BF] text-lg font-bold hover:text-[#eceff2]">Plans</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Paid Membership</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">For Student</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Business Solution</div>
                        <div className="text-[#AFB2BF] text-lg font-bold hover:text-[#eceff2]">Community</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Forums</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Chapters</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Events</div>
                    </div>
                </div>

                {/* Right side */}
                {/* Added responsive grid-cols-1 md:grid-cols-3 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 pl-4 md:pl-[4rem] mt-8 md:mt-0">
                    {/* Subjects Section */}
                    <div className="space-y-4 cursor-pointer">
                        <div className="text-[#AFB2BF] text-lg font-bold hover:text-[#eceff2]">Subjects</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">AI</div> {/* Typo 'Al' corrected to 'AI' */}
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Cloud Computing</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Code Foundation</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Computer Science</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Cybersecurity</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Data Analysis</div> {/* Typo 'analysis' corrected */}
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Data Science</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Data Visualization</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Developers Tools</div> {/* Typo 'Developers' corrected */}
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">DevOps</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Game Development</div> {/* Typo 'Devlopment' corrected */}
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">IT</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Machine Learning</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Math</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Mobile Development</div> {/* Typo 'Devlopment' corrected */}
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Web Design</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Web Development</div> {/* Typo 'Devlopment' corrected */}
                    </div>

                    {/* Languages Section */}
                    <div className="space-y-4 cursor-pointer">
                        <div className="text-[#AFB2BF] text-lg font-bold hover:text-[#eceff2]">Languages</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Bash</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">C</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">C++</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">C#</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Go</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">HTML & CSS</div> {/* Added space for clarity */}
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Java</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">JavaScript</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Kotlin</div> {/* Typo 'Kotin' corrected */}
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">PHP</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Python</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">R</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Ruby</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">SQL</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Swift</div>
                    </div>

                    {/* Career Building Section */}
                    <div className="space-y-4 cursor-pointer">
                        <div className="text-[#AFB2BF] text-lg font-bold hover:text-[#eceff2]">Career Building</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Career Services</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Career Paths</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Interview Preps</div>
                        <div className="text-[#AFB2BF] text-sm hover:text-[#eceff2]">Full Catalog</div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom Section (Added for common footer layout) */}
            <div className="flex justify-between items-center w-11/12 mx-auto py-3 text-sm text-richblack-400 border-t border-richblack-700 mt-4">
                <div className="flex gap-4">
                    <a href="#" className="hover:text-richblack-5">Privacy Policy</a>
                    <a href="#" className="hover:text-richblack-5">Cookie Policy</a>
                    <a href="#" className="hover:text-richblack-5">Terms</a>
                </div>
                <div>Made with ❤️ by StudyNotion © 2025</div> {/* Updated year to current */}
            </div>

        </div>
    );
};

export default Footer;