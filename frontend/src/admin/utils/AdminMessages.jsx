import { dispatchMessages } from 'app/reducer'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Apis, GetApi, profileImg } from 'services/Api'
import ChatForm from 'utils/ChatForm'
import ChatMessages from 'utils/ChatMessages'
import { errorMessage, MoveToBottom } from 'utils/functions'
import { FaLongArrowAltLeft } from "react-icons/fa";
import Loader from 'utils/Loader'
import { FaUser } from 'react-icons/fa6'

const AdminMessages = () => {

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [tickets, setTickets] = useState({})
  const [chatform, setChatform] = useState(false)
  const location = useLocation()
  const { id } = useParams()
  // console.log(id)
  const dispatch = useDispatch()

  const fecthticketMessages = useCallback(async () => {
    setLoading(true)
    try {
      const res = await GetApi(`${Apis.admin.get_one_msg}/${id}`)
      // console.log(res.data)
      if (res.status !== 200) errorMessage(res.msg)
      setMessages(res.data?.ticketmessages)
      setTickets(res.data)
      dispatch(dispatchMessages(res.data?.ticketmessages))
      MoveToBottom()
    } catch (error) {
      errorMessage(`something went wrong in fetching messages.`, error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fecthticketMessages()
    MoveToBottom()
    if(location.pathname.includes(`closed_chats/chats`)){
      setChatform(true)
    }
  }, [])

  

  return (
    <div className=' w-full mx-auto lg:h-screen h-[100dvh] flex items-center justify-center'>
      <div className="mb-5 w-full mx-auto md:w-11/12 bg-white  h-[100dvh] relative flex-col rounded-lg flex items-start justify-between">

        {loading &&
          <div className="absolute top-0  backdrop-blur-sm w-full h-full rounded-md left-1/2 -translate-x-1/2">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-fit p-5 rounded-md bg-white"><Loader /></div>
          </div>
        }

        <div className="h-[10dvh] py-2 w-full border-b flex items-center px-5 justify-between">
          <Link
            className='w-fit px-3 py-1 rounded-md bg-gradient-to-tr from-primary to bg-purple-700 text-white'
            to={chatform ? `/admin/tickets/closed_chats` : `/admin/tickets/active_chats`}
          >
            <FaLongArrowAltLeft />
          </Link>

          <div className="flex items-center gap-3">
            <FaUser className='text-xl' />
            <div className="capitalize text-base">{tickets?.usertickets?.firstname ? ` ${tickets?.usertickets?.firstname} ${tickets?.usertickets?.lastname}` : 'No support staff joined'}</div>

          </div>

        </div>
        <div className="lg:h-[78dvh] h-[88dvh] overflow-y-auto w-full py-1 scroll  downdiv ">
          <div className="text-sm text-slate-500 font-semibold text-left ml-3">Ticket Details</div>
          <div
            className={`${tickets?.message?.length || tickets?.subject?.length <= 90 ? 'w-fit' : 'w-[55%]'} relative text-sm  border px-4 mt-1  mr-auto bg-gradient-to-tr bg-slate-300  py-2 flex items-start flex-col gap-2  rounded-md ml-2`}>
            <div className="flex items-start gap-1">
              <div className="">Subject:</div>
              <div className="">{tickets?.subject}</div>
            </div>
            <div className="flex items-start gap-1">
              <div className="">Message:</div>
              <div className="">{tickets?.message}</div>
            </div>
          </div>
          <div className="text-sm text-slate-500 font-semibold text-left ml-3 mt-3">Image</div>
          <div className="text-left ml-3 w-10/12 mb-3 mr-auto">
            {tickets?.image ?
              <img
                src={`${profileImg}/tickets/${tickets?.image}`}
                className='w-fit object-fill'
                alt="ticketimg" /> :
              <div className="text-sm">No image attached</div>
            }
          </div>
          {tickets?.joined === 'true' && <div className="my-2 w-fit px-5 py-2 border-slate-300 border mx-auto  rounded-lg ">you joined this chat</div>}
          <ChatMessages />
        </div>
        <div className="lg:h-[12dvh] h-[10dvh] border-t py-1 w-full ">
        {!chatform && <ChatForm ticketid={tickets?.id} fetchMsgs={() => fecthticketMessages()} />}
        </div>
      </div>
    </div>
  )
}



export default AdminMessages