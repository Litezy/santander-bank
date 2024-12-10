import React, { useCallback, useEffect, useState } from 'react'
import Summary from './Summary'
import { Apis, GetApi, PostApi, profileImg } from 'services/Api'
import { errorMessage, successMessage } from 'utils/functions'
import moment from 'moment'
import Loader from 'utils/Loader'
import { useNavigate } from 'react-router-dom'
import ModalLayout from 'utils/ModalLayout'

const VerifiedCardWithdrawals = () => {
    
    const TableHeaders = [
        "User",
        "Email",
        "Amount",
        "Status",
        "Date Created",
        "Date Verified"
    ]
        const [data, setData] = useState([])
        const [confirm, setConfirm] = useState(false)
        const navigate = useNavigate()
        const [id, setId] = useState(``)
        const [loading, setLoading] = useState(false)
    
    
        const fetchwithdrawals = useCallback(async () => {
            try {
                const res = await GetApi(Apis.admin.all_card_complete)
                if (res.status !== 200) return ;
                setData(res.data)
            } catch (error) {
                console.log(error)
                errorMessage(`sorry, error in fetching verified card withdrawals`, error)
            }
        })
    
        useEffect(() => {
            fetchwithdrawals()
        }, [])
    
    
       
    
       
    
        return (
            <div className='w-11/12  mx-auto'>
                <div className="w-full flex items-center justify-between">
                    <div className="lg:w-2/4 w-3/4 mx-auto">
                        <Summary color='bg-sec text-white' title={'Total Verified Card Withdrawals'} data={data?.length} />
                    </div>
                </div>
                <div className="relative overflow-x-auto rounded-md mt-10">
                    <table className="w-full text-sm text-left rtl:text-right">
                        <thead className=" bg-sec text-xl text-white">
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
                                        {moment(item.createdAt).format('DD-MM-YYYY hh:mm A')}
                                    </td>
                                    <td className="px-3 py-3">
                                        {moment(item.updatedAt).format('DD-MM-YYYY hh:mm A')}
                                    </td>
                                   
                                </tr>
                            )) :
                                <tr className=" w-full text-lg truncate font-semibold flex items-center justify-center">
                                    No verified card withdrawals found
                                </tr>
                            }
    
                        </tbody>
                    </table>
    
                </div>
    
            </div>
        )
  
}

export default VerifiedCardWithdrawals