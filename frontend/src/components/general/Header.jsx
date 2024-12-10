import React, { useState } from "react";
import logo from "../../assets/santander/logo.png";
import hero from "../../assets/santander/hero.png";
import { headers } from "./utils";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropup } from "react-icons/io";


const Header = () => {
  const [active, setActive] = useState(headers[0].title);
  const [activesub, setActiveSub] = useState(Number);
  const [dropdown, setDropdown] = useState({ type: '', status: false });
  const [sub, setSub] = useState([]);
  const [selected, setSelected] = useState(null);




  const chooseDrop = (type, val, subs) => {
    if (dropdown?.type === type) {
      setDropdown({ ...dropdown, status: false });
      setSub(subs)
      setActiveSub(val)
      setSelected(null)
    } else {
      setDropdown({ type: type, status: true });
      setSub(subs);
      setActiveSub(val)
      setSelected(val)
    }
  }


  return (
    <div className="w-full">
      <div className={`w-[95%] mx-auto gradient-box pb-5 pt-20 px-5 `}>
        <div className="w-full flex items-start justify-between">
          <div className="flex items-start gap-10 w-5/6">
            <img src={logo} className="w-[12rem]" alt="logo" />

            <div className="flex flex-col gap-3 w-full">
              {/* Header Titles */}
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
                            
                            <div className="">{selected === typeIndex ? <IoMdArrowDropup className="text-primary"/> : <IoMdArrowDropdown/>}</div>
                            }
                          </div>
                        )
                      })}
                  </div>
                ))}
              </div>

            </div>
          </div>

          <div className="flex items-center gap-6">
            <FaLocationDot className="text-primary text-xl" />
            <div className="px-8 py-2 rounded-full bg-primary">
              <div className="text-white text-xl sans font-normal">Login</div>
            </div>
          </div>
        </div>

        {dropdown.status &&
          <div className="flex  bg-sec flex-col pt-10 items-start gap-1">
            {sub.map((item, _) => {
              let firstIndex = _ === 0
              return (
                <div className={`text-sm  ${firstIndex && 'font-bold'}`} key={_}>{item}</div>
              )
            })}
          </div>
        }
      </div>
      <div className={`w-[95%] relative  mx-auto`}>
        <div className={` flex items-center justify-between w-full`}>

          <div className="w-full flex ml-16 items-start flex-col lg:w-1/2 gap-3">
            <div className="text-[54px]  lite  leading-none">The best financial <br /> tools and advice for <br /> every need.</div>
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
