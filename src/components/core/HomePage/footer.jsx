import React from "react";
import { DiVim } from "react-icons/di";

const Footer =()=>{
    return(
        <div>
            <div className="grid grid-cols-2 w-11/12  mx-auto divide-x divide-richblack-400  pb-10 pt-9">
            
            {/* left side */}
            
            <div className="grid grid-cols-3 gap-4 ">
                <div className="space-y-4 cursor-pointer">
                    <div className="text-[#eeeff1] text-2xl font-bold hover:text-[#a9aaab]">StudyNotion</div>
                    <div className="text-[#AFB2BF] text-lg font-bold hover:text-[#eceff2]">Company</div>
                    <div className="text-[#AFB2BF] text-sm  hover:text-[#eceff2]">About</div>
                    <div className="text-[#AFB2BF] text-sm  hover:text-[#eceff2]">Careers</div>
                    <div className="text-[#AFB2BF] text-sm  hover:text-[#eceff2]">Affiliates</div>
                    <div className="flex flex-row text-[#AFB2BF] gap-4 ">
                        
                        
                        <div className="hover:text-[#eceff2]">
                            <svg class="h-5 w-5 text-neutral-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg></div>
                        <div className="hover:text-[#eceff2]">
                        <svg class="h-5 w-5 text-neutral-500"  width="24" height="24" viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round" ><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
                        </div>
                        <div className="hover:text-[#eceff2]">
                        <svg class="h-5 w-5 text-neutral-500"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round">  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
                        </div>
                        <div className="hover:text-[#eceff2]">
                        <svg class="h-5 w-5 text-neutral-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M17.788 5.108A9 9 0 1021 12h-8" /></svg>
                        </div>
                                                </div>

                </div>
                <div className="text-[#AFB2BF]  cursor-pointer space-y-4">
                   <div className="text-[#AFB2BF] text-lg font-bold hover:text-[#eceff2]">Resources</div>
                   <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">Articles</div>
                   <div className="text-[#AFB2BF] text-sm  hover:text-[#eceff2]">Blog</div>
                   <div className="text-[#AFB2BF] text-sm  hover:text-[#eceff2]">Chart sheets</div>
                   <div className="text-[#AFB2BF] text-sm  hover:text-[#eceff2]">Code challenges</div>
                   <div className="text-[#AFB2BF] text-sm  hover:text-[#eceff2]">Docs</div>
                   <div className="text-[#AFB2BF] text-sm  hover:text-[#eceff2]">Projects</div>
                   <div className="text-[#AFB2BF] text-sm  hover:text-[#eceff2]">Videos</div>
                   <div className="text-[#AFB2BF] text-sm  hover:text-[#eceff2]">Workspaces</div>
                   <div className="text-[#AFB2BF]  text-xl font-bold hover:text-[#eceff2]">Support
                   </div>
                    <div className="text-[#AFB2BF]  hover:text-[#eceff2]">Help center</div>
                
                </div>
                <div className="text-[#AFB2BF]   cursor-pointer space-y-4">
                <div className="text-[#AFB2BF] text-lg font-bold hover:text-[#eceff2]">Plans</div>
                <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">Paid Membership</div>
                <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">For Student</div>
                <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">Business Solution</div>
                <div className="text-[#AFB2BF] text-lg font-bold hover:text-[#eceff2]">Community</div>
                <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">Forums</div>
                <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">Chapters</div>
                <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">Events</div>
                </div>
                
                
            </div>
            {/* Right side */}
            <div className="grid grid-cols-3  mx-5 pl-[4rem]">
                <div className="space-y-4 cursor-pointer">
                    <div className="text-[#AFB2BF] text-lg font-bold hover:text-[#eceff2]">Subjects</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">Al</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">Cloud Computing</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">Code Foundation</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">Computer Science</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">Cybersecurity</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">Data analysis</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">Data Science</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">Data Visualization</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">Developers Tools</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">DevOps</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">Game Devlopment</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">IT</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">Machine Learning</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">Math</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">Mobile Devlopment</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">Web Design</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">Web Devlopment</div>
                </div>
                <div className="space-y-4 cursor-pointer">
                    <div className="text-[#AFB2BF] text-lg font-bold hover:text-[#eceff2]">Languages</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">Bash</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">C</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">C++</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">C#</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">Go</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">HTML&CSS</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">Java</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">JavaScript</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">Kotin</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">PHP</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">Python</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">R</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">Ruby</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">SQL</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">Swift</div>
                </div>
                <div className="space-y-4 cursor-pointer">
                    <div className="text-[#AFB2BF] text-lg font-bold hover:text-[#eceff2]">Career Building</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">Career Services</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">Career Paths</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">Interview Preps</div>
                    <div className="text-[#AFB2BF]  text-sm hover:text-[#eceff2]">Full Catalog</div>
                </div>

            </div>
            
        </div>


        


    
        </div>
    )
}

export default Footer;