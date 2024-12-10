import React, { useCallback, useEffect, useState } from 'react'
import { Apis, GetApi } from 'services/Api'
import { errorMessage } from './functions'
import { useSelector } from 'react-redux'
import moment from 'moment'
import Loader from './Loader'

const SaveHistory = () => {

    const [savings, setSavings] = useState([])
    const profile = useSelector((state) => state.profile.profile)
    const [loading, setLoading] = useState(false)
    const TableHeaders = [
        "Savings Name",
        "Savings Target",
        "Amount Saved",
        "Status",
        "Start Date",
        "End Date"

    ]

    const fetchSavings = useCallback(async () => {
        setLoading(true)
        try {
            const res = await GetApi(Apis.auth.save_history)
            if (res.status !== 200) return;
            setSavings(res.data)
        } catch (error) {
            errorMessage(error.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchSavings()
    }, [])
    const newCurr = useSelector((state) => state.profile.newCurr)
    return (
        <div className='w-full'>
            <div className="text-xl font-bold mb-1">Savings History</div>
            <div className="relative overflow-x-auto rounded-md ">
                <table className="w-full text-sm text-left rtl:text-right relative">
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
                        {savings.length > 0 ? savings.map((item, i) => (
                            <tr className="bg-white border-b " key={i}>
                                <td className="px-3 py-3 truncate">
                                    {item.name}
                                </td>
                                <td className="px-3 py-3">
                                    {profile?.currency === '?' ?newCurr : profile?.currency}{item.goal.toLocaleString()}
                                </td>
                                <td className="px-3 py-3">
                                    {profile?.currency === '?' ?newCurr : profile?.currency}{item.current.toLocaleString()}
                                </td>
                                <td className={`px-3 py-3 text-white `}>
                                    <p className={`rounded-md py-1 px-3 text-center ${item.status === 'complete' ? 'bg-green-600' : 'bg-red-600'}`}>
                                        {item.status}
                                    </p>

                                </td>
                                <td className="px-3  py-3 truncate">
                                    {moment(item.createdAt).format('DD-MM-YYYY')}
                                </td>
                                <td className="px-3 py-3 truncate">
                                    {moment(item.updatedAt).format('DD-MM-YYYY')}
                                </td>

                            </tr>
                        )) :
                            <tr className=" w-full text-lg font-semibold flex items-center justify-center">
                                <td>No savings history found</td>
                            </tr>
                        }

                    </tbody>
                </table>

            </div>
        </div>
    )
}

export default SaveHistory