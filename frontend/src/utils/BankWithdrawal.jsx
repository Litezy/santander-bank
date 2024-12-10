import { dispatchProfile } from 'app/reducer'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { errorMessage, successMessage } from './functions'
import { Apis, GetApi, PostApi } from 'services/Api'
import Lottie from 'lottie-react';
import moment from 'moment';
import animationLogo from "assets/animation.json"
import Loader from './Loader'
import ButtonComponent from './ButtonComponent'
import FormComponent from './FormComponent'
import { Link, useNavigate } from 'react-router-dom'
import ModalLayout from './ModalLayout'

const BankWithdrawal = () => {

    const [screen, setScreen] = useState(1)
    const [loading, setLoading] = useState(false)
    const [receipt, setReceipt] = useState({})
    const dispatch = useDispatch()
    const profile = useSelector((state) => state.profile.profile)
    const currency = useSelector((state) => state.profile.currency)
    const [inprocess, setInprocess] = useState(false)
    const [forms, setForms] = useState({
        acc_no: '',
        acc_name: '',
        bank_name: '',
        swift: '',
        amount: '',
        reset_code: '',
        memo: ''
    })

    const handleChange = (e) => {
        setForms({ ...forms, [e.target.name]: e.target.value })
    }


    const fetchUserProfile = useCallback(async () => {
        try {
            const response = await GetApi(Apis.auth.profile);
            if (response.status !== 200) return;
            dispatch(dispatchProfile(response.data));
        } catch (error) {
            errorMessage(`error in fetching profilee`, error.message);
        }
    }, [dispatch]);


    const NextScreen = () => {
        if(profile?.kyc !== 'verified') return errorMessage(`Please complete your kyc before proceeding with withdrawal.`)
        if (!forms.acc_name) return errorMessage('Account name is required')
        if (!forms.acc_no) return errorMessage('Account number is required')
        if (!forms.bank_name) return errorMessage('Bank name is required')
        if (!forms.amount) return errorMessage('Amount is required')
        if (!forms.memo) return errorMessage('Memo is required')
        if (profile?.balance < forms.amount) return errorMessage('Insufficient balance')
        setScreen(2)
    }

    const fetchpendingWithdrawals = async () => {
        try {
            const res = await GetApi(Apis.auth.pending_bank_withdrawals)
            if (res.status !== 200) return setInprocess(false);
            if (res.status === 200 && res.data.length <= 0) return setInprocess(false);
            setInprocess(true)
        } catch (error) {
            errorMessage(error.mesage)
            console.log(error)
        }
    }

    useEffect(() => {
        fetchpendingWithdrawals()
    }, [])

    const SubmitTransfer = async () => {
        const formdata = {
            acc_no: forms.acc_no,
            acc_name: forms.acc_name,
            bank_name: forms.bank_name,
            swift: forms.swift,
            amount: forms.amount,
            memo: forms.memo
        }
        // return console.log(formdata)
        setLoading(true)
        try {
            const res = await PostApi(Apis.auth.transfer, formdata)
            if (res.status === 200) {
                successMessage(res.msg)
                setScreen(2)
                setForms({
                    ...forms,
                    acc_no: '',
                    acc_name: '',
                    bank_name: '',
                    swift: '',
                    amount: '',
                    memo: ''
                })
                setReceipt(res.data)
                await new Promise((resolve, reject) => setTimeout(resolve, 3000));
                setScreen(3)
                fetchUserProfile()
            } else {
                errorMessage(res.msg)
            }

        } catch (error) {
            errorMessage(error.mesage)
            console.log(error)
        } finally {
            setLoading(false)
        }
    }


    const closeScreens = () => {
        fetchpendingWithdrawals()
        setScreen(1)
    }

const newCurr = useSelector((state) => state.profile.newCurr)


    return (
        <div className="">

            {inprocess ?
                <div className="p-10 flex items-center  justify-center">
                    <div className="flex items-center flex-col gap-5">
                        <Loader />
                        <div className="">Bank withdrawal processing, check back later.</div>
                        <div className="text-center w-11/12 lg:w-10/12 mx-auto">This usually takes 24-48hrs to complete, If you haven't received it within this timeframe, kindly contact customer support or raise a ticket.</div>
                    </div>

                </div> :
                <div>

                    {screen === 1 &&
                        <div className="my-10 w-full relative flex items-start shadow-lg flex-col py-5 px-2 lg:px-10 bg-white rounded-lg h-fit">
                            <div className="text-lg font-semibold text-balance">Enter Bank Details Below</div>
                            <div className=" my-3 pb-2 w-full text-xl font-semibold border-b flex items-center justify-between">
                            </div>
                            <div className="flex items-start flex-col gap-8 w-full mt-3">
                                <div className="flex w-full items-center flex-col lg:flex-row justify-between gap-5 lg:gap-10">
                                    <div className="flex items-start flex-col  lg:w-1/2 w-full">
                                        <div className="-500 text-base">Beneficiary Name:</div>
                                        <FormComponent placeholder={`Beneficiary Name`} name={`acc_name`} value={forms.acc_name} onchange={handleChange} />
                                    </div>
                                    <div className="flex items-start flex-col  lg:w-1/2 w-full">
                                        <div className="-500 text-base">Beneficiary Bank:</div>
                                        <FormComponent placeholder={`Beneficiary Bank`} name={`bank_name`} value={forms.bank_name} onchange={handleChange} />
                                    </div>
                                </div>
                                <div className="flex w-full flex-col lg:flex-row items-center justify-between gap-5 lg:gap-10">
                                    <div className="flex items-start flex-col lg:w-1/2 w-full">
                                        <div className="-500 text-base">Account No:</div>
                                        <FormComponent formtype='phone' placeholder={`Account no.`} name={`acc_no`} value={forms.acc_no} onchange={handleChange} />
                                    </div>
                                    <div className="flex items-start flex-col lg:w-1/2 w-full">
                                        <div className="-500 text-base">Swift No: (required for int'l transfers)</div>
                                        <FormComponent formtype='phone' name={`swift`} placeholder={`Swift code`} value={forms.swift} onchange={handleChange} />
                                    </div>
                                </div>

                                <div className="flex items-start flex-col lg:w-1/2 mx-auto w-full">
                                    <div className="-500 text-base">Amount ({profile?.currency === '?' ? newCurr : currency})</div>
                                    <FormComponent formtype='phone' placeholder={`enter aamount`} name={`amount`} value={forms.amount} onchange={handleChange} />
                                </div>
                                <div className="flex items-start flex-col  w-full">
                                    <div className=" text-base">Memo</div>
                                    <textarea
                                        name='memo'
                                        value={forms.memo}
                                        className='w-full  max-h-20 resize-none p-2 rounded-md border hover:border-black'
                                        onChange={handleChange}
                                        placeholder='memo'
                                    >
                                    </textarea>
                                </div>

                                <button onClick={NextScreen} className="md:w-fit w-full cursor-pointer text-center md:ml-auto md:px-10 py-2 bg-gradient-to-tr from-primary to-sec rounded-md text-white">Next</button>
                            </div>
                        </div>}


                    {screen === 2 &&
                        <div className="my-10 lg:w-[60%] mx-auto w-full relative flex items-start shadow-lg flex-col py-5 px-3 lg:px-10 bg-white rounded-lg h-fit">

                            {loading &&
                                <div className="fixed top-0 z-50 backdrop-blur-sm w-full h-full rounded-md left-1/2 -translate-x-1/2">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-fit p-5 rounded-md bg-white"><Loader /></div>
                                </div>
                            }

                            <button onClick={() => setScreen(1)} className='bg-gradient-to-tr from-primary to-sec text-white w-fit px-4 py-1 rounded-md'>
                                edit
                            </button>
                            <div className="text-left w-full font-bold my-5 text-xl">Review your transfer details</div>

                            <div className="mt-6 flex items-start gap-5 flex-col w-full ">
                                <div className="flex w-full items-center flex-col  justify-between gap-5 lg:gap-10">
                                    <div className="flex items-center gap-3  w-full">
                                        <div className="-500 text-base">Receiver's Account Name:</div>
                                        <div className="capitalize text-base font-bold">{forms.acc_name}</div>
                                    </div>
                                    <div className="flex items-center gap-3  w-full">
                                        <div className="-500 text-base">Receiver's Bank Name:</div>
                                        <div className="capitalize text-base font-bold">{forms.bank_name}</div>
                                    </div>
                                    <div className="flex items-center gap-3  w-full">
                                        <div className="-500 text-base">Swift Code:</div>
                                        <div className="capitalize text-base font-bold">{forms.swift}</div>
                                    </div>
                                    <div className="flex items-center gap-3  w-full">
                                        <div className="-500 text-base">Amount({profile?.currency === '?' ? newCurr : currency}):</div>
                                        <div className="capitalize text-base font-bold">{forms.amount}</div>
                                    </div>

                                    <div className="flex items-center gap-3  w-full">
                                        <div className="-500 text-base">Memo:</div>
                                        <div className="capitalize text-base font-bold">{forms.memo}</div>
                                    </div>


                                    <div className="w-full my-5">
                                        <ButtonComponent disabled={loading ? true : false} type='button' onclick={SubmitTransfer} title={'Send'} bg={`bg-gradient-to-tr from-primary to-sec text-white h-14`} />
                                    </div>
                                </div>
                            </div>
                        </div>

                    }


                    {screen === 3 &&
                        <div className="my-10 lg:w-[60%] mx-auto w-full relative flex items-center shadow-lg flex-col py-5 px-3 lg:px-10 bg-white rounded-lg h-fit">
                            <div className="my-3 text-center text-2xl font-light">Transfer Successful</div>
                            <Lottie
                                animationData={animationLogo}
                                className="w-auto h-72"
                                loop={true}
                            />

                            <div className="my-5">
                                <div className="text-center font-semibold text-xl">Transfer Receipt</div>
                                <div className="mt-3 flex items-start gap-2 flex-col w-full ">
                                    <div className="flex w-full items-center flex-col  justify-between gap-5 ">
                                        <div className="flex items-center gap-3  w-full">
                                            <div className="-500 text-base">Receiver's Account Name:</div>
                                            <div className="capitalize text-base font-bold">{receipt.acc_name}</div>
                                        </div>
                                        <div className="flex items-center gap-3  w-full">
                                            <div className="-500 text-base">Receiver's Bank Name:</div>
                                            <div className="capitalize text-base font-bold">{receipt.bank_name}</div>
                                        </div>
                                        <div className="flex items-center gap-3  w-full">
                                            <div className="-500 text-base">Receiver's Account Name:</div>
                                            <div className="capitalize text-base font-bold">{receipt.acc_name}</div>
                                        </div>
                                        <div className="flex items-center gap-3  w-full">
                                            <div className="-500 text-base">Swift Code:</div>
                                            <div className="capitalize text-base font-bold">{receipt.swift}</div>
                                        </div>
                                        <div className="flex items-center gap-3  w-full">
                                            <div className="-500 text-base">Amount:</div>
                                            <div className="capitalize text-base font-bold">({profile?.currency === '?' ? newCurr : currency}){receipt.amount}</div>
                                        </div>
                                        <div className="flex items-center gap-3  w-full">
                                            <div className="-500 text-base">Memo:</div>
                                            <div className="capitalize text-base font-bold">{receipt.memo}</div>
                                        </div>
                                        <div className="flex items-center gap-3  w-full">
                                            <div className="-500 text-base">Transaction Status:</div>
                                            <div className="capitalize text-base font-bold">{receipt.status}</div>
                                        </div>
                                        <div className="flex items-center gap-3  w-full">
                                            <div className="-500 text-base">Transaction ID:</div>
                                            <div className="capitalize text-base font-bold">{receipt.transid}</div>
                                        </div>
                                        <div className="flex items-center gap-3  w-full">
                                            <div className="-500 text-base">Transaction Date:</div>
                                            <div className="capitalize text-base font-bold">{moment(receipt.createdAt).format(`DD-MM-YYYY hh:mm A`)}</div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <button onClick={closeScreens} className='mt-6 text-center bg-gradient-to-tr from-primary to-sec text-white w-10/12 mx-auto px-3 py-2 rounded-md'>Close</button>
                        </div>
                    }
                </div>
            }
        </div>
    )
}

export default BankWithdrawal