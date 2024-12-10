import React, { useCallback, useEffect, useState } from 'react'
import Summary from './Summary'
import { Apis, GetApi, PostApi } from 'services/Api'
import { errorMessage, successMessage } from 'utils/functions'
import moment from 'moment'
import Loader from 'utils/Loader'
import { useNavigate } from 'react-router-dom'
import ModalLayout from 'utils/ModalLayout'

const PendingCardWithdrawals = () => {

    const TableHeaders = [
        "User",
        "Email",
        "Amount",
        "Status",
        "Beneficiary",
        "Date Created",
        "Complete Withdrawal"
    ]
    const [data, setData] = useState([])
    const [confirm, setConfirm] = useState(false)
    const navigate = useNavigate()
    const [id, setId] = useState(``)
    const [loading, setLoading] = useState(false)

    const fetchwithdrawals = useCallback(async () => {
        try {
            const res = await GetApi(Apis.admin.all_card_pendings)
            console.log(res)
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


    const Modal = (id) => {
        setConfirm(true)
        setId(id)
    }

    const ConfirmTransfer = async () => {
        setConfirm(false)
        if (!id || id === '') return errorMessage(`ID is missing`)
        const data = {
            id: id
        }
        setLoading(true)
        try {
            const res = await PostApi(Apis.admin.confirm_card_withdrawal, data)
            if (res.status !== 200) return errorMessage(res.msg)
            successMessage(res.msg)
            await new Promise((resolve, reject) => setTimeout(resolve, 2000))
            navigate(`/admin/verified_card_withdrawals`)
        } catch (error) {
            errorMessage(`error in confirming card withdrawal`, error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='w-11/12  mx-auto'>
            <div className="w-full flex items-center justify-between">
                <div className="lg:w-2/4 w-3/4 mx-auto">
                    <Summary color='bg-col text-white' title={'Total Pending Card Withdrawals'} data={data?.length} />
                </div>
            </div>

            {confirm &&
                <ModalLayout setModal={setConfirm} clas={`w-10/12 mx-auto lg:w-[40%]`}>
                    <div className="w-full rounded-lg lg:px-10 p-5 bg-white ">
                        <div className="w-full text-center">Are you you want to confirm this withdrawal?</div>
                        <div className="mt-5 flex items-center justify-between">
                            <button onClick={() => setConfirm(false)} className='text-white w-fit px-3 py-1 rounded-md bg-red-500'>cancel</button>
                            <button onClick={ConfirmTransfer} className='text-white w-fit px-3 py-1 rounded-md bg-green-500'>proceed</button>
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
                                    {item.card_withdraws?.email}
                                </td>
                                <td className="px-3 py-3">
                                    {item.card_withdraws?.currency}{item.amount}
                                </td>
                                <td className="px-3 py-3">
                                    {item.status}
                                </td>
                                <td className="px-3 py-3">
                                    {item.name}
                                </td>
                                <td className="px-3 py-3">
                                    {moment(item.createdAt).format('DD-MM-YYYY hh:mm A')}
                                </td>
                                <td className="px-3 py-3">
                                    <button onClick={() => Modal(item.id)}
                                        className='bg-col text-white w-fit px-3 py-1 rounded-md'>complete</button>
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