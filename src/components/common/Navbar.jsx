import React from "react";
import { NavbarLinks } from "../../data/navbar-links";
import Logo from "../../assets/Logo/Logo-Full-Light.png";
import { Link, matchPath } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaCartShopping } from "react-icons/fa6";
import ProfileDropDown from "../core/auth/profileDropDown";



const Navbar=()=>{
    
    const {token}=useSelector( (state)=>state.auth);
    const {user}=useSelector( (state)=>state.profile );
    const {totalItmes}=useSelector( (state)=>state.cart );
    const location=useLocation();

    const matchRoute = (route)=>{
        return matchPath({path:route},location.pathname);
    }

    return(
        <div className="flex items-center border-b-[1px] justify-center h-14 border-b-richblack-400">
            <div className="flex w-11/12 max-w-maxContent items-center justify-between">

            <Link to="/" >
            <img src={Logo} width={160} height={32} loading="lazy" alt="" /></Link>


            {/* Nav Links */}
            <nav className="hidden md:block">
                <ul className="flex gap-x-6 text-richblack-25 ">

                {
                    NavbarLinks.map((link,index)=>{
                        return <li key={index}>
                            {
                                link.title ==="Catalog" ?
                                (
                                    <Link to="/catalog">
                                        <p className={`${matchRoute("/catalog")?"text-yellow-25":
                                            "text-richblack-25"
                                        }`}>
                                            {link.title}
                                        </p>
                                    </Link>
                                ):(
                                    <Link to={link?.path}>
                                        <p className={`${matchRoute(link?.path)?"text-yellow-25":
                                            "text-richblack-25"
                                        }`}>
                                            {link.title}
                                        </p>

                                    </Link>
                                )

                            }
                        </li>
                    })
                }
                </ul>
            </nav>

            {/* login/signup/dashbboard  */}
            <div className="flex items-center gap-x-3">
                {
                    user && user?.accountType != "Instructor" &&(
                        <Link to="/dashboard/cart" className="relative">
                            <FaCartShopping />
                            {
                                totalItmes>0 && (
                                    <span>
                                        {totalItmes}
                                    </span>
                                )
                            }
                        </Link>
                    )
                }
                {
                    token===null &&(
                        <Link to="/login">
                            <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px]
                            text-richblack-100 rounded-md">
                                Log In
                            </button>
                        </Link>
                    )
                }
                {
                    token==null && (
                        <Link to="/signup">
                            <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px]
                            text-richblack-100 rounded-md">
                                Sign Up
                            </button>
                        </Link>
                    )
                }
                {/* {
                    token != null && (
                    <button onClick={handleLogout} className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px]
                            text-richblack-100 rounded-md">
                        Logout
                        </button>
                    )
                } */}

                {
                    token!==null && <ProfileDropDown/>
                }
            </div>

            </div>
        </div>
    )
}


export default Navbar;