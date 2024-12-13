import React from 'react'
import bankapp from '../../assets/santander/phone.png'
import apple from '../../assets/santander/apple.jpg'
import google from '../../assets/santander/google.jpg'
import qrcode from '../../assets/santander/qrcode.png'
import bike from '../../assets/santander/bike.gif'
import { MdOutlinePlayCircle } from "react-icons/md";

const SantanderFreedom = () => {
  return (
    <div className='w-full'>
      <div className="w-full bg-slate pt-10 h-[450dvh] lg:h-[175dvh]  px-5 lg:px-10 text-[#555555]">
        <div className="w-11/12 lg:w-10/12 mx-auto flex-col lg:flex-row flex items-center gap-10 ">
          <div className="flex w-full lg:w-2/3 flex-col gap-10">
            <div className="lite text-[54px] leading-[58px] ">Santander mobile banking for anywhere convenience</div>
            <div className="">Make Mobile Check Deposits, set up Alerts, manage cards, and more, all from the Santander Mobile Banking App. It’s the simplest, most secure way to manage your money on the go.</div>

            <div className="flex flex-col lg:flex-row w-full items-start lg:gap-20 gap-5">
              <div className="flex w-full flex-col lg:w-1/2 gap-3">
                <div className="">Download our <span className='font-bold'>highly-rated app</span></div>
                <div className="italic">4.7 out of 5 Rating. Based on 369k ratings on the App Store as of 11/21/2024</div>

                <div className="flex w-1/2 items-center gap-2">
                  <img src={apple} className='' alt="apple image" />
                  <img src={google} className='' alt="google image" />
                </div>
                <div className="flex w-full items-center gap-1 ">
                  <div className="text-primary underline text-[1.1rem]">Scan QR code to open app</div>
                  <img src={qrcode} className='w-8' alt="qrcode image" />
                </div>
              </div>
              <div className="flex items-start gap-5 flex-col">
                <div className="">Get started with one of our mobile app tutorials:</div>

                <div className="flex flex-col items-start gap-2 text-primary">
                  <div className="flex items-center">
                    <MdOutlinePlayCircle />
                    <div className="underline">Mobile Check Deposit</div>
                  </div>
                  <div className="flex items-center">
                    <MdOutlinePlayCircle />
                    <div className="underline">Setup Alerts</div>
                  </div>
                  <div className="flex items-center">
                    <MdOutlinePlayCircle />
                    <div className="underline">Manage Cards</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/3 ">
            <img src={bankapp} className='w-full lg:w-fit' alt="bank app image" />
          </div>
        </div>

        <div className="mt-20 flex flex-col lg:flex-row w-10/12 mx-auto items-center justify-between gap-10">
          <div className="lg:w-1/2 w-full order-2 lg:order-1">
          <img src={bike} className='lg:w-80 w-full object-cover' alt="bike image" />
          </div>
          <div className="flex flex-col items-start w-full lg:w-2/3 gap-4 order-1 lg:order-2">
            <div className="lite text-[50px] leading-[58px]">Freedom with <br /> Santander PRO<span className='font-bold'>TECH</span>TION
            </div>
            <div className="text-[20px] lite">Mobile and Online Banking with Santander PRO<span className='font-bold'>TECH</span>TION safeguards your information with several layers of technology.</div>
            <div className="py-2 px-6 rounded-full bg-primary text-base text-white">Learn more</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SantanderFreedom