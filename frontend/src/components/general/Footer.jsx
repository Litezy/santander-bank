import React, { useState } from "react";
import {
  BsFacebook,
  BsInstagram,
  BsTwitterX,
  BsWhatsapp,
} from "react-icons/bs";
import { SlClock, SlEarphonesAlt, SlEnvolope } from "react-icons/sl";
import { Link } from "react-router-dom";
import { Apis, ClientPostApi } from "services/Api";
import { errorMessage, SiteContact, SiteEmail, SiteName, successMessage } from "utils/functions";
import logo from 'assets/logo.png'

const QuickLinks = [
  { title: "home", url: "/" },
  { title: "services", url: "/services" },
  { title: "contact us", url: "/contact-us" },
  { title: "about us", url: "/about-us" },
];

const QuickLinks2 = [
  { title: "terms of services", url: "/terms" },
  { title: "privacy policies", url: "/privacy-policy" },
];

// const SocialMediaLinks = [
//   { title: "facebook", url: "https://web.facebook.com/?_rdc=1&_rdr", Icon: BsFacebook },
//   { title: "x", url: "https://x.com/", Icon: BsTwitterX },
//   { title: "instagram", url: "https://www.instagram.com/", Icon: BsInstagram },
//   { title: "whatsapp", url: "https://www.whatsapp.com/", Icon: BsWhatsapp },
// ];



export default function Footer() {

  const [email, setEmail] = useState({
    email: '',
  })

  const subscribe = async () => {
    if (!email.email) return errorMessage('Email is missing')
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
    if (!isValidEmail(email.email)) return errorMessage('Invalid email')
    const formdata = {
      email: email.email
    }
    try {
      const res = await ClientPostApi(Apis.non_auth.email_sub, formdata)
      if (res.status === 200) {
        successMessage('subcribed successfully')
        setEmail({
          email: ''
        })
      } else {
        errorMessage(res.msg)
      }
    } catch (error) {
      console.log(error)
      errorMessage('sorry, something went wrong. try again')
    }
  }
  return (
    <div className="bg-sec h-fit w-full pt-20 pb-10 overflow-hidden">
      <div className="w-11/12 text-slate-300 mx-auto ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="w-full">
            <div className="flex items-center gap-3">
            <img src={logo} className="w-32 h-20 mb-5" alt="pinerock logo" />
            <div className=" text-3xl font-bold mb-5 text-white border-b pb-5">  {SiteName}</div>
            </div>
            <div className="text-base">Pinerockcreditunion is a multinational regional financial services provider that is committed to delivering complete solutions to customers through differentiated segment offerings and an ecosystem that supports simple, fast and seamless customer experiences, underpinned by a cohesive and inspired workforce, and relationships built with stakeholders.</div>
            <div className="text-slate-300 my-3  pt-2 flex flex-col gap-3">
              <div className="flex items-center gap-2"> <SlClock /> Working hours: 24/7</div>
              <div className="flex items-center gap-2"> <SlEnvolope /> {SiteEmail}</div>
              <div className="flex items-center gap-2"> <SlEarphonesAlt /> {SiteContact}</div>
            </div>
          </div>
          <div className="w-full">
            <div className="text-3xl font-bold mb-5 text-white border-b pb-5">
              Quick Links
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="flex flex-col gap-5">
                {QuickLinks.map((item, index) => (
                  <Link
                    className="text-slate-300 hover:translate-x-2 transition-all delay-150 hover:text-orange-400 capitalize "
                    to={`${item.url}`}
                    key={index}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col gap-5">
                {QuickLinks2.map((item, index) => (
                  <Link
                    className="text-slate-300  hover:translate-x-2 transition-all delay-150 hover:text-orange-400 capitalize "
                    to={`${item.url}`}
                    key={index}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="text-[1.5rem] font-bold mb-5 text-white border-b pb-5">
              Subscribe to our NewsLetters
            </div>
            <div className="text-slate-300 my-5">
              Be among the first to get latest financial and economical updates
              directly to your mailbox.
            </div>
            <div className="bg-black/20 rounded-lg p-3 flex flex-col gap-5">
              <input
                className="w-full px-5 py-3 rounded-lg text-black bg-white focus:outline-none"
                type="email"
                placeholder="Enter your email"
                name="email"
                value={email.email}
                onChange={(e) => setEmail({ ...email, [e.target.name]: e.target.value })}
              />
              <button onClick={subscribe} className="w-full px-5 py-3 rounded-lg text-white bg-orange-500">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="mt-3 w-full border-t flex flex-col items-start gap-1">
          <div className="text-center pt-3 text-base text-slate-300 h-full ">
            Pinerock credit union Insurance Services Company Limited and Pinerock credit union Investment Solutions Limited are each
            authorised and regulated by the Financial Conduct Authority.
          </div>
          <footer>
            <p>&copy; 2024 Pinerock Credit Union. All rights reserved.</p>
          </footer>

        </div>
      </div>

    </div>
  );
}
