import React, { useCallback, useEffect, useState } from 'react'
import { IoReturnUpBackOutline } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import { Apis, GetApi } from 'services/Api'
import moment from 'moment'
import { errorMessage } from 'utils/functions'

const ApprovedKycs = () => {
   
    const [users,setUsers] = useState([])
    const [loading,setLoading] = useState(false)

    const fetchKYCs = useCallback(async () => {
        setLoading(true)
        try {
            const response = await GetApi(Apis.admin.verified_kycs)
            // console.log(response.data)
            if (response.status !== 200) return errorMessage(response.msg)
            setUsers(response.data)
        } catch (error) {
            errorMessage(error.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchKYCs()
    }, [])

    const TableHeaders = [
        "User ID",
        "Full Name",
        "Date Submitted",
        "View details",
    ]

    return (
        <div className="w-11/12 mx-auto mt-5">
            <div className="w-full flex items-center justify-between">
                <Link to={`/admin/kycs`}
                    className="w-fit cursor-pointer mr-auto bg-primary text-white px-3 py-1 rounded-md">
                    <IoReturnUpBackOutline className='text-2xl' />
                </Link>
                <div className="text-lg font-semibold">Verified Kyc's</div>
            </div>

            <div className="relative overflow-x-auto rounded-md mt-10">
                    <table className="w-full text-sm text-left rtl:text-right">
                        <thead className=" bg-black lg:text-xl text-base text-white">
                            <tr >
                                {TableHeaders.map((item, index) => (
                                    <th scope="col" key={index} className="px-3 py-3 text-sm truncate">
                                        {item}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? users.map((item, i) => (
                                <tr className="bg-white border-b " key={i}>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                        {item.id}
                                    </th>

                                    <td className="px-3 truncate py-3">
                                        {item?.userkycs?.firstname} {item?.userkycs?.lastname}
                                    </td>
                                    <td className="px-3 truncate py-3">
                                        {moment(item?.createdAt).format(`DD-MM-YYYY hh:mm A`)}
                                    </td>
                                    <td className="px-3 py-3">
                                    <Link to={`/admin/kycs/verified/${item.id}`}
                                        className="bg-gradient-to-tr truncate from-primary to-sec text-white px-5 rounded-lg py-2">view details</Link>
                                    </td>
                                </tr>
                            )) :
                                <tr className=" w-full truncate text-lg font-semibold flex items-center justify-center">
                                    <td>No verified Kyc's found</td>
                                </tr>
                            }

                        </tbody>
                    </table>


                </div> 
        </div>
    )
}

export default ApprovedKycs