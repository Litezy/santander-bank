import React, { useCallback, useEffect, useState } from 'react'
import { IoReturnUpBackOutline } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { Apis, GetApi } from 'services/Api';
import FormComponent from 'utils/FormComponent';
import { errorMessage } from 'utils/functions';

const UserBanks = ({ setActive }) => {
    const profile = useSelector((state) => state.profile.profile)
    const [banksArr, setBanksArr] = useState([])
    const [uniqueId,setUniqueId] = useState([])
    const [users, setUsers] = useState([])
    
    const fetchUserBanks = useCallback(async () => {
        try {
            const res = await GetApi(Apis.admin.all_banks)
            if (res.status === 200) {
                setBanksArr(res.data)
            }
        } catch (error) {
            console.log(error)
            errorMessage(error.message)
        }
    }, [])

    useEffect(() => {
        fetchUserBanks()
    }, [profile])
    return (
        <div className='w-full'>
            <div className="w-full flex items-center justify-between">
                <div onClick={() => setActive(0)} className="w-fit cursor-pointer mr-auto bg-primary text-white px-3 py-1 rounded-md">
                    <IoReturnUpBackOutline className='text-2xl' />
                </div>
                <div className="text-lg font-semibold">User Banks</div>
            </div>

            <div className="my-5 bg-white w-full h-fit p-5 rounded-md shadow-md">
                <div className="text-center text-xl font-semibold" >{banksArr.length === 0 ? `${banksArr.length} bank`:`${banksArr.length} banks`} submitted    </div>


            </div>

            <div className="">
                {banksArr.map((item, i) => {
                    return (
                        <form className="h-fit w-full relative bg-white rounded-lg mb-3 p-10" key={i}>

                            <div className="w-full flex items-start gap-5 flex-col ">
                                <div className="self-center md:text-2xl text-lg text-primary font-semibold">{item.userbanks?.firstname} {item.userbanks?.lastname }'s {item.bank_name} Bank Details</div>
                                <div className="flex w-full lg:items-center flex-col lg:flex-row justify-between">
                                    <div className="lg:w-[45%]">Holder's Fullname:</div>
                                    <FormComponent value={item.fullname} />
                                </div>
                                <div className="flex w-full lg:items-center flex-col lg:flex-row justify-between">
                                    <div className="lg:w-[45%]">Bank Name:</div>
                                    <FormComponent value={item.bank_name} />
                                </div>
                                <div className="flex w-full lg:items-center flex-col lg:flex-row justify-between">
                                    <div className="lg:w-[45%]">Bank Account No:</div>
                                    <FormComponent value={item.account_no} />
                                </div>
                                <div className="flex w-full lg:items-center flex-col lg:flex-row justify-between">
                                    <div className="lg:w-[45%]">Bank Address:</div>
                                    <FormComponent value={item.bank_address} />
                                </div>
                                <div className="flex w-full lg:items-center flex-col lg:flex-row justify-between">
                                    <div className="lg:w-[45%]">Account Type:</div>
                                    <FormComponent value={item.account_type} />
                                </div>
                                <div className="flex w-full lg:items-center flex-col lg:flex-row justify-between">
                                    <div className="lg:w-[45%]">Routing No.</div>
                                    <FormComponent name={'route_no'} value={item.route_no} />
                                </div>
                                <div className="flex w-full lg:items-center flex-col lg:flex-row justify-between">
                                    <div className="lg:w-[45%]">Swift/BIC Code</div>
                                    <FormComponent name={'swift'} value={item.swift} />
                                </div>
                                <div className="flex w-full lg:items-center flex-col lg:flex-row justify-between">
                                    <div className="lg:w-[45%]">IBAN</div>
                                    <FormComponent name={'iban'} value={item.iban} />
                                </div>
                            </div>
                        </form>
                    )
                })}
            </div>
        </div>
    )
}

export default UserBanks