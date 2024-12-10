import { Progress } from 'antd'
import UserLayout from 'layouts/UserLayout'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FaArrowLeft, FaArrowRight, FaMinus } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { Currency, errorMessage, successMessage } from 'utils/functions'
import { BiSupport } from "react-icons/bi";
import { MdAddAPhoto } from "react-icons/md";
import { MdOutlineAvTimer } from "react-icons/md";
import { FaEdit, FaPlus } from "react-icons/fa";
import Formbutton from 'utils/Formbutton'
import { IoIosMailUnread } from 'react-icons/io'
import CardComponent from 'components/user/CardComponent'
import { Apis, GetApi, PostApi } from 'services/Api'
import { useDispatch, useSelector } from 'react-redux'
import { MdPayment } from "react-icons/md";
import ModalLayout from 'utils/ModalLayout'
import FormComponent from 'utils/FormComponent'
import ButtonComponent from 'utils/ButtonComponent'
import Loader from 'utils/Loader'
import UserBanks from 'utils/UserBanks'
import { dispatchProfile } from 'app/reducer'
import SaveHistory from 'utils/SaveHistory'

const Savings = () => {

    const [support, setSupport] = useState(false)
    const proofDiv = useRef(null)
    const [records, setRecords] = useState([])
    const [load, setLoad] = useState(false)
    const [load2, setLoad2] = useState(false)
    const [load3, setLoad3] = useState(false)
    const [savings, setSavings] = useState([])
    const [selectedItem, setSelectedItem] = useState({})
    const [closeview, setCloseView] = useState(false)
    const [add, setAdd] = useState(false)
    const [topup, setTopup] = useState(false)
    const [adminBanks, setAdminBanks] = useState([])
    const [createsave, setCreateSave] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const [viewall, setViewAll] = useState(false)
    const profile = useSelector((state) => state.profile.profile)
    const currency = useSelector((state) => state.profile.currency)
    const dispatch = useDispatch()



    const fetchAdminBanks = useCallback(async () => {
        try {
            const res = await GetApi(Apis.auth.get_adminBanks)
            if (res.status !== 200) return;
            setAdminBanks(res.data)
        } catch (error) {
            errorMessage(error.message)
            console.log(error)
        }
    }, [])
    const fetchUserSavings = useCallback(async () => {
        try {
            const response = await GetApi(Apis.auth.user_savings)
            if (response.status !== 200) return;
            setSavings(response.data)
        } catch (error) {
            errorMessage(error.message)
        }
    }, [])

    useEffect(() => {
        fetchUserSavings()
        fetchAdminBanks()
    }, [])


    const fetchSavingsHistory = useCallback(async () => {
        try {
            const response = await GetApi(Apis.auth.all_savings)
            if (response.status === 200) {
                setRecords(response.data)
            } else {
                console.log(response.msg)
            }
        } catch (error) {
            errorMessage(error.message)
        }
    }, [])


    useEffect(() => {
        fetchSavingsHistory()
    }, [fetchSavingsHistory])

    const steps = [
        {
            step: 'Follow the deposit button to make a transfer.',
            img: <MdPayment />
        },
        {
            step: 'Contact customer support if there are no banks available.',
            img: <BiSupport />
        },
        {
            step: 'Upload a Photo of your transaction.',
            img: <MdAddAPhoto />
        },
        {
            step: 'Wait for confirmation, once confirmed your account will be credited.',
            img: <MdOutlineAvTimer />
        },
    ]


    const [saveForms, setSaveForms] = useState({
        name: '',
        goal: '',
        current: ''
    })

    const [proofForm, setProofForm] = useState({
        amount: ''
    })

    const handleChange = (e) => {
        setSaveForms({
            ...saveForms,
            [e.target.name]: e.target.value
        })
    }

    const createSavings = async (e) => {
        e.preventDefault()
        if (!saveForms.name) return errorMessage('Savings name is required')
        if (!saveForms.goal) return errorMessage('Savings goal is required')
        if (saveForms.current < 0 || saveForms.current === 0) return errorMessage(`Amount can not be negative or zero`)
        if (saveForms.current > profile?.balance) return errorMessage(`Insufficient balance`)
        const formdata = {
            goal: saveForms.goal.toLocaleString(),
            name: saveForms.name,
            current: saveForms.current.toLocaleString()
        }
        setLoad3(true)
        try {
            const response = await PostApi(Apis.auth.create_savings, formdata)
            if (response.status === 200) {
                successMessage(response.msg)
                setSaveForms({ ...saveForms, goal: '', name: '', current: '' })
                setCreateSave(false)
                fetchUserSavings()
                dispatch(dispatchProfile(response.user))
            } else {
                console.log(response.msg)
            }
        } catch (error) {
            errorMessage(error.message)
        } finally {
            setLoad3(false)
        }
    }


    const imgRef = useRef()
    const [proofimg, setProofimg] = useState({
        img: "",
        image: ''
    })

    const changeImage = (e) => {
        setProofimg({
            img: e.target.src,
            image: null
        })
    }

    // console.log(savings)
    const handleImage = (e) => {
        const file = e.target.files[0]
        if (file.size >= 1000000) {
            imgRef.current.value = null
            return errorMessage('file too large')
        }
        if (!file.type.startsWith(`image/`)) {
            imgRef.current.value = null
            return errorMessage('Invalid file format detected, try with a different photo format like ')
        }
        setProofimg({
            img: URL.createObjectURL(file),
            image: file
        })
    }

    useEffect(() => {
        if (proofDiv) {
            window.addEventListener('click', e => {
                if (proofDiv.current !== null && !proofDiv.current.contains(e.target)) {
                    setSupport(false)
                }
            }, true)
        }
    }, [])

    const submitForm = async (e) => {
        e.preventDefault()
        if (!proofForm.amount) return errorMessage(`Input amount is required to proceed`)
        if (proofForm.amount <= 0) return errorMessage(`No negative amount`)
        const formdata = new FormData()
        formdata.append('amount', proofForm.amount)
        formdata.append('image', proofimg.image)
        // return console.log(profile?.firstname)
        setLoad(true)
        try {
            const res = await PostApi(Apis.auth.deposit, formdata)
            if (res.status === 200) {
                setTimeout(() => {
                    setLoad(false)
                    setSupport(false)
                    successMessage('Transaction proof submitted')
                    setProofimg({
                        img: '',
                        image: null
                    })
                    setProofForm({
                        amount: ''
                    })
                }, 2000)
            } else {
                errorMessage(res.msg)
            }
        } catch (error) {
            errorMessage(error.message)
        }finally{
            setLoad(false)
        }

    }



    const selectItem = (items) => {
        setSelectedItem(items)
    }
    const goalReached = selectedItem.goal === selectedItem.current
    const [forms, setForms] = useState({
        id: selectedItem.id,
        amount: ''
    })
    const deposit = 'Deposit'
    const withdraw = 'Withdraw'

    const topUpSavings = async (e) => {
        e.preventDefault()

        if (forms.amount < 0) return errorMessage(`Amount can not be negative`)
        const formdata = {
            id: selectedItem.id,
            amount: forms.amount
        }
        // return  console.log(formdata)
        setLoad2(true)
        setTopup(false)
        try {
            const response = await PostApi(Apis.auth.topup, formdata)
            if (response.status === 200) {
                successMessage(response.msg)
                setCloseView(false)
                setForms({ ...forms, id: '', amount: '' })
                fetchUserSavings()
                fetchSavingsHistory()
                dispatch(dispatchProfile(response.user))
            }
        } catch (error) {
            console.log(error)
            errorMessage(error.message)
        } finally {
            setLoad2(false)

        }
    }

    useEffect(() => {
        if (!closeview) {
            setConfirm(false)
        }
    }, [closeview, setCloseView])


    const deletsavings = async (e) => {
        e.preventDefault()
        const formdata = {
            id: selectedItem.id
        }
        setConfirm(false)
        setLoad2(true)
        try {
            const response = await PostApi(Apis.auth.delete_savings, formdata)
            if (response.status === 200) {
                successMessage(response.msg)
                dispatch(dispatchProfile(response.user))
                setCloseView(false)
                setForms({ ...forms, id: '', amount: '' })
                fetchUserSavings()
            }
        } catch (error) {
            errorMessage(error.message)
        } finally {
            setLoad2(false)
        }
    }
    const withdrawsavings = async (e) => {
        e.preventDefault()
        const formdata = {
            id: selectedItem.id
        }
        setConfirm(false)
        setLoad2(true)
        try {
            const response = await PostApi(Apis.auth.withdraw_savings, formdata)
            if (response.status !== 200) return;
            successMessage(response.msg)
            dispatch(dispatchProfile(response.user))
            setCloseView(false)
            setForms({ ...forms, id: '', amount: '' })
            fetchUserSavings()
        } catch (error) {
            errorMessage(error.message)
        } finally {
            setLoad2(false)
        }
    }


    const checkTopup = () => {
        if (selectedItem.goal === selectedItem.current) return successMessage(`Savings goal reached already`)
        setTopup(prev => !prev)
    }


    const newCurr = useSelector((state) =>state.profile.newCurr)
    return (
        <div className={`w-11/12  mx-auto `}>

            {createsave &&
                <ModalLayout setModal={setCreateSave} clas={`lg:w-[60%] w-11/12 mx-auto`}>
                    <form onSubmit={createSavings} className="h-fit w-full relative bg-white rounded-lg p-10">

                        {load3 &&
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 ">
                                <Loader />
                            </div>
                        }
                        <div className="w-full flex items-start gap-5 flex-col ">
                            <div className="flex w-full lg:items-center flex-col lg:flex-row justify-between">
                                <div className="lg:w-[45%]">Savings Goal Name</div>
                                <FormComponent name={'name'} value={saveForms.name} onchange={handleChange} />
                            </div>
                            <div className="flex w-full lg:items-center flex-col lg:flex-row justify-between">
                                <div className="lg:w-[45%]">Goal Target</div>
                                <FormComponent formtype='phone' name={'goal'} value={saveForms.goal} onchange={handleChange} />
                            </div>
                            <div className="flex w-full lg:items-center flex-col lg:flex-row justify-between">
                                <div className="flex items-start lg:w-[45%]   flex-col">
                                    <div className="w-full">Amount to add </div>
                                    <div>Available bal: {profile?.currency === '?' ? newCurr : currency}{profile?.balance?.toLocaleString()}</div>
                                </div>
                                <FormComponent formtype='phone' name={'current'} value={saveForms.current} onchange={handleChange} />
                            </div>
                        </div>
                        <div className="lg:w-1/2 mx-auto mt-8">
                            <ButtonComponent disabled={load3 ? true : false} title={`Create Savings`} bg={`text-white bg-gradient-to-tr from-primary to-sec h-14 `} />
                        </div>
                    </form>
                </ModalLayout>
            }

            {support &&
                <ModalLayout setModal={setSupport} clas={`lg:w-[60%] w-11/12 mx-auto`}>
                    <div ref={proofDiv} className={`w-full p-10 rounded-lg bg-white h-fit `}>
                        <div className="w-full">
                            <form onSubmit={submitForm} className="lg:w-3/4 w-full mx-auto">
                                <div className="text-lg font-semibold text-primary">
                                    {adminBanks.length > 1 ? 'Make payment to any of these bank accounts below' : 'Make payment to this bank account below'}</div>
                                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {adminBanks.map((bank, i) => (
                                        <div className="flex items-start  flex-col gap-1  p-2 bg-primary text-white mb-5 rounded-md w-full " key={i}>
                                            <div className="text-base font-light gap-2 flex items-center">
                                                <div className="">Account Name:</div>
                                                <div className="">{bank.fullname}</div>
                                            </div>
                                            <div className="text-base font-light gap-2 flex items-center">
                                                <div className="">Bank Name:</div>
                                                <div className="">{bank.bank_name}</div>
                                            </div>
                                            <div className="text-base font-light gap-2 flex items-center">
                                                <div className="">Account No:</div>
                                                <div className="">{bank.account_no}</div>
                                            </div>
                                            {bank.route_no && <div className="text-base font-light gap-2 flex items-center">
                                                <div className="">Route:</div>
                                                <div className="">{bank.route_no}</div>
                                            </div>}
                                            {bank.swift && <div className="text-base font-light gap-2 flex items-center">
                                                <div className="">Swift No:</div>
                                                <div className="">{bank.route_no}</div>
                                            </div>}
                                            {bank.iban && <div className="text-base font-light gap-2 flex items-center">
                                                <div className="">IBAN No:</div>
                                                <div className="">{bank.route_no}</div>
                                            </div>}
                                        </div>
                                    ))}
                                </div>
                                <div className="my-3 flex items-center gap-3">
                                    <div className="">Amount Transfered:</div>
                                    <div className="w-2/4 ">
                                        <FormComponent name={`amount`} value={proofForm.amount} onchange={(e) => setProofForm({ ...proofForm, [e.target.name]: e.target.value })} formtype='phone' />
                                    </div>
                                </div>
                                <div className="mt-3 relative w-fit mx-auto">
                                    <label className={`${proofimg.img ? '' : 'border-2 border-black'} mt-5 w-full  h-full border-dashed flex cursor-pointer items-center justify-center `}>
                                        {proofimg.img ? <div className="">
                                            <div onChange={changeImage} className="absolute top-0 right-0 main font-bold ">
                                                <FaEdit className='text-2xl' />
                                            </div>
                                            <img src={proofimg.img} className='w-full h-48' />
                                        </div> :
                                            <div className="flex items-center gap-2 px-2">
                                                <FaPlus className='text-2xl' />
                                                <div className="">Upload proof of payment</div>
                                            </div>

                                        }
                                        <input type="file" onChange={handleImage} hidden ref={imgRef} />
                                    </label>
                                </div>
                                {proofimg.img &&
                                    <div className="w-full mt-5">
                                        <Formbutton label={load ?'...Submitting' :'Submit'} loading={load && true} />
                                    </div>

                                }
                            </form>
                        </div>

                    </div>
                </ModalLayout>
            }

            {closeview &&
                <ModalLayout setModal={setCloseView} clas={`lg:w-[60%] w-11/12 mx-auto`}>
                    <div className="w-full bg-white h-fit p-10 rounded-lg relative ">


                        {load2 &&
                            <div className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2">
                                <Loader />
                            </div>
                        }


                        {confirm &&
                            <div className="absolute top-1/4 left-1/2 bg-black/70 text-white p-10 h-fit w-2/4 rounded-md -translate-x-1/2">
                                <div className="text-center text-lg">{goalReached ? 'Confirm Withdrawal' : 'Are you sure you want to terminate?'}</div>
                                <div className="mt-5 flex items-center justify-between w-full">
                                    <button onClick={() => setConfirm(false)} className='w-fit px-4 py-1 rounded-md bg-red-500'>cancel</button>
                                    <button disabled={load2 ? true : false} onClick={goalReached ? withdrawsavings : deletsavings} className='w-fit px-4 py-1 rounded-md bg-green-500'>proceed</button>
                                </div>
                            </div>

                        }
                        <div className="grid grid-cols-1 ">
                            <div className="flex gap-2 justify-center items-center">
                                <Progress
                                    type="dashboard"
                                    steps={5}
                                    percent={selectedItem.percent}
                                    strokeColor="#003087"
                                    trailColor="rgba(0, 0, 0, 0.06)"
                                    strokeWidth={20} className='text-sm' />
                                <div className=" bg-white p-3 rounded-xl w-full text-sm">
                                    {/* <div className="border border-zinc-300 bg-white p-3 rounded-xl w-full text-sm"> */}
                                    <div className="border-b py-1 text-zinc-500 text-right">Savings name: <span className='text-xl font-bold text-primary capitalize'>{selectedItem.name}</span></div>
                                    <div className="border-b py-1">
                                        <div className=" text-right">Savings Goal</div>
                                        <div className="font-bold text-right text-primary">{profile?.currency === '?' ?newCurr : currency}{selectedItem.goal?.toLocaleString()}</div>
                                    </div>
                                    <div className="border-b py-1">
                                        <div className=" text-right">Currently Saved</div>
                                        <div className="font-bold text-right text-primary">{profile?.currency === '?' ?newCurr : currency}{selectedItem.current?.toLocaleString()}</div>
                                    </div>
                                    <div className="border-b py-1">
                                        <div className=" text-right">Last Saved</div>
                                        <div className="font-bold text-right text-primary">{selectedItem.lastsaved} </div>
                                    </div>
                                    <div onClick={() => setCloseView(false)} className="py-1 flex justify-end cursor-pointer">
                                        <div className='flex text-blue-600 items-center justify-end gap-2'>Close <FaArrowLeft /> </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={topUpSavings} className="mt-5 w-full flex flex-col md:flex-row items-center gap-4 justify-between">
                            <button type='button' onClick={checkTopup} className='font-bold w-fit px-4 py-2 underline text-primary'>{topup ? 'Close' : 'TopUp Savings'}</button>
                            {topup && <div className="flex items-center flex-col gap-1">
                                <div className="flex flex-col items-start">
                                    <div className="">Available Balance <span>{profile?.currency === '?' ?newCurr : currency}{profile?.balance?.toLocaleString()}</span></div>
                                    <FormComponent name={`amount`} value={forms.amount} onchange={(e) => setForms({ ...forms, [e.target.name]: e.target.value })} formtype='phone' />
                                </div>
                                <ButtonComponent disabled={load2 ? true : false} title={`Top Up`} bg={`bg-gradient-to-tr from-primary to-sec  mt-2 text-white text-white h-10`} />
                            </div>}
                        </form>
                        {!topup && <div className="mt-3 w-11/12 mx-auto">
                            <ButtonComponent
                                onclick={() => { setConfirm(true) }}
                                type='button'
                                title={`${goalReached ? 'Withdraw Savings' : 'Terminate Savings'}`}
                                bg={`${goalReached ? 'bg-green-600' : 'bg-red-600'}   text-white h-10`} />
                            <div className="">* Once terminated, the amount saved will be transferred back to your balance.</div>
                        </div>}
                    </div>
                </ModalLayout>
            }

            <div className="flex flex-col shadow-md md:mt-5 items-start bg-sec text-white justify-center h-fit py-5 mb-10 gap-10 ">
                <div className="md:w-3/4 w-full mx-auto h-full py-2 flex items-center justify-center flex-col px-3 rounded-lg  cursor-pointer">
                    <div className="text-lg font-semibold text-center lg:mb-3">Four (4) important steps to take in order to complete your deposit</div>
                    {steps.map((ele, i) => (
                        <ul className='w-full  flex items-center  gap-2 py-2 ' key={i}>
                            <li className='text-2xl'>{ele.img}</li>
                            <li>{ele.step}</li>

                        </ul>
                    ))}
                </div>
                <div onClick={() => setSupport(true)} className="w-fit cursor-pointer self-center  px-5 py-2 rounded-lg bg-white text-primary ">Deposit</div>
            </div>

            <div onClick={() => setCreateSave(true)} className=" mb-3 cursor-pointer w-fit ml-auto text-white bg-gradient-to-tr from-primary to-sec   px-3 py-2 rounded-md">Add New Savings</div>
            <div className={`grid grid-cols-1 ${savings.length === 0 ? 'lg:grid-cols-1' : 'lg:grid-cols-2'} gap-5 lg:gap-10`}>

                {savings.length > 0 ? savings.map((item, index) => (
                    <div key={index} className="flex gap-2 justify-center items-center">
                        <Progress
                            type="dashboard"
                            steps={5}
                            percent={item.percent}
                            strokeColor="#003087"
                            trailColor="rgba(0, 0, 0, 0.06)"
                            strokeWidth={20} />
                        <div className=" bg-white p-3 rounded-xl w-full text-sm">
                            {/* <div className="border border-zinc-300 bg-white p-3 rounded-xl w-full text-sm"> */}
                            <div className="border-b py-1 text-zinc-500 text-right"> Savings name: <span className='text-xl font-bold capitalize text-primary'>{item.name}</span> </div>
                            <div className="border-b py-1">
                                <div className=" text-right">Savings Goal</div>
                                <div className="font-bold text-right text-primary">{profile?.currency === '?' ?newCurr : currency}{item.goal?.toLocaleString()}</div>
                            </div>
                            <div className="border-b py-1">
                                <div className=" text-right">Currently Saved</div>
                                <div className="font-bold text-right text-primary">{profile?.currency === '?' ?newCurr : currency}{item.current?.toLocaleString()}</div>
                            </div>
                            <div className="border-b py-1">
                                <div className=" text-right">Last Saved</div>
                                <div className="font-bold text-right text-primary">{item.lastsaved} </div>
                            </div>
                            <Link onClick={() => setCloseView(true)} onMouseOver={() => selectItem(item)} className="py-1 flex justify-end cursor-pointer">
                                <div className='flex text-blue-600 items-center justify-end gap-2'>More <FaArrowRight /> </div>
                            </Link>
                        </div>
                    </div>
                )) :

                    <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-5">
                        {new Array(2).fill(0).map((ite, i) => (
                            <div className="flex gap-2 justify-center items-center w-full" key={i}>
                                <Progress
                                    type="dashboard"
                                    steps={5}
                                    percent={0}
                                    strokeColor="#003087"
                                    trailColor="rgba(0, 0, 0, 0.06)"
                                    strokeWidth={20} />
                                <div className=" bg-white p-3 rounded-xl w-full text-sm">
                                    {/* <div className="border border-zinc-300 bg-white p-3 rounded-xl w-full text-sm"> */}
                                    <div className="border-b py-1 text-zinc-500 text-right"> Savings name: <span className='text-xl font-bold capitalize text-primary'>Nil</span> </div>
                                    <div className="border-b py-1">
                                        <div className=" text-right">Savings Goal</div>
                                        <div className="font-bold text-right text-primary">Nil</div>
                                    </div>
                                    <div className="border-b py-1">
                                        <div className=" text-right">Currently Saved</div>
                                        <div className="font-bold text-right text-primary">Nil</div>
                                    </div>
                                    <div className="border-b py-1">
                                        <div className=" text-right">Last Saved</div>
                                        <div className="font-bold text-right text-primary">Nil </div>
                                    </div>
                                    {/* <Link className="py-1 flex justify-end cursor-pointer">
                        <div className='flex text-blue-600 items-center justify-end gap-2'>More <FaArrowRight /> </div>
                    </Link> */}
                                </div>
                            </div>
                        ))}
                    </div>

                }
            </div>


            <div className="mt-5 text-xl font-semibold">Latest Savings Transactions</div>
            <div className=" w-full bg-white shadow-lg pb-3">
                {Array.isArray(records) ? records.slice(0, 5).map((item, index) => (
                    <div className="rounded-xl border-b " key={index}>
                        {/* <div className="pl-2 pt-1"> {item.name}</div> */}
                        <div className="flex flex-col">
                            <div className="p-3 border-b last:border-none cursor-pointer">
                                <div className="flex items-center w-full justify-between">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-full p-1 bg-blue-300 text-blue-50">
                                                <div className="bg-blue-400 rounded-full p-1">
                                                    <IoIosMailUnread className='text-xl' />
                                                </div>
                                            </div>
                                            <div className="text-sm font-bold capitalize">{item.name}</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-sm">Amount</div>
                                            <div className={`text-base font-bold`}>{profile?.currency === '?' ?newCurr : currency}{item.goal?.toLocaleString()} </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center flex-col">
                                        <div className="text-sm">last saved</div>
                                        <div className="text-xs text-right">{item.lastsaved}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )) :
                    <div className="text-lg font-semibold text-center">No savings records found</div>
                }
                {records.length > 3 && <div onClick={() => setViewAll(true)} className="w-fit cursor-pointer ml-auto text-white px-4 py-1 my-5 rounded-md bg-gradient-to-tr from-primary to-sec mr-3">view all</div>}
            </div>


            {viewall &&

                <ModalLayout setModal={setViewAll} clas={`w-11/12 mx-auto lg:w-[70%]`}>
                    <div className=" w-full bg-white shadow-lg pb-3 rounded-md overflow-y-auto">
                        {Array.isArray(records) ? records.map((item, index) => (
                            <div className="rounded-xl border-b " key={index}>
                                {/* <div className="pl-2 pt-1"> {item.name}</div> */}
                                <div className="flex flex-col">
                                    <div className="p-3 border-b last:border-none cursor-pointer">
                                        <div className="flex items-center w-full justify-between">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="rounded-full p-1 bg-blue-300 text-blue-50">
                                                        <div className="bg-blue-400 rounded-full p-1">
                                                            <IoIosMailUnread className='text-xl' />
                                                        </div>
                                                    </div>
                                                    <div className="text-sm font-bold capitalize">{item.name}</div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="text-sm">Amount</div>
                                                    <div className={`text-xl font-bold`}>{profile?.currency === '?' ?newCurr : currency}{item.goal?.toLocaleString()} </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center flex-col">
                                                <div className="text-sm">last saved</div>
                                                <div className="text-xs text-right">{item.lastsaved}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) :
                            <div className="text-lg font-semibold text-center">No savings records found</div>
                        }
                        <div onClick={() => setViewAll(false)} className="w-fit cursor-pointer ml-auto text-white px-4 py-1 my-5 rounded-md bg-primary mr-3">close</div>
                    </div>
                </ModalLayout>
            }
            <div className="my-5">
                <SaveHistory />
            </div>
        </div>
    )
}

export default Savings