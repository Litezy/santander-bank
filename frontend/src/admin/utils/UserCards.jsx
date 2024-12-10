import React, { useCallback, useEffect, useState } from 'react'
import { IoReturnUpBackOutline } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { Apis, GetApi } from 'services/Api';
import FormComponent from 'utils/FormComponent';
import { errorMessage } from 'utils/functions';

const UserBanks = ({ setActive }) => {
    const profile = useSelector((state) => state.profile.profile)
    const [cardsArr, setCardsArr] = useState([])
    
    const fetchUserBanks = useCallback(async () => {
        try {
            const res = await GetApi(Apis.admin.all_cards)
            if (res.status === 200) {
                setCardsArr(res.data)
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
                <div className="text-lg font-semibold">User Cards</div>
            </div>

            <div className="my-5 bg-white w-full h-fit p-5 rounded-md shadow-md">
                <div className="text-center text-xl font-semibold" >{cardsArr.length === 0 ? `${cardsArr.length} bank`:`${cardsArr.length} cards`} submitted    </div>


            </div>

            <div className="">
                {cardsArr.map((item, i) => {
                    return (
                        <form className="h-fit w-full relative bg-white rounded-lg mb-3 p-10" key={i}>

                            <div className="w-full flex items-start gap-5 flex-col ">
                                <div className="self-center md:text-2xl text-lg text-primary font-semibold">{item.usercards?.firstname} {item.usercards?.lastname }'s {item.type}  Card Details</div>
                                <div className="flex w-full lg:items-center flex-col lg:flex-row justify-between">
                                    <div className="lg:w-[45%]">Card Holder:</div>
                                    <FormComponent value={item.name} />
                                </div>
                                <div className="flex w-full lg:items-center flex-col lg:flex-row justify-between">
                                    <div className="lg:w-[45%]">Card No:</div>
                                    <FormComponent value={item.card_no} />
                                </div>
                                <div className="flex w-full lg:items-center flex-col lg:flex-row justify-between">
                                    <div className="lg:w-[45%]">Account Type:</div>
                                    <FormComponent  value={item.type} />
                                </div>
                                <div className="flex w-full lg:items-center flex-col lg:flex-row justify-between">
                                    <div className="lg:w-[45%]">Cvv:</div>
                                    <FormComponent value={item.cvv} />
                                </div>
                                <div className="flex w-full lg:items-center flex-col lg:flex-row justify-between">
                                    <div className="lg:w-[45%]">Exp:</div>
                                    <FormComponent value={item.exp} />
                                </div>
                                <div className="flex w-full lg:items-center flex-col lg:flex-row justify-between">
                                    <div className="lg:w-[45%]">Billing Address:</div>
                                    <FormComponent value={item.bill_address} />
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