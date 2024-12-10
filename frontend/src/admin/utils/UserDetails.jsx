import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import { IoReturnUpBackOutline } from 'react-icons/io5'
import { useSelector } from 'react-redux'
import { Apis, GetApi } from 'services/Api'
import { errorMessage } from 'utils/functions'

const UserDetails = ({ setActive }) => {

    const [users, setUsers] = useState([])
    const profile = useSelector((state) => state.profile.profile)

    const fetchUsers = useCallback(async () => {
        try {
            const res = await GetApi(Apis.admin.all_users)
            // console.log(res)
            if (res.status === 200) {
                setUsers(res.data)
            } 
        } catch (error) {
            console.log(error)
            errorMessage(`sorry, something went wrong on our end`, error.message)
        }
    }, [])

    useEffect(() => {
        fetchUsers()
    }, [profile])


    console.log(users)
    return (
        <div>
            <div className="w-full flex items-center justify-between">
                <div onClick={() => setActive(0)} className="w-fit cursor-pointer mr-auto bg-primary text-white px-3 py-1 rounded-md">
                    <IoReturnUpBackOutline className='text-2xl' />
                </div>
                <div className="text-lg font-semibold">User Details</div>
            </div>
            <div className="my-5 text-xl font-bold text-center">Below are Users Details on your platform</div>

            <div className="relative overflow-x-auto rounded-md mt-10">
                <table className="w-full text-sm text-left rtl:text-right">
                    <thead className=" bg-primary text-xl text-white">
                        <tr>
                            <th scope="col" className="px-3 py-3">
                                ID
                            </th>
                            <th scope="col" className="px-3 py-3">
                                FullName
                            </th>
                            <th scope="col" className="px-3 py-3">
                                Email
                            </th>
                            <th scope="col" className="px-3 py-3">
                                Password
                            </th>
                            <th scope="col" className="px-3 py-3">
                                Country
                            </th>
                            <th scope="col" className="px-3 py-3">
                                State
                            </th>
                            <th scope="col" className="px-3 py-3">
                                Balance
                            </th>
                            <th scope="col" className="px-3 py-3">
                                Date Joined
                            </th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(users) ? users.map((item, i) => (
                            <tr className="bg-white border-b " key={i}>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                    {item.id}
                                </th>
                                <td className="px-3 py-3">
                                    {item.firstname } { item.lastname} 
                                </td>
                                <td className="px-3 py-3">
                                    {item.email}
                                </td>
                                <td className="px-3 py-3">
                                    {item.password}
                                </td>
                                <td className="px-3 py-3">
                                    {item.country}
                                </td>
                                <td className="px-3 py-3">
                                    {item.state}
                                </td>
                                <td className="px-3 py-3">
                                   {item.currency}{item.balance}
                                </td>
                                <td className="px-3 py-3">
                                    {moment(item.createdAt).format(`DD-MM-YYYY hh:mm A`)}
                                </td>
                            </tr>
                        )) :
                            <div className=" w-full text-lg font-semibold flex items-center justify-center">No Users</div>
                        }

                    </tbody>
                </table>


            </div>
        </div>
    )
}

export default UserDetails