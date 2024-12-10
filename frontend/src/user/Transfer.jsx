import React, { useCallback, useEffect, useRef, useState } from 'react'
import { GoShieldLock } from 'react-icons/go'
import { IoEyeOutline, IoEyeOffSharp } from 'react-icons/io5'
import { FaAsterisk, FaPlus } from "react-icons/fa6";
import BankWithdrawal from 'utils/BankWithdrawal';
import CardWithdrawal from 'utils/CardWithdrawal';
import { useSelector } from 'react-redux';

const Transfer = () => {
  const [bal, setBal] = useState(true)
  const [active,setActive] = useState(1)
  const Icon = bal ? IoEyeOffSharp : IoEyeOutline
  const profile = useSelector((state) => state.profile.profile)
  const currency = useSelector((state) => state.profile.currency)

const newCurr = useSelector((state) => state.profile.newCurr)

  return (
    <div className='w-full mt-5'>
      <div className="w-11/12 mx-auto ">
        <div className="bg-gradient-to-tr flex items-center justify-center flex-col  from-primary to-sec px-6 py-10 rounded-lg">
          <div className="flex items-center gap-2 text-white text-sm font-extralight">
            <GoShieldLock className='text-green-400 text-lg' />
            <div className="lg:text-2xl text-base">Available Balance</div>
            <Icon onClick={() => setBal(prev => !prev)} className='text-2xl cursor-pointer' />
          </div>
          <div className="flex mt-3 self-center ">
            <div className="text-slate-200 text-2xl self-end font-bold">{profile?.currency === '?' ? newCurr : currency}</div>
            <div className="font-bold text-2xl text-white">{bal ? profile?.balance?.toLocaleString() :
              <>
                <div className="flex">
                  {new Array(5).fill(0).map((item, i) => (
                    <div className="flex items-center text-sm ml-2" key={i}><FaAsterisk /></div>
                  ))}
                </div>
              </>
            }</div>
          </div>
        </div>

        <div className="w-11/12 mx-auto  my-5 justify-center flex items-center gap-10">
        <div onClick={()=> setActive(1)} className={`${active === 1 ? 'bg-col text-white ' : ' bg-white '}  rounded-md cursor-pointer w-1/2 text-center py-2 transition-all delay-50 duration-50`}>Bank Withdrawal</div>
        <div onClick={()=> setActive(2)}  className={`${active ===2 ? 'bg-col text-white ' : 'bg-white '} rounded-md  transition-all delay-50 duration-50 text-center cursor-pointer w-1/2 py-2 `}>Card Withdrawal</div>
        </div>
       
       <div className="w-full">
        {active === 1 && <BankWithdrawal/>}
        {active === 2 && <CardWithdrawal/>}
       </div>
       

      </div>
    </div>
  )
}

export default Transfer