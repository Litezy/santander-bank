import React, { useState } from 'react'
import { FaAsterisk } from 'react-icons/fa6'
import { GoShieldLock } from 'react-icons/go'
import { useSelector } from 'react-redux'
import FormComponent from 'utils/FormComponent'
import Loader from 'utils/Loader'
import { IoEyeOutline, IoEyeOffSharp } from 'react-icons/io5'
import { errorMessage, successMessage } from 'utils/functions'
import { Apis, GetApi, PostApi } from 'services/Api'
import { useNavigate } from 'react-router-dom'

const InternalTransfer = () => {

    const profile = useSelector((state) => state.profile.profile)
    const currency = useSelector((state) => state.profile.currency)
    const [forms, setForms] = useState({
        input: '',
        amount: '',
        memo: ''
    })

    const [loading1, setLoading1] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [screen, setScreen] = useState(1)
    const [bal, setBal] = useState(true)
    const [load,setLoad] = useState(false)
    const [userdata, setUserData] = useState({})
    const navigate = useNavigate()
    const Icon = bal ? IoEyeOffSharp : IoEyeOutline
    const [status, setStatus] = useState({
        email: false,
        phone: false
    })


    const handleChange = (e) => {
        setForms({
            ...forms,
            [e.target.name]: e.target.value
        })
    }

    const handleInput = async (input) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[+]?[0-9]{10,15}$/;
        if (input === profile?.phone) {
            setForms({ ...forms, input: '' })
            return errorMessage("Can't send to self")
        }
        if (input === profile?.email) {
            setForms({ ...forms, input: '' })
            return errorMessage("Can't send to self")
        }
        if (emailRegex.test(input)) {
            setLoading1(true)
            setStatus({ ...status, email: true, phone: false })
            try {
                const res = await GetApi(`${Apis.auth.fetch_p2p}/${input}`)
                if (res.status !== 200) {
                    setForms({ ...forms, input: '' })
                    return errorMessage(res.msg)
                }
                successMessage(res.msg)
                setScreen(2)
                setUserData(res.data)
                setForms({ ...forms, input: '' })
            } catch (error) {
                errorMessage(`something went wrong`, error.message)
            }

            finally {
                setLoading1(false)
                setStatus({ ...status, email: false, phone: false })
            }
        } else if (phoneRegex.test(input)) {
            setLoading2(true)
            setStatus({ ...status, email: false, phone: true })

            try {
                const res = await GetApi(`${Apis.auth.fetch_p2p}/${input}`)
                if (res.status !== 200) {
                    setForms({ ...forms, input: '' })
                    return errorMessage(res.msg)
                }
                successMessage(res.msg)
                setScreen(2)
                setUserData(res.data)
                setForms({ ...forms, input: '' })
            } catch (error) {
                errorMessage(`something went wrong`, error.message)
            }
            finally {
                setLoading2(false)
                setStatus({ ...status, email: false, phone: false })
            }
        } else {
            setForms({ ...forms, input: '' })
            return errorMessage("Invalid input");

        }
    };


    const handleTransfer = async () => {
        if (!userdata?.email) return errorMessage(`Receiver's details not found`)
        if (!forms.amount) return errorMessage(`Amount is required`)
        if (forms.amount > profile?.balance) return errorMessage(`Insufficient funds`)
        const formdata = {
            receiveremail: userdata?.email,
            amount: forms.amount
        }
        setLoad(true)
        try {
            const res = await PostApi(Apis.auth.internal_transfer, formdata)
            if (res.status !== 200) return;
            successMessage(res.msg)
            setForms({ ...forms, input: '' })
            setScreen(1)
            navigate('/user/transactions')
        } catch (error) {
            errorMessage(`something went wrong`, error.message)
        } finally {
            setLoad(false)
        }
    }
    const newCurr = useSelector((state) =>state.profile.newCurr)

    return (
        <div>
            <div className="w-11/12 mx-auto mt-5 ">
                <div className="bg-gradient-to-tr flex items-center justify-center flex-col  from-primary to-sec px-6 py-10 rounded-lg">
                    <div className="flex items-center gap-2 text-white text-sm font-extralight">
                        <GoShieldLock className='text-green-400 text-lg' />
                        <div className="lg:text-2xl text-base">Available Balance</div>
                        <Icon onClick={() => setBal(prev => !prev)} className='text-2xl cursor-pointer' />
                    </div>
                    <div className="flex mt-5 self-center ">
                        <div className="text-slate-200 text-2xl self-end font-bold">{profile?.currency === '?' ? newCurr : currency} </div>
                        <div className="font-bold text-2xl text-white">{bal ? profile?.balance?.toLocaleString() :
                            <>
                                <div className="flex">
                                    {new Array(5).fill(0).map((item, i) => (
                                        <div className="flex items-center text-sm ml-2" key={i}><FaAsterisk /></div>
                                    ))}
                                </div>
                            </>
                        }
                        </div>
                    </div>
                </div>

                <div className="my-10 w-full relative flex items-start shadow-lg flex-col py-5 px-5 lg:px-10 bg-white rounded-lg h-fit">

                    {loading1 &&
                        <div className="absolute top-1/2 left-1/2 z-40 -translate-x-1/2">
                            <Loader />
                        </div>
                    }

                    <div className=" my-3 w-full  border-b py-3">
                        <div className="text-xl font-semibold">Local Money Transfer</div>
                        <div className="text-sm ">Sending to another Pinerock credit union user is usually fast, secure, and free  of charge</div>
                    </div>

                    {screen === 1 &&
                        <>
                            <div className="my-10 w-full relative ">
                                {loading1 &&
                                    <div className="absolute top-1/2 z-40 left-1/2 -translate-x-1/2">
                                        <Loader />
                                    </div>
                                }

                                {loading2 &&
                                    <div className="absolute top-1/2 left-1/2 z-40 -translate-x-1/2">
                                        <Loader />
                                    </div>
                                }
                                <div className="flex items-start flex-col mx-auto  lg:w-1/2 w-full">
                                    <div className="-500 text-base">Email/Phone Number</div>
                                    <FormComponent name={`input`} value={forms.input} onchange={handleChange} />
                                </div>
                            </div>
                            <button disabled={loading1 || loading2 ? true : false} onClick={() => handleInput(forms.input)} className="w-10/12 lg:w-1/2 mx-auto cursor-pointer text-center md:px-10 py-2 bg-primary rounded-md text-white">Find User</button>
                        </>
                    }
                    {screen === 2 &&
                        <>
                            <div className="my-10 w-full relative">

                                {load &&
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2">
                                        <Loader />
                                    </div>
                                }
                                <div onClick={()=> setScreen(1)} className="px-3 w-fit rounded-md mb-2 py-1 bg-gradient-to-tr from-primary to-sec text-white text-sm">back</div>
                                <div className=" font-bold text-lg">User Details</div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="">Full Name:</div>
                                    <div className="font-semibold capitalize">{userdata?.firstname} {userdata?.lastname}</div>
                                </div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="">Email:</div>
                                    <div className="font-semibold ">{userdata?.email} </div>
                                </div>
                                <div className="flex items-start flex-col mx-auto  lg:w-1/2 w-full">
                                    <div className="-500 text-base">Amount ({profile?.currency})</div>
                                    <FormComponent formtype='phone' name={`amount`} value={forms.amount} onchange={handleChange} />
                                </div>
                            </div>
                            <button disabled={load ? true : false} onClick={() => handleTransfer(forms.input)} className="w-10/12 lg:w-1/2 mx-auto cursor-pointer text-center md:px-10 py-2 bg-primary rounded-md text-white">Send Money</button >
                        </>
                    }

                    <div className="my-2 font-semibold mt-5 ">* No hidden charges</div>

                </div>
            </div>

        </div>
    )
}

export default InternalTransfer