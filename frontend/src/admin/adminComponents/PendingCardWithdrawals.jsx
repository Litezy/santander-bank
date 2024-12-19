import React, { useCallback, useEffect, useState } from 'react'
import Summary from './Summary'
import { Apis, GetApi, PostApi, profileImg } from 'services/Api'
import { errorMessage, successMessage } from 'utils/functions'
import moment from 'moment'
import Loader from 'utils/Loader'
import { useNavigate } from 'react-router-dom'
import ModalLayout from 'utils/ModalLayout'
import Forminput from 'utils/Forminput'
import { useSelector } from 'react-redux'

const PendingCardWithdrawals = () => {

    const TableHeaders = [
        "User",
        "Amount",
        "Current Charge(%)",
        "Current Progress(%)",
        "Current Reason",
        "Date Created",
        "Details"
    ]
    const [data, setData] = useState([])
    const [confirm, setConfirm] = useState(false)
    const [show, setShow] = useState(false)
    const [proofimages, setProofImages] = useState([])
    const [selected, setSelected] = useState({})
    const [loading, setLoading] = useState(false)
    const [showproofs, setShowProofs] = useState(false)

    const fetchwithdrawals = useCallback(async () => {
        try {
            const res = await GetApi(Apis.admin.all_card_pendings)
            if (res.status !== 200) return;
            setData(res.data)
        } catch (error) {
            console.log(error)
            errorMessage(`sorry, error in fetching pending card withdrawals`, error)
        }
    })

    useEffect(() => {
        fetchwithdrawals()
    }, [])


    const Modal = (item) => {
        setShow(true)
        let proofImages = [];
        try {
            proofImages = JSON.parse(item.proof);
            setProofImages(proofImages)
        } catch (error) {
            console.error("Error parsing proof images:", error);
        }
        setSelected(item)
    }

    const [forms, setForms] = useState({
        progress: '',
        fee: '',
        reason:''
    })

    const ConfirmTransfer = async () => {
        setConfirm(false)
        if (!selected?.id || selected?.id === '') return errorMessage(`ID is missing`)
        if (!forms.fee || !forms.progress || !forms.reason) return errorMessage("All fields can't be empty")
        const data = {
            id: selected?.id,
            fee: forms.fee,
            progress: forms.progress,
            reason: forms.reason,
        }
        setLoading(true)
        try {
            const res = await PostApi(Apis.admin.update_progress, data)
            if (res.status !== 200) return errorMessage(res.msg)
            successMessage(res.msg)
            setForms({ ...forms, fee: '', progress: '', reason: '' })
            fetchwithdrawals()
            setShow(false)
            await new Promise((resolve, reject) => setTimeout(resolve, 1000))
        } catch (error) {
            errorMessage(`error in confirming card withdrawal`, error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setForms({
            ...forms,
            [e.target.name]: e.target.value
        })
    }
    useEffect(() => {
        if (!show) {
            setShowProofs(false)
        }
    }, [show])

    return (
        <div className='w-11/12  mx-auto'>
            <div className="w-full flex items-center justify-between">
                <div className="lg:w-2/4 w-3/4 mx-auto">
                    <Summary color='bg-col text-white' title={'Total Pending Card Withdrawals'} data={data?.length} />
                </div>
            </div>

            {show &&
                <ModalLayout setModal={setShow} clas={`w-10/12 mx-auto lg:w-[80%] `}>

                    <div className={`w-full rounded-lg p-5 ${showproofs ? 'bg-white/50' : 'bg-white'} relative`}>
                        <div className="w-full flex items-center flex-col gap-5">
                            <div className={`${showproofs ? 'text-white' : 'text-col'} capitalize text-lg`}>Proof of payment(s)</div>
                            {showproofs &&
                                <div className="w-full">
                                    <div className="w-full grid gr-cols-1 md:grid-cols-2 gap-5">
                                        {proofimages.map((img, i) => {
                                            return (
                                                <div key={i} className="w-full">
                                                    <img src={`${profileImg}/cardwithdraws/${selected?.card_withdraws.firstname}/ID_${selected?.transid}/${img}`} alt={`proof ${i + 1}`} className='w-full h-fit' />
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div className="w-full mt-4 flex items-center justify-center">
                                        <button className='w-fit px-5 py-2 rounded-md bg-primary text-white' onClick={() => setShowProofs(false)}>Close</button>
                                    </div>

                                </div>
                            }
                            {proofimages.length > 0 ?
                                !showproofs &&
                                <button className='w-fit px-5 py-2 rounded-md bg-primary text-white' onClick={() => setShowProofs(true)}>Show Proofs</button> :
                                <div className="">No proof submitted yet!</div>

                            }
                            {!showproofs &&
                                <div className="md:w-8/12 w-10/12 mx-auto rounded-lg lg:px-10 p-5 bg-white  ">
                                    <div className="flex w-full flex-col  gap-3">
                                        <div className="flex items-center flex-col lg:flex-row gap-3">
                                        <div className="flex items-center flex-col gap-2 w-full ">
                                            <div className="">Increment progress</div>
                                            <input className='lg:w-1/3 w-1/2  pl-2 outline-none border h-10 rounded-md py-2 ' type={`number`} name={`progress`} value={forms.progress} onChange={handleChange} />
                                        </div>
                                        <div className="flex items-center flex-col gap-2 w-full ">
                                            <div className="">Increment Charge Fee (%)</div>
                                            <input className='lg:w-1/3 w-1/2  pl-2 outline-none border h-10 rounded-md py-2 ' type={`number`} name={`fee`} value={forms.fee} onChange={handleChange} />
                                        </div>
                                        </div>
                                        <div className="flex items-center flex-col gap-2 w-full ">
                                            <div className="">Update Reason</div>
                                            <textarea className='w-full  p-2 max-h-40 min-h-20 outline-none border h-10 rounded-md py-2 ' type={`text`} name={`reason`} value={forms.reason} onChange={handleChange} />
                                        </div>
                                    </div>
                                    {!confirm && <div className="mt-5 flex items-center justify-between">
                                        <button onClick={() => setShow(false)} className='text-white w-fit px-3 py-1 rounded-md bg-red-500'>cancel</button>
                                        <button onClick={() => setConfirm(true)} className='text-white w-fit px-3 py-1 rounded-md bg-green-500'>proceed</button>
                                    </div>}

                                    {confirm &&
                                        <div className="w-11/12 lg:w-8/12 absolute top-10 left-1/2 rounded-md text-white bg-black/70 backdrop-blur-md -translate-x-1/2 h-fit p-5">
                                            <div className="text-center w-full">Confirm Increment</div>
                                            <div className="mt-5 flex items-center justify-between">
                                                <button onClick={() => setConfirm(false)} className='text-white w-fit px-3 py-1 rounded-md bg-red-500'>decline</button>
                                                <button onClick={ConfirmTransfer} className='text-white w-fit px-3 py-1 rounded-md bg-green-500'>confirm</button>
                                            </div>
                                        </div>

                                    }
                                </div>}
                        </div>
                    </div>
                </ModalLayout>
            }

            {loading &&
                <div className="fixed top-0 z-50 backdrop-blur-sm w-full h-full rounded-md left-1/2 -translate-x-1/2">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-fit p-5 rounded-md bg-white"><Loader /></div>
                </div>
            }

            <div className="relative overflow-x-auto rounded-md mt-10">
                <table className="w-full text-sm text-left rtl:text-right">
                    <thead className=" bg-col text-xl text-white">
                        <tr>
                            {TableHeaders.map((item, index) => (
                                <th scope="col" key={index} className="px-3 py-3 text-sm truncate">
                                    {item}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? data.map((item, i) => (
                            <tr className="bg-white border-b " key={i}>
                                <td className="px-3 py-3">
                                    {item.card_withdraws.firstname} {item.card_withdraws.lastname}
                                </td>
                                
                                <td className="px-3 py-3">
                                    {item.card_withdraws?.currency}{item.amount}
                                </td>
                                <td className="px-3 py-3">
                                    {item.fee}%
                                </td>
                                <td className="px-3 py-3">
                                    {item.progress}%
                                </td>
                                <td className="px-3 py-3">
                                    {item.reason}
                                </td>
                                <td className="px-3 py-3">
                                    {moment(item.createdAt).format('DD-MM-YYYY hh:mm A')}
                                </td>
                                <td className="px-3 py-3">
                                    <button onClick={() => Modal(item)}
                                        className='bg-col text-white w-fit px-3 py-1 rounded-md'>view more</button>
                                </td>

                            </tr>
                        )) :
                            <tr className=" w-full text-lg truncate font-semibold flex items-center justify-center">
                                No card withdrawals found
                            </tr>
                        }

                    </tbody>
                </table>

            </div>

        </div>
    )
}



export default PendingCardWithdrawals