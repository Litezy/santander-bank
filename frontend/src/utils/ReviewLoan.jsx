import React from 'react'
import { useSelector } from 'react-redux'
import ButtonComponent from './ButtonComponent'

const ReviewLoan = ({ setScreen }) => {

  const profile = useSelector((state) => state.profile.profile)
  return (
    <div className='w-full'>
      <div onClick={() => setScreen(2)} className="w-fit cursor-pointer mr-auto px-3 py-1 rounded-md bg-primary text-white">back</div>
      <div className="w-full text-center  text-primary  mt-5 mb-1 text-2xl font-semibold">Review and Submit Loan Request</div>
      <div className="text-center">Repayment will be automatically collected from the debit card linked to your account.</div>
      <div className="my-4 md:w-1/2 mx-auto h-fit p-10  rounded-md bg-white shadow-md">

        <div className=" h-full w-full flex-col flex gap-10 items-start justify-between ">
          <div className="flex items-center justify-between w-full">
            <div className="flex  items-center flex-col gap-1">
              <div className="font-semibold">Loan Amount</div>
              <div className="">$60,000</div>
            </div>
            <div className="flex  items-center flex-col gap-1">
              <div className="font-semibold">Interest</div>
              <div className="">$500</div>
            </div>
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex  items-center flex-col gap-1">
              <div className="font-semibold">Duration</div>
              <div className="">3 months</div>
            </div>
            <div className="flex  items-center flex-col gap-1">
              <div className="font-semibold">Total interest due</div>
              <div className="">$5500</div>
            </div>
          </div>
        </div>
        <div className="grid w-full grid-cols-3 items-center">
          <div className="flex my-3 flex-col items-center">
            <div className="font-semibold">Purpose for Loan</div>
            <div className=" ">Education</div>
          </div>
          <div className="flex my-3 flex-col items-center">
            <div className="font-semibold">Loan ID</div>
            <div className=" ">12345</div>
          </div>
          <div className="flex my-3 flex-col items-center">
            <div className="font-semibold">Bank Account No.</div>
            <div className=" ">{profile?.account_number}</div>
          </div>
        </div>
        <div className="mt-5">
          <ButtonComponent type='button' title={`Submit`} bg={`h-12 bg-primary text-white text-xl`}/>
        </div>
      </div>
    </div>
  )
}

export default ReviewLoan