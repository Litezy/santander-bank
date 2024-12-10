import React, { useCallback, useEffect, useState } from 'react'
import { Apis, GetApi } from 'services/Api'
import { errorMessage, successMessage } from 'utils/functions'
import Loader from 'utils/Loader'
import Summary from './Summary'
import moment from 'moment'

const VerifiedTransfers = () => {

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({})
    const [load, setLoad] = useState(false)

    const TableHeaders = [
        "User",
        "Email",
        "Amount",
        "Status",
        "Date Created",
        "Date Completed",

    ]

    const fetchVerifications = useCallback(async () => {
        setLoad(true)
        try {
            const res = await GetApi(Apis.admin.completed_transfers)
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

    return (

        <div className="w-11/12 mx-auto mt-10">

            <div className="w-full flex items-center justify-between">
                <div className="lg:w-2/4 w-3/4 mx-auto">
                    <Summary color='bg-primary text-white' title={'Total Verified Transfers'} data={data.length} />
                </div>
            </div>

            <div>
                <div className="relative overflow-x-auto rounded-md mt-10">

                    <table className="w-full text-sm text-left rtl:text-right">
                        <thead className=" bg-primary text-xl text-white">
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
                                        {item.usertransfers.firstname} {item.usertransfers.lastname}
                                    </td>
                                    <td className="px-3 py-3">
                                        {item.usertransfers?.email}
                                    </td>
                                    <td className="px-3 py-3">
                                        {item.usertransfers?.currency}{item.amount}
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

export default VerifiedTransfers