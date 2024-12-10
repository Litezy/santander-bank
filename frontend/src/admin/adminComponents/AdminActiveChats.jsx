import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Apis, GetApi, PostApi } from 'services/Api'
import ChatForm from 'utils/ChatForm'
import { errorMessage, successMessage } from 'utils/functions'
import Loader from 'utils/Loader'
import ModalLayout from 'utils/ModalLayout'

const AdminActiveChats = () => {
    const profile = useSelector((state) => state.profile.profile)
    const navigate = useNavigate()
    const [actives, setActives] = useState({})
    const [joinedmsg, setJoinedMsg] = useState(false)
    const [loading, setLoading] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const [selected, setSelected] = useState({})

    const fetchActiveChats = useCallback(async () => {
        try {
            const res = await GetApi(Apis.admin.all_active_tickets)
            if (res.status !== 200) return;
            setActives(res.data)
        } catch (error) {
            errorMessage(error.message)
        }
    }, [])

    useEffect(() => {
        fetchActiveChats()
    }, [])


    const TableHeaders = [
        "Ticket ID",
        "User",
        "Ticket Subject",
        "Ticket Status",
        "Date Created",
        "Response",
        "Messages",
        "Close Ticket"
    ]

    const closeChats = async () => {
        // if (!selected.id) return errorMessage(`ID is missing`)
        const id = selected
        setLoading(true)
        try {
            const res = await PostApi(`${Apis.admin.close_ticket}/${id}`)
            if (res.status !== 200) return errorMessage(res.msg)
            successMessage(res.msg)
            setTimeout(() => {
                navigate(`/admin/tickets/closed_chats`)
            }, 1000)
        } catch (error) {
            errorMessage(error.message)
        } finally { setLoading(false) }
    }



    return (
        <div className='w-11/12 flex items-center justify-center mx-auto h-fit py-5'>

            {joinedmsg &&
                <ModalLayout setModal={setJoinedMsg} clas={`lg:w-[60%] mx-auto w-11/12`}>
                    <div className="w-full bg-white rounded-lg p-10 ">

                        {loading &&
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 z-40">
                                <Loader />
                            </div>
                        }
                        <div className="my-4 text-center">Send first message, you can say hi and continue with messages to view the ticket details</div>
                        <ChatForm admin_res={true} fetchActives={() => fetchActiveChats()} setJoined={setJoinedMsg} ticketid={selected?.id} />
                    </div>
                </ModalLayout>
            }
            {confirm &&
                <ModalLayout setModal={setConfirm} clas={`lg:w-[60%] mx-auto w-11/12`}>
                    <div className="w-full bg-white rounded-lg p-5 ">

                        {loading &&
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 z-40">
                                <Loader />
                            </div>
                        }
                        <div className="text-center font-semibold">Are you sure you want to close chats?</div>
                        <div className="flex items-center justify-between w-full my-5">
                            <button onClick={() => setConfirm(false)} className='text-white py-2 px-3 rounded-md bg-red-600 w-fit'>cancel</button>
                            <button onClick={closeChats} className='text-white px-3 py-2 rounded-md bg-green-500 w-fit'>proceed</button>
                        </div>
                    </div>
                </ModalLayout>
            }

            <div className=" w-full bg-white rounded-md shadow-md h-fit p-5">
                <div className=" text-xl font-bold">Active Tickets</div>
                <hr className='my-2' />
                <div className="my-5">You have {actives && actives.length > 0 ? `${actives.length} tickets to attend to, see them below.` : '0 active tickets.'}</div>
                <div className='w-full'>
                    <div className="relative overflow-x-auto rounded-md ">
                        <table className="w-full text-sm text-left rtl:text-right relative">
                            <thead className=" bg-gradient-to-tr from-primary to-sec text-xl text-white">
                                <tr>
                                    {TableHeaders.map((item, index) => (
                                        <th scope="col" key={index} className="px-3 py-3 text-sm truncate">
                                            {item}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {actives.length > 0 ? actives.map((item, i) => (
                                    <tr className="bg-white border-b last:border-none " key={i}>
                                        <td className="px-3 py-3">
                                            {item.id}
                                        </td>
                                        <td className="px-3 py-3 truncate">
                                            {item?.usertickets?.firstname}  {item?.usertickets?.lastname}
                                        </td>
                                        <td className="px-3 py-3">
                                            {item.subject}
                                        </td>
                                        <td className="px-3 py-3">
                                            {item.status}
                                        </td>
                                        <td className="px-3  py-3 truncate">
                                            {moment(item.createdAt).format('DD-MM-YYYY hh:mm A')}
                                        </td>
                                        <td className="px-3  py-3 truncate">
                                            <button>{item.joined === 'true' ? 'true' : 'false'}</button>
                                        </td>
                                        {item.joined === 'true' && <td className="px-3  py-3 truncate">
                                            <Link to={`/admin/tickets/active_chats/chats/${item.id}`}
                                                className='trucate w-fit px-3 py-1 rounded-md bg-gradient-to-tr from-primary to-sec text-white'>open messages</Link>
                                        </td>}
                                        {item.joined === 'false' && <td className="px-3  py-3 truncate">
                                            <button onMouseOver={() => setSelected(item)} onClick={() => setJoinedMsg(true)}
                                                className='trucate w-fit px-3 py-1 rounded-md bg-gradient-to-tr from-primary to-sec text-white'>send first message</button>
                                        </td>}
                                        <td className="px-3  py-3 truncate">
                                            <button onMouseOver={() => setSelected(item.id)} onClick={() => setConfirm(true)}
                                                className='trucate w-fit px-3 py-1 rounded-md bg-red-600 text-white'>close ticket</button>
                                        </td>
                                    </tr>
                                )) :
                                    <tr className=" w-full text-lg font-semibold flex items-center justify-center">
                                        No active tickets found
                                    </tr>
                                }

                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminActiveChats