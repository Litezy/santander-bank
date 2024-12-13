import React from 'react'
import card from '../../assets/santander/spc-card.png'
import cashier from '../../assets/santander/cashier.jpg'
import time from '../../assets/santander/Time.svg'
import handshake from '../../assets/santander/Handshake.svg'
import icon from '../../assets/santander/icontwo.svg'
import blog1 from '../../assets/santander/blog1.jpg'
import blog2 from '../../assets/santander/blog2.jpg'
import blog3 from '../../assets/santander/blog3.jpg'
import branch from '../../assets/santander/branch.png'
import map from '../../assets/santander/map.jpg'
import { IoIosArrowDroprightCircle } from "react-icons/io";

const Community = () => {

    const comms = [
        {
            icon: time,
            amount: `68,000+`,
            desc: 'Volunteer hours'
        },
        {
            icon: handshake,
            amount: `$33.3M`,
            desc: 'Given in support to nonprofits'
        },
        {
            icon: icon,
            amount: `400+`,
            desc: 'nonprofits supported'
        },
    ]

    const saves = [
        {
            image: blog1,
            name: 'save up',
            desc: 'How to set financial goals'
        },
        {
            image: blog2,
            name: 'master debt',
            desc: '7 debt payoffs that boost your credit score the most'
        },
        {
            image: blog3,
            name: 'live life',
            desc: 'Preventing fraud: 6 ways to protect yourself'
        },
    ]
    return (
        <div className='w-full'>
            <div className="mt-40 lg:mt-52  flex flex-col text-[#303030]  lg:flex-row w-[85%] mx-auto items-center justify-between gap-10">

                <div className="flex flex-col justify-between items-start w-full lg:w-2/3 gap-4  ">
                    <div className="lite text-[40px] lg:text-[50px] leading-[58px]">Santander® Private Client
                    </div>
                    <div className="font-bold text-[20px]">A banking experience designed around your individual goals</div>
                    <div className="text-[20px] lite">Your dedicated Relationship Banker can provide you with access to our best rates on deposits, as well as preferred pricing on lending and investment products*.</div>
                    <div className="py-2 px-6 rounded-full bg-primary text-base text-white">Learn more</div>
                </div>

                <div className="lg:w-1/3 w-full self-stretch ">
                    <img src={card} className=' w-full ' alt="card image" />
                </div>
            </div>
            <div className="w-full mt-10">
                <div className="w-full flex bg-slate items-center pb-10 lg:pb-0 flex-col lg:flex-row gap-5">
                    <div className=" h-full w-full lg:w-1/2">
                        <img src={cashier} className='w-full' alt="cashier image" />
                    </div>
                    <div className="w-full lg:w-2/3 px-5 ">
                        <div className="w-full flex items-start gap-8 flex-col ">
                            <div className="lite text-[30px] lg:text-[44px] leading-[36px] lg:leading-[48px]">Community-oriented action</div>
                            <div className="text-[20px] lite">Our support for inclusive, sustainable growth helps customers and communities build paths to prosperity today, tomorrow, and for the future.</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-5">
                                {comms.map((item, i) => {
                                    return (
                                        <div className="w-full gap-2 px-4 pb-2 bg-white h-40 flex items-center justify-center flex-col">
                                            <img src={item.icon} alt={item.desc} />
                                            <div className=" text-[24px] text-primary ">{item.amount}</div>
                                            <div className="text-center sans text-[#303030] text-[15px]">{item.desc}</div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="py-2 self-center lg:self-start px-6 rounded-full bg-primary text-base text-white">Learn more</div>

                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full mt-24">
                <div className="text-center lite text-[54px] leading-[48px]">Financial advice to <span className='font-bold'>reach your goals faster</span></div>
                <div className="w-full gradient-box px-10  pb-16 relative">
                    <div className="mt-10  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {saves.map((item, i) => {
                            return (
                                <div className="w-full flex items-start gap-3 flex-col">
                                    <div className="w-full">
                                        <img src={item.image} className='w-full' alt={item.name} />
                                    </div>
                                    <div className="flex items-start gap-3 flex-col w-full px-5 bg-white h-40 lg:py-2 py-5">
                                        <div className="flex flex-col items-start justify-between h-full">
                                            <div className="text-[15px] lite leading-[23px] uppercase text-primary">{item.name}</div>
                                            <div className="text-[#6b6c7e] lite leading-[28px] text-[26px]">{item.desc}</div>

                                            <div className="flex items-center gap-2">
                                                <div className="underline font-bold text-[19px] dark">Read Now</div>
                                                <IoIosArrowDroprightCircle className='text-primary text-2xl' />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="py-2 absolute -bottom-16 lg:-bottom-5 left-1/2 -translate-x-1/2 px-6 rounded-full bg-primary text-base text-white">View all articles</div>
                </div>
            </div>
            <div className="mt-32 w-full">
                <div className="w-10/12 mx-auto">
                    <div className="w-full flex-col lg:flex-row  gap-20 flex items-center ">
                        <div className="w-full lg:w-1/2 ">
                            <div className="flex items-start gap-2">
                                <div className=" ">
                                    <img src={branch} className='w-32 lg:w-36' alt="branch image" />
                                </div>
                                <div className="flex flex-col items-start gap-5">
                                    <div className="lite text-[54px] leading-[48px]">Find Us</div>
                                    <div className="lite text-[20px] leading-[28px]">Branches across the Northeast and in Miami, Florida, plus <span className='text-primary'>2,000+ ATMs</span></div>
                                    <div className="flex lg:flex-row flex-col items-center w-full gap-5">
                                        <div className="py-2 w-full px-6 lg:w-fit  text-center rounded-full bg-primary text-base text-white">Find a branch</div>
                                        <div className="py-2 w-full lg:w-fit text-center px-6 rounded-full bg-primary text-base text-white">Book an appointment</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2 ">
                            <img src={map} alt="map-image" />
                        </div>
                    </div>

                    <div className="mt-20 w-full">
                        <div className="flex flex-col items-start gap-3 text-dark">
                            <div className="sans text-[15px] leading-[23px]">*Securities and advisory services are offered through Santander Investment Services, a division of Santander Securities LLC. Santander Securities LLC is a registered broker-dealer, Member <span className='text-primary underline'>FINRA</span> and <span className='text-primary underline'>SIPC</span> and a Registered Investment Adviser. Insurance is offered through Santander Securities LLC or its affiliates. Santander Investment Services is an affiliate of Santander Bank, N.A.</div>
                            <div className="sans text-[15px] leading-[23px]">Santander Securities LLC U.S. registered representatives may only conduct business with residents of the states in which they are properly registered. Please note that not all of the investments and services mentioned on this website are available in every state.</div>
                        </div>
                        <div className="mt-5 w-11/12 mx-auto">
                            <div className="w-full sans font-bold text-[15px] leading-[23px] border-dark border">
                                <div className="text-center">INVESTMENT AND INSURANCE PRODUCTS ARE:</div>
                                <div className="grid grid-cols-3  text-center border-dark border-t border-b">
                                    <div className="border-r border-dark">NOT FDIC INSURED</div>
                                    <div className="border-r border-dark">NOT BANK GUARANTEED	</div>
                                    <div> MAY LOSE VALUE</div>
                                </div>
                                <div className="grid grid-cols-2  text-center border-dark ">
                                    <div className="border-r border-dark">NOT INSURED BY ANY FEDERAL  GOVERNMENT AGENCY</div>
                                    <div className="">NOT A BANK DEPOSIT</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Community