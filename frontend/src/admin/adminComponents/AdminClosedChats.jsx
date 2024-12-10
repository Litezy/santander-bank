import React, { useCallback, useEffect, useState } from 'react'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { errorMessage } from 'utils/functions'
import { Apis, GetApi } from 'services/Api'
import { Link } from 'react-router-dom'

const AdminClosedChats = () => {

    const profile = useSelector((state) => state.profile.profile)
    const [loading, setLoading] = useState(false)
    const [selected,setSelected] = useState({})
    const [closedArr,setClosedArr] = useState([])
    const [msg,setMsg]= useState(false)

    const fetchClosedMesage = useCallback(async ()=>{
        setLoading(true)
        try {
            const res = await GetApi(Apis.admin.all_closed_tickets)
            if(res.status !== 200) return errorMessage(res.msg)
                setClosedArr(res.data)
        } catch (error) {
           errorMessage(`error in fethcing closed messages`, error.message) 
        } finally{
            setLoading(false)
        }
    },[])

    useEffect(()=>{
        fetchClosedMesage()
    },[])

    const TableHeaders = [
        "Ticket ID",
        "User",
        "Ticket Subject",
        "Ticket Status",
        "Date Created",
        "Date Closed",
        "Past Msgs",
    ]

    return (
        <div className='w-11/12 flex items-center justify-center mx-auto h-fit py-5'>

            <div className=" w-full bg-white rounded-md shadow-md h-fit p-5">
                <div className=" text-xl font-bold">Closed Tickets</div>
                <hr className='my-2' />
                <div className="my-5">You have {closedArr && closedArr.length > 0 ? `${closedArr.length} closed ticket(s), see them below.` : '0 active tickets.'}</div>


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
                                {closedArr.length > 0 ? closedArr.map((item, i) => (
                                    <tr className="bg-white border-b " key={i}>
                                        <td className="px-3 py-3">
                                            {item.id}
                                        </td>
                                        <td className="px-3 truncate py-3">
                                            {item?.usertickets?.firstname} {item?.usertickets?.lastname}
                                        </td>
                                        <td className="px-3 truncate py-3">
                                            {item.subject}
                                        </td>
                                        <td className="px-3 py-3">
                                            {item.status}
                                        </td>
                                        <td className="px-3  py-3 truncate">
                                            {moment(item.createdAt).format('DD-MM-YYYY hh:mm A')}
                                        </td>
                                        <td className="px-3  py-3 truncate">
                                            {moment(item.updatedAt).format('DD-MM-YYYY hh:mm A')}
                                        </td>
                                        <td className="px-3  py-3 truncate">
                                            <Link 
                                            onMouseOver={()=> setSelected(item)} 
                                            onClick={() => setMsg(true)}
                                            to={`/admin/tickets/closed_chats/chats/${item.id}`}
                                                className='trucate w-fit px-3 py-1 rounded-md bg-gradient-to-tr from-primary to-sec text-white'>view messages</Link>
                                        </td>
                                    </tr>
                                )) :
                                    <tr className=" w-full text-lg font-semibold truncate flex items-center justify-center">
                                        <td>No closed tickets found</td>
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

export default AdminClosedChats