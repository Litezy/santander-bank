import React, { useCallback, useEffect, useState } from 'react'
import { Apis, GetApi, PostApi } from 'services/Api'
import { errorMessage, successMessage } from 'utils/functions'
import Loader from 'utils/Loader'
import Summary from './Summary'
import moment from 'moment'
import ModalLayout from 'utils/ModalLayout'
import ReverseModal from 'utils/ReverseModal'

const ReverseWithdrawals = () => {

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({})
    const [load, setLoad] = useState(false)
    const [state, setState] = useState({ firtstep: false, secondstep: false })
    const [modal, setModal] = useState(false)
    const [selected, setSelected] = useState({})

    const TableHeaders = [
        "User",
        "Email",
        "Amount",
        "Status",
        "Reverse",

    ]

    const [message, setMessage] = useState({ msg: '' })

    const fetchVerifications = useCallback(async () => {
        setLoad(true)
        try {
            const res = await GetApi(Apis.admin.confirmed_withdrawals)
            if (res.status !== 200) return errorMessage(res.msg)
            setData(res.data)
        } catch (error) {
            // console.log(error)
            errorMessage(`sorry, error in fetching transfers`, error)
        } finally {
            setLoad(false)
        }
    })

    useEffect(() => {
        fetchVerifications()
    }, [])


    const selectOne = () => {
        setState({ ...state, firtstep: true, })
        setModal(true)
    }

    const secondOp = () => {
        if (!message.msg) return errorMessage('Reversal message is required')
        setState({ firtstep: false, secondstep: true })
    }

    const CancelReverse = () => {
        setState({ status: false })
        setModal(false)
        setMessage({ ...message, msg: '' })
    }
    const ProceedReverse = async () => {
        if (!message.msg) return errorMessage('Reversal message is missing')
        const formdata = {
            id: selected?.id,
            message: message.msg,
            tag: selected?.type ? 'card' : 'bank'
        }
        setLoading(true)
        try {
            const res = await PostApi(Apis.admin.reverse_funds,formdata)
            if (!res.status === 200) return errorMessage(res.msg)
            successMessage(res.msg)
            fetchVerifications() 
            await new Promise(resolve => setTimeout(resolve, 2000));   
            setModal(false)
            setState({firtstep: false, secondstep: false})
            setSelected({})
            setMessage({
                msg:''
            })
        } catch (error) {
            errorMessage(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleMsg = (e) => {
        setMessage({
            ...message,
            [e.target.name]: e.target.value
        })
    }


    return (

        <div className="w-11/12 mx-auto mt-10">

            {modal && state.firtstep &&

                <ModalLayout clas={`w-11/12 mx-auto w-[70%]`} setModal={setModal}>
                    <div className="lg:w-1/2 mx-auto h-fit bg-white rounded-md p-8">
                        <div className="mb-5 text-center font-bold text-xl">Message for reversal</div>

                        <textarea name='msg' value={message.msg} onChange={handleMsg} className='w-11/12 min-h-24  p-2 rounded-md border-2'></textarea>
                        <div className="w-11/12 mx-auto flex items-center justify-center">
                            <button onClick={secondOp} className='mt-5 bg-sec text-white px-2 py-1.5 rounded-md'>Proceed</button>
                        </div>
                    </div>


                </ModalLayout>
            }
            {modal && state.secondstep &&

                <ModalLayout clas={`w-11/12 mx-auto w-[70%]`} setModal={setModal}>
                    <div className="lg:w-1/2 mx-auto h-fit bg-white rounded-md p-8">

                        {loading && 
                        <div className="w-full flex items-center justify-center h-full"><Loader /></div>
                        }
                        <div className="mb-5 text-center font-bold text-xl">Reverse and send message</div>
                        <div className="flex items-center w-10/12 mx-auto justify-between">
                            <button disabled={loading ? true : false} onClick={CancelReverse} className={`text-base bg-red-500 ${loading && ' cursor-not-allowed'} text-white rounded-md py-1.5 px-2`}>Cancel</button>
                            <button disabled={ loading ? true :false} onClick={ProceedReverse} className={`text-base bg-green-500 text-white rounded-md py-1.5 px-2 ${loading && ' cursor-not-allowed'}`}>Proceed</button>
                        </div>
                    </div>
                </ModalLayout>
            }

            <div className="w-full flex items-center justify-between">
                <div className="lg:w-2/4 w-3/4 mx-auto">
                    <Summary color='bg-red-500 text-white' title={'Total Verified Transfers'} data={data.length} />
                </div>
            </div>

            <div>
                <div className="relative overflow-x-auto rounded-md mt-10">

                    <table className="w-full text-sm text-left rtl:text-right">
                        <thead className=" bg-red-500 text-xl text-white">
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
                                            {item.name ? item.name : item.acc_name}
                                        </td>
                                        <td className="px-3 py-3">
                                            {item.usertransfers?.email ? item.usertransfers?.email : item.card_withdraws?.email}
                                        </td>
                                        <td className="px-3 py-3">
                                            {item.usertransfers?.currency ? item.usertransfers?.currency : item.card_withdraws?.currency}{item.amount}
                                        </td>
                                        <td className="px-3 py-3">
                                            {item.status}
                                        </td>

                                        <td className="px-3 py-3">
                                            <button onMouseOver={()=> setSelected(item)} onClick={selectOne} className='p-2 rounded-md bg-red-500 text-white'>reverse</button>
                                        </td>
                                    </tr>
                            
                            )) :
                                <tr className="bg-white border-b ">
                                    <td className="px-3 py-3 truncatex">
                                        No verified transactions data found!
                                    </td>


                                </tr>
                            }

                        </tbody>
                    </table>


                </div>

            </div>
        </div>
    )
}

export default ReverseWithdrawals