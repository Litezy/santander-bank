import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import { IoReturnUpBackOutline } from 'react-icons/io5'
import { useSelector } from 'react-redux'
import { Apis, GetApi, PostApi } from 'services/Api'
import Formbutton from 'utils/Formbutton'
import { errorMessage, successMessage } from 'utils/functions'
import ModalLayout from 'utils/ModalLayout'

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
    }, [])

    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState({})
    const [amount, setAmount] = useState({
        amt: ''
    })

    const Modal = (item) => {
        setSelected(item)
        setShow(true)
    }

    const handleChange = (e) => {
        setAmount({
            ...amount,
            [e.target.name]: e.target.value
        })
    }

    const UpdateFee = async (e) => {
        e.preventDefault()
        if (!selected?.id || selected?.id === '') return errorMessage('User ID is missing')
        if (!amount.amt) return errorMessage('Fee to update is missing')
        const formdata = {
            id: selected?.id,
            fee: amount.amt
        }
        setLoading(true)
        try {
            const res = await PostApi(Apis.admin.update_charge_fee, formdata)
            if (res.status !== 200) return errorMessage(res.msg)
            successMessage(res.msg)
            setSelected({})
            setShow(false)
            setAmount({amt:""})
            fetchUsers()
            await new Promise((resolve, reject) => setTimeout(resolve, 1000))
        } catch (error) {
            errorMessage(`Error in updating fee ${error.message}`)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div>
            <div className="w-full flex items-center justify-between">
                <div onClick={() => setActive(0)} className="w-fit cursor-pointer mr-auto bg-primary text-white px-3 py-1 rounded-md">
                    <IoReturnUpBackOutline className='text-2xl' />
                </div>
                <div className="text-lg font-semibold">User Details</div>
            </div>
            <div className="my-5 text-xl font-bold text-center">Below are Users Details on your platform</div>


            {show &&
                <ModalLayout setModal={setShow} clas={`w-10/12 mx-auto lg:w-[50%] `}>
                    <div className="w-full p-5 bg-white rounded-lg flex items-center justify-center">
                        <form onSubmit={UpdateFee} className="w-full flex items-center flex-col gap-2">
                            <div className="">Update {selected?.firstname} {selected?.lastname}'s Charge Fee({selected?.currency})</div>
                            <input
                                className='w-1/3 lg:w-1/4 pl-2 outline-none border h-10 rounded-md py-2 '
                                type={`number`} name={`amt`} value={amount.amt} onChange={handleChange}
                            />
                            <div className="w-11/12 md:w-1/2 mx-auto">
                                <Formbutton  label={'Update'} color={false} loading={loading ? true : false} />
                            </div>
                        </form>
                    </div>

                </ModalLayout>

            }



            <div className="relative overflow-x-auto rounded-md mt-10">
                <table className="w-full text-sm text-left rtl:text-right">
                    <thead className=" bg-primary text-sm text-white">
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
                                Card Fee
                            </th>
                            <th scope="col" className="px-3 py-3">
                                Balance
                            </th>
                            <th scope="col" className="px-3 py-3">
                                Date Joined
                            </th>
                            <th scope="col" className="px-3 py-3">
                                Update Card Fee
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(users) ? users.map((item, i) => (
                            <tr className="bg-white border-b truncate " key={i}>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                    {item.id}
                                </th>
                                <td className="px-3 py-3">
                                    {item.firstname} {item.lastname}
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
                                    {item.currency}{item.charge}
                                </td>
                                <td className="px-3 py-3">
                                    {item.currency}{item.balance}
                                </td>
                                <td className="px-3 py-3">
                                    {moment(item.createdAt).format(`DD-MM-YYYY hh:mm A`)}
                                </td>
                                <td className="px-3 py-3">
                                    <button onClick={() => Modal(item)} className='w-fit px-3 py-1 rounded-md text-white bg-primary'>change</button>
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