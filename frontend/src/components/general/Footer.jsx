import React, { useState } from "react";
import {
  BsFacebook,
  BsInstagram,
  BsTwitterX,
  BsLinkedin,
  BsYoutube
} from "react-icons/bs";
import logo from '../../assets/santander/houselogo.png'

const QuickLinks = [
  {
    title: "santander bank",
     subs:[ 'Personal Banking', 'Investing','Small Business', 'Commercial','Private Client']
  },
  { title: "about", 
    subs:['Careers','Our Commitment','Leadership','Media Center','Shareholder Relations','Work Cafe']
  },
  { title: "support services",
    subs:['Servicemmbers Civil Relief act','(SCRA) Benefits', 'Help For Homeowners Having','Difficulty Paying Their Mortgage']
   },
  { title: "resources & help", 
    subs:['Find a Branch/ATM','Personal Banking Resources','Security Center','Site Map']
   },
];

const QuickLinks2 = [
  { title: "terms of services", url: "/terms" },
  { title: "privacy policies", url: "/privacy-policy" },
];

const SocialMediaLinks = [
  { title: "x", url: "https://x.com/", Icon: BsTwitterX },
  { title: "instagram", url: "https://www.instagram.com/", Icon: BsInstagram },
  { title: "facebook", url: "https://web.facebook.com/?_rdc=1&_rdr", Icon: BsFacebook },
  { title: "linkedin", url: "https://web.facebook.com/?_rdc=1&_rdr", Icon: BsLinkedin },
  { title: "youtube", url: "https://web.facebook.com/?_rdc=1&_rdr", Icon: BsYoutube },
];



export default function Footer() {


  return (
    <div className="w-full pb-10">
      <div className="w-full lg:w-[95%] px-10 pt-5 pb-12 mx-auto bg-[#6f7779] ">
        <div className="w-full grid grid-cols-1  lg:grid-cols-4 gap-10">
          {QuickLinks.map((Link,i) =>{
            return(
              <div className="flex w-full" key={i}>
               <div className="flex items-start gap-4 flex-col w-full">
               <div className="lite text-[24px] capitalize text-white leading-[32px]">{Link.title}</div>
               <hr className="w-full border-[#959595]"/>
               <div className="flex flex-col items-start mt-5 gap-2 w-full">
               {Link.subs.map((sub, index) => {

                return (
                  <div className="text-[16px] leading-[26px] lite underline text-white" key={index}>{sub}</div>
                )
               })}
                 
               </div>
               </div>
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-between w-full mt-8 flex-col gap-5 lg:flex-row">
          <div className="flex items-start lg:items-center flex-col lg:flex-row text-[14px] leading-[18px] text-white lite">
          <div className=""> <span className="underline cursor-pointer">Privacy Policy</span> | <span className="underline cursor-pointer">Terms of Use</span> | <span className="underline cursor-pointer">Accessibilty</span> | <span>© 2024 Santander Bank, N. A- </span></div>
          <div className="flex items-center">
          <img src={logo} className="w-6" alt="house logo" />
          <div className=""> Equal Housing Lender - Member FDIC</div>
          </div>
          </div>

          <div className="w-full lg:w-1/3">
          <div className="w-full flex items-center gap-5">
            {SocialMediaLinks.map((link,_) =>{
              return (
                <div className="px-3 py-3 rounded-full bg-white">
                  <link.Icon className="text-xl cursor-pointer text-[#6f7779] hover:text-red-800"/>
                </div>
              )
            })}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
