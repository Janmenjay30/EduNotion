import React, { useEffect, useState } from "react";
import { NavbarLinks } from "../../data/navbar-links";
import Logo from "../../assets/Logo/Logo-Full-Light.png";
import { Link, matchPath } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaCartShopping } from "react-icons/fa6";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apis";
import { IoMdArrowDropdown } from "react-icons/io";
import { logout } from "../../services/operations/authAPI";
import { useDispatch } from "react-redux";
import ProfileDropDown from "../core/auth/profileDropDown";



const Navbar=()=>{
    
    const {token}=useSelector( (state)=>state.auth);
    const {user}=useSelector( (state)=>state.profile );
    const {totalItmes}=useSelector( (state)=>state.cart );
    const location=useLocation();

    const [ssubLinks, setSsubLinks]  = useState([]);
    const [subLinks, setSubLinks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
          setLoading(true)
          try {
            const res = await apiConnector("GET", categories.CATEGORIES_API)
            setSubLinks(res.data.data)
          } catch (error) {
            console.log("Could not fetch Categories.", error)
          }
          setLoading(false)
        })()
      }, [])

    const fetchSublinks = async() => {
        try{
            const result = await apiConnector("GET", categories.CATEGORIES_API);
            // console.log("Printing Sublinks result:" , result);
            setSsubLinks(result.data.data);
        }
        catch(error) {
            console.log("Could not fetch the category list");
        }
    }

    // useEffect( () => {
    //     console.log("PRINTING TOKEN", token);
    //     fetchSublinks();
    // },[] )

    const dispatch = useDispatch()
    const handleLogout = () => {
        dispatch(logout());
      };

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
                                (<div className='relative flex items-center gap-2 group'>
                                    <p>{link.title}</p>
                                    <IoMdArrowDropdown/>
    
                                    <div className='invisible absolute left-[50%]
                                        translate-x-[-50%] translate-y-[50%]
                                     top-[50%]
                                    flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900
                                    opacity-0 transition-all duration-200 group-hover:visible
                                    group-hover:opacity-100 lg:w-[300px] z-20 gap-y-4 border-separate '>
    
                                    <div className='absolute left-[50%] top-0
                                    translate-x-[80%]
                                    translate-y-[-45%] h-6 w-6 rotate-45 rounded bg-richblack-5'>
                                    </div>
    
                                    {
                                        subLinks.length ? (
                                                subLinks.map( (subLink, index) => (
                                                    <Link to={`${subLink.link}`} key={index}>
                                                        <p>{subLink.title}</p>
                                                    </Link>
                                                ) )
                                        ) : (<div></div>)
                                    }
    
                                    </div>
    
    
                                </div>):(
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