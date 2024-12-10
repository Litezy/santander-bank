import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Apis, GetApi, PostApi } from 'services/Api'
import { errorMessage } from './functions'
import ModalLayout from './ModalLayout'
import FormComponent from './FormComponent'
import ButtonComponent from './ButtonComponent'
import Loader from './Loader'

const UserBanks = () => {

    const profile = useSelector((state) => state.profile.profile)
    const [banksArr, setBanksArr] = useState([])
    const [loading, setLoading] = useState(false)
    const [modal, setModal] = useState(false)
    const [viewdetails, setViewDetails] = useState(false)



    const fetchUserBanks = useCallback(async () => {
        try {
            const response = await GetApi(Apis.auth.get_banks)
            if (response.status === 200) {
                setBanksArr(response.data)
            } else {
                errorMessage(response.msg)
            }
        } catch (error) {
            errorMessage(error.message)
        }
    }, [])

    useEffect(() => {
        fetchUserBanks()
    }, [fetchUserBanks])

    const [forms, setForms] = useState({
        bank_name: '',
        account_no: '',
        fullname: '',
        account_type: '',
        route_no: '',
        swift: '',
        iban: '',
        bank_address: ''
    })


    const handleChange = (e) => {
        setForms({
            ...forms,
            [e.target.name]: e.target.value
        })
    }



    const AddBankAcc = async (e) => {
        e.preventDefault()
        if (!forms.fullname) return errorMessage(`Full name is required`)
        if (!forms.bank_name) return errorMessage(`Bank name is required`)
        if (!forms.bank_address) return errorMessage(`Bank address is required`)
        if (!forms.account_no) return errorMessage(`Account number is required`)
        if (!forms.account_type) return errorMessage(`Account type is required`)
        const formdata = {
            bank_name: forms.bank_name,
            account_no: forms.account_no,
            fullname: forms.fullname,
            account_type: forms.account_type,
            route_no: forms.route_no,
            iban: forms.iban,
            bank_address: forms.bank_address,
            swift: forms.swift
        }
        setLoading(true)
        try {
            const res = await PostApi(Apis.auth.add_bank, formdata)
            if (res.status === 200) {
                fetchUserBanks()
                setModal(false)
            } else {
                errorMessage(res.msg)
            }

        } catch (error) {
            errorMessage(error.message)
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className='w-full'>

            {modal &&
                <ModalLayout setModal={setModal} clas={`w-11/12 mx-auto md:w-[60%] overflow-auto`}>
                    <form onSubmit={AddBankAcc} className="h-fit w-full relative bg-white rounded-lg p-10">

                        {loading &&
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 ">
                                <Loader />
                            </div>
                        }
                        <div className="w-full flex items-start gap-5 flex-col ">
                            <div className="self-center text-2xl text-primary font-semibold">Enter Bank Details</div>
                            <div className="flex w-full lg:items-center flex-col lg:flex-row justify-between">
                                <div className="lg:w-[45%]">Holder's Fullname:</div>
                                <FormComponent name={'fullname'} value={forms.fullname} onchange={handleChange} />
                            </div>
                            <div className="flex w-full lg:items-center flex-col lg:flex-row justify-between">
                                <div className="lg:w-[45%]">Bank Name:</div>
                                <FormComponent name={'bank_name'} value={forms.bank_name} onchange={handleChange} />
                            </div>
                            <div className="flex w-full lg:items-center flex-col lg:flex-row justify-between">
                                <div className="lg:w-[45%]">Bank Account No:</div>
                                <FormComponent name={'account_no'} value={forms.account_no} onchange={handleChange} />
                            </div>
                            <div className="flex w-full lg:items-center flex-col lg:flex-row justify-between">
                                <div className="lg:w-[45%]">Bank Address:</div>
                                <FormComponent name={'bank_address'} value={forms.bank_address} onchange={handleChange} />
                            </div>
                            <div className="flex w-full lg:items-center flex-col lg:flex-row justify-between">
                                <div className="lg:w-[45%]">Account Type:</div>
                                <label className={`w-full`} >
                                    <select className='w-full outline-none border h-12 rounded-md hover:border-black' name='account_type' onChange={handleChange} value={forms.account_type}>
                                        <option >--select--</option>
                                        <option name='savings' value="savings">Savings</option>
                                        <option name='checking' value="checking">Checking</option>
                                        <option name='current' value="current">Current</option>
                                        <option name='business' value="business">Business</option>
                                    </select>
                                </label>
                            </div>
                            <div className="flex w-full lg:items-center flex-col lg:flex-row justify-between">
                                <div className="lg:w-[45%]">Routing No. (Optional)</div>
                                <FormComponent name={'route_no'} value={forms.route_no} onchange={handleChange} />
                            </div>
                            <div className="flex w-full lg:items-center flex-col lg:flex-row justify-between">
                                <div className="lg:w-[45%]">Swift/BIC Code (Optional)</div>
                                <FormComponent name={'swift'} value={forms.swift} onchange={handleChange} />
                            </div>
                            <div className="flex w-full lg:items-center flex-col lg:flex-row justify-between">
                                <div className="lg:w-[45%]">IBAN (Optional)</div>
                                <FormComponent name={'iban'} value={forms.iban} onchange={handleChange} />
                            </div>
                        </div>
                        <div className="lg:w-1/2 mx-auto mt-8">
                            <ButtonComponent disabled={loading ? true :false} title={`Link Bank`} bg={`text-white bg-gradient-to-tr from-primary to-sec  h-14 `} />
                        </div>
                    </form>
                </ModalLayout>
            }
            {viewdetails &&
                <ModalLayout setModal={setViewDetails} clas={`w-11/12 mx-auto md:w-[60%] overflow-auto`}>
                    {banksArr.map((item, i) => {
                        return (
                            <form className="h-fit w-full relative bg-white rounded-lg mb-3 p-10" key={i}>

                                <div className="w-full flex items-start gap-5 flex-col ">
                                    <div className="self-center text-2xl text-primary capitalize font-semibold">{item.bank_name} Bank Details</div>
                                    <div className="flex w-full lg:items-center flex-col lg:flex-row justify-between">
                                        <div className="lg:w-[45%]">Holder's Fullname:</div>
                                        <FormComponent  value={item.fullname}/>
                                    </div>
                                    <div className="flex w-full lg:items-center flex-col lg:flex-row justify-between">
                                        <div className="lg:w-[45%]">Bank Name:</div>
                                        <FormComponent  value={item.bank_name}/>
                                    </div>
                                    <div className="flex w-full lg:items-center flex-col lg:flex-row justify-between">
                                        <div className="lg:w-[45%]">Bank Account No:</div>
                                        <FormComponent  value={item.account_no}/>
                                    </div>
                                    <div className="flex w-full lg:items-center flex-col lg:flex-row justify-between">
                                        <div className="lg:w-[45%]">Bank Address:</div>
                                        <FormComponent  value={item.bank_address}/>
                                    </div>
                                    <div className="flex w-full lg:items-center flex-col lg:flex-row justify-between">
                                        <div className="lg:w-[45%]">Account Type:</div>
                                        <FormComponent  value={item.account_type}/>
                                    </div>
                                    <div className="flex w-full lg:items-center flex-col lg:flex-row justify-between">
                                        <div className="lg:w-[45%]">Routing No. (Optional)</div>
                                        <FormComponent name={'route_no'} value={item.route_no} onchange={handleChange} />
                                    </div>
                                    <div className="flex w-full lg:items-center flex-col lg:flex-row justify-between">
                                        <div className="lg:w-[45%]">Swift/BIC Code (Optional)</div>
                                        <FormComponent name={'swift'} value={item.swift} onchange={handleChange} />
                                    </div>
                                    <div className="flex w-full lg:items-center flex-col lg:flex-row justify-between">
                                        <div className="lg:w-[45%]">IBAN (Optional)</div>
                                        <FormComponent name={'iban'} value={item.iban} onchange={handleChange} />
                                    </div>
                                </div>
                            </form>
                        )
                    })}
                </ModalLayout>
            }
            <div className="flex items-center justify-between">
                <div className="">
                    <div className="text-xl font-semibold">Linked Bank Accounts</div>
                    <div className="text-xs font-semibold">max of two banks</div>
                </div>
                {banksArr.length >=2 ?'':<button onClick={() => setModal(true)} className='text-white bg-gradient-to-tr from-primary to-sec  w-fit px-3 py-1 rounded-md'>Add bank</button>}
            </div>
            <div className="mt-3 bg-white w-full h-fit p-5 rounded-md shadow-md">
                {banksArr.length > 0 ? 
                    <>
                  <div className="text-center text-xl font-semibold" >{banksArr.length === 1 ? `${banksArr.length}  bank linked to your account` : `${banksArr.length}  banks linked to your account`} </div>
                        <div onClick={() => setViewDetails(true)} className="w-fit ml-auto px-3 py-1 cursor-pointer rounded-md bg-gradient-to-tr from-primary to-sec  text-white">view details</div>
                    </> :
                    <>
                        <div className="text-center text-xl font-semibold">No linked banks</div>
                    </>
                }
            </div>
        </div>
    )
}

export default UserBanks