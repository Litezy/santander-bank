import React, { useState } from "react";
import logo from "../../assets/santander/logo.png";
import hero from "../../assets/santander/hero.png";
import { headers } from "./utils";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropleft } from "react-icons/io";
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropup } from "react-icons/io";
import { FaBars } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import { MdClose } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import { CookieName, errorMessage, successMessage, UserRole } from "utils/functions";
import Cookies from "js-cookie";
import { Apis, PostApi } from "services/Api";
import { decodeToken } from "react-jwt";
import Login from "forms/Login";


const Header = () => {
  const [active, setActive] = useState(headers[0].title);
  const [activesub, setActiveSub] = useState(Number);
  const [dropdown, setDropdown] = useState({ type: '', status: false });
  const [sub, setSub] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showSmall, setShowSmall] = useState(false)
  const [findatm, setFindAtm] = useState(false)
  const [login, setLogin] = useState(false)
  const [openbanks, setOpenBanks] = useState(false)
  



  

  

  const chooseDrop = (type, val, subs) => {
    if (dropdown.status && dropdown?.type === type) {
      setDropdown({ ...dropdown, status: false });
      setSub(subs)
      setActiveSub(val)
      setSelected(null)
    }
    else {
      setDropdown({ type: type, status: true });
      setSub(subs);
      setActiveSub(val)
      setSelected(val)
    }

    // console.log(dropdown)
  }

  const chooseSmall = (type, sub) => {
    if (sub.length > 0) {
      setSub(sub)
      setDropdown({ ...dropdown, status: true })
    }
  }
  const Icon = showSmall ? MdOutlineClose : FaBars
 


  
  return (
    <div className="w-full relative">
      <div className={`w-[95%] hidden lg:block mx-auto gradient-box pb-5 pt-20 px-5 `}>
        <div className="w-full flex items-start justify-between  ">
          <div className=" items-start gap-10 w-5/6 flex">
            <img src={logo} className="w-[12rem] " alt="logo" />
            <div className="flex flex-col gap-3 w-full">
              <div className="flex items-center gap-5">
                {headers.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => { setActive(item.title); setSub([]); setDropdown(false); }}
                    className={`text-sm cursor-pointer ${active === item.title ? "border-b-primary border-b text-primary"
                      : "hover:text-primary"
                      }`}
                  >
                    {item.title}
                  </div>
                ))}
              </div>

              {/* Conditional Content Based on Active Header */}
              <div className="w-full  gap-4 mt-4">
                {headers.filter((header) => header.title === active).map((header, index) => (
                  <div key={index} className="flex gap-5 ">
                    {header.types &&
                      header.types.map((type, typeIndex) => {
                        return (
                          <div key={typeIndex} className="flex items-center">
                            <div
                              onClick={() => chooseDrop(type.type, typeIndex, type.subs)} className={`${activesub === typeIndex && 'font-bold'} text-sm  hover:font-semibold cursor-pointer`}>{type.type}</div>
                            {type.subs.length > 0 &&

                              <div className="">{selected === typeIndex ? <IoMdArrowDropup className="text-primary" /> : <IoMdArrowDropdown />}</div>
                            }
                          </div>
                        )
                      })}
                  </div>
                ))}
              </div>

            </div>
          </div>

          <div className="flex items-center justify-end gap-6  w-[25%]">
            <div className="flex items-center justify-end relative gap-2 w-full">
              <div
                className={`absolute right-0 text-sm transform transition-transform duration-500 ease-in-out 
                ${findatm ? '-translate-x-8 opacity-100' : 'translate-x-full opacity-0'}`}
              >
                Find a Branch/ATM
              </div>
              <div onMouseOver={() => setFindAtm(true)} onMouseLeave={() => setFindAtm(false)} className="cursor-pointer">
                <FaLocationDot className={`text-primary text-xl `} />
              </div>
            </div>
            <Link onClick={() => setLogin(prev => !prev)} className="px-8 py-3 cursor-pointer rounded-full text-white text-xl sans font-normal bg-primary">
              Login
            </Link>
          </div>
        </div>

        {login &&
        <div className="w-[22rem] h-[84dvh] bg-white top-[8.5rem] right-20 absolute z-50 py-8 px-4">
          <Login openbanks={openbanks} setOpenBanks={setOpenBanks} setLogin={setLogin}/>
        </div>
         }

        {dropdown.status &&
          <div className="flex   flex-col pt-10 items-start gap-1">
            {sub.map((item, _) => {
              let firstIndex = _ === 0
              return (
                <div className={`text-sm  ${firstIndex && 'font-bold'}`} key={_}>{item}</div>
              )
            })}
          </div>
        }
      </div>


      <div className="w-[95%] lg:hidden mx-auto py-5 px-2 mb-10 flex items-center justify-between">
        <div className="">
          <Icon onClick={() => setShowSmall(prev => !prev)} className={` ${showSmall ? 'border-2 border-black' : ''} text-[1.8rem] font-bold }border-2 cursor-pointer text-primary`} />
        </div>
        <div className="">
          <img src={logo} className="w-[10rem] " alt="logo" />
        </div>
        <Link onClick={() => setLogin(prev => !prev)} className=" cursor-pointer text-primary lite">Login</Link>

        {login &&
        <div className="w-[22rem] right-0 h-[84dvh] bg-white top-[1.5rem]  absolute z-50 py-8 px-4">
          <Login openbanks={openbanks} setOpenBanks={setOpenBanks} setLogin={setLogin}/>
        </div>
         }


        {showSmall &&
          <div className="w-full  max-h-[90dvh] overflow-auto  py-2 left-0 h-fit bg-white z-50 absolute top-16">

            <div className="flex items-center gap-2 w-full bg-slate px-4 py-2">
              <FaLocationDot className="text-primary text-lg cursor-pointer" />
              <div className="text-sm">FInd a branch/ATM</div>
            </div>

            <div className="flex items-start flex-col  w-full">
              {headers.map((item, i) => {
                return (
                  <>
                    <div key={i}
                      onClick={() => { setActive(item.title); setSub([]); setDropdown(false); }}
                      className={`text-sm cursor-pointer border-t-2 px-4 ${active === item.title && 'font-bold text-base py-2 text-primary'}  border-t-slate w-full py-1 `} >
                      <div className={`${item.title === active && dropdown.status ? 'flex items-center ' : ''}`}>
                        {item.title === active && dropdown.status &&
                          <div onClick={() => setDropdown({
                            ...dropdown,
                            status: false
                          })} className=""><IoMdArrowDropleft className="text-primary font-bold text-3xl" /></div>
                        }
                        {item.title}
                      </div>
                    </div>
                    <div className={`  ${item.title === active && 'bg-slate'} w-full `}>
                      {item.title === active && item.types &&
                        <div className=" w-full flex  items-start px-4  gap-2 flex-col">
                          {item.types.map((type, typeIndex) => {
                            return (
                              <>
                                <div onClick={() => chooseSmall(type.type, type.subs)} key={typeIndex} className="flex items-center w-full justify-between">
                                  <div className={` text-sm  hover:font-semibold cursor-pointer`}>{type.type}</div>
                                  {type.subs.length > 0 && !dropdown.status &&
                                    <div className="text-3xl font-bold cursor-pointer"> <IoMdArrowDropright /></div>
                                  }
                                </div>
                                <div className="w-full">
                                  {
                                    activesub === typeIndex && dropdown.status &&
                                    <div className="flex pl-5 flex-col items-start gap-1">
                                      {sub.map((item, _) => {
                                        let firstIndex = _ === 0
                                        return (
                                          <div className={`text-sm  ${firstIndex && 'font-bold'}`} key={_}>{item}</div>
                                        )
                                      })}
                                    </div>

                                  }
                                </div>
                              </>
                            )
                          })}
                        </div>
                      }
                    </div>


                  </>
                )
              })}
            </div>
          </div>
        }

      </div>



















      <div className={`w-[95%] relative  mx-auto `}>
        <div className={` flex flex-col lg:flex-row gap-10 lg:gap-0 items-center justify-between w-full`}>

          <div className="w-full flex ml-16 items-start flex-col lg:w-1/2 gap-3">
            <div className="text-[35px] lg:text-[54px]  lite text-[#727272] leading-none">The best financial <br /> tools and advice for <br /> every need.</div>
            <div className="text-base w-8/12 font-normal">Simple and secure personal banking available in person, online, or on your device.</div>
            <div className="">
              <button className="bg-primary text-white text-base py-2 px-8 rounded-full">Choose your checking account</button>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <img src={hero} className="" alt="hero image" />

          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
