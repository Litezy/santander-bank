import GeneralLayout from 'layouts/GeneralLayout'
import React, { useEffect, useState } from 'react'
import { helpers } from './utils'
import { IoIosArrowDroprightCircle } from "react-icons/io";
import firstgif from '../../assets/santander/banking.gif'
import podcast from '../../assets/santander/podcast.jpg'
import calendar from '../../assets/santander/calendar.png'

const Helping = () => {
  const [active, setActive] = useState(null)
  const selectDesc = (val) => {
    setActive(val)
  }


  const texts = ['online', 'on their phone', 'smarter', 'better', 'easier'];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);



  return (
    <div className="w-full">
      <div className=" w-full bg-slate flex items-center justify-center px-10 py-20">
        <div className="w-full flex items-center flex-col  gap-10">
          <div className="mb-4 text-center text-3xl lite">Helping people bank <span className='font-bold border-b-2 border-b-primary '>{texts[currentIndex]}</span></div>
          <div className="grid w-10/12 mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:w-full">
            {helpers.map((item, i) => {
              return (
                <div key={i} onMouseOver={() => selectDesc(i)} onMouseLeave={() => setActive(null)} className="bg-white h-44 lg:h-48 border-zinc-600 hover:border-primary border cursor-pointer flex px-5  items-center  flex-col gap-1 py-5">
                  <img src={item.image} alt={item.name} />
                  <div className="text-primary lite text-lg">{item.name}</div>
                  <div className={`text-center  hidden  ${active === i ? 'lg:block' : 'hidden'}`}>{item.desc}</div>
                  <div className={`text-center lg:hidden `}>{item.desc}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div className="w-full mt-5 gradient-box py-5 ">
        <div className="flex w-10/12 mx-auto items-center  flex-col lg:flex-row">
          <div className="w-full lg:w-1/2">
            <img src={firstgif} alt="gif image" />
          </div>
          <div className="flex items-start gap-10 flex-col w-full lg:w-2/3">
            <div className="lite text-4xl lg:text-5xl  ">Invest with confidence</div>
            <div className="text-normal font-light">Santander Investment Services* offers a wide range of solutions that provide the guidance you need to set investment goals and the tools you need to achieve them. Start working with a Financial Advisor today.</div>
            <div className="flex cursor-pointer items-center gap-1">
              <div className="text-[18px] font-bold">Start investing</div>
              <IoIosArrowDroprightCircle className='text-lg text-primary' />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-slate mt-16 py-10">
        <div className="w-10/12 mx-auto lg:flex-row flex items-start gap-16  flex-col ">
          <div className="order-2 w-full lg:w-1/2 flex items-start flex-col gap-5">
            <div className="text-[1.3rem]">Find out what happens when cyber threats become <span className='text-2xl'>REALITY</span>.</div>
            <div className="text-base">Explore our new fictional podcast series <span className='font-bold'>UNLEASHED</span></div>
            <div className="flex cursor-pointer items-center gap-1">
              <div className="text-[15px] font-bold">Learn more</div>
              <IoIosArrowDroprightCircle className='text-2xl text-primary' />
            </div>
          </div>
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <img src={podcast} className='w-fit h-64 ' alt="podcast image" />
          </div>
        </div>

      </div>

      <div className="w-full flex py-20 items-center  justify-center">
        <div className=" w-11/12 mx-auto lg:w-8/12  flex-col lg:flex-row flex items-center gap-10 ">
          <div className="flex flex-col gap-3 items-end  lg:w-2/3 ">
            <div className="text-primary lite text-[45px] lg:text-[54px] ">Let's meet <span className='font-bold'>in person</span></div>
            <div className="flex items-center gap-2">
              <img src={calendar} className='' alt="podcast image" />
              <div className="text-[#697084] text-[16px] lg:text-[26px]">Schedule one-on-one time with a banker.</div>
            </div>
          </div>
          <div className="py-1 px-5 rounded-full bg-primary text-base text-white">book now</div>
        </div>

      </div>
    </div>
  )
}

export default Helping