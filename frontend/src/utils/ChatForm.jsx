import React, { useEffect, useRef, useState } from 'react'
import { FaPlus, FaRegPaperPlane, FaRegSmile } from 'react-icons/fa'
import { IoSend } from "react-icons/io5";
import { errorMessage, MoveToBottom } from './functions';
import { Apis, PostApi } from 'services/Api';
import { useSelector } from 'react-redux';


const ChatForm = ({ ticketid, admin_res = false, fetchMsgs,fetchActives,setJoined }) => {

    const textRef = useRef(null)
    const refDiv = useRef(null)
    const [text, setText] = useState('')
    const [icon, setIcon] = useState(false)
    const profile = useSelector((state) => state.profile.profile)



    useEffect(() => {
        if (refDiv) {
            window.addEventListener('click', (e) => {
                if (refDiv.current !== null) {
                    if (refDiv.current.contains(e.target)) {
                    } else {
                        setIcon(false)
                    }
                }
            }, true)
        }
    }, [])

    // const roomid = useSelector((state) => state.data.roomid)
    const SubmitContent = async () => {
        if (text.length > 0 && !admin_res) {
            const formdata = {
                message: text,
                id: ticketid
            }
            // return console.log(formdata)
            try {
                const res = await PostApi(Apis.auth.send_msg, formdata)
                if (res.status !== 200) return errorMessage(res.msg)
                setText('')
                setTimeout(() => {
                    fetchMsgs()
                    MoveToBottom()
                }, 100)
            } catch (error) {
                errorMessage(`error in sending message`, error.message)
            }
        }
        else if (text.length > 0 && admin_res) {
            const formdata = {
                message: text,
                id: ticketid
            }
            //   return console.log(formdata)
            try {
                const res = await PostApi(Apis.admin.admin_response, formdata)
                if (res.status !== 200) return errorMessage(res.msg)
                setText('')
                setTimeout(() => {
                    fetchActives()
                    setJoined(false)
                }, 100)
            } catch (error) {
                errorMessage(error.message)
            }

        }
    }
    return (
        <div className='text-black relative flex h-[8dvh] my-2 '>
            <div className="flex items-center w-[95%]   pt-1 mx-auto">
                <textarea
                    ref={textRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className='scroll md:h-16 min-h-[15px] h-14 ml-auto pt-3 md:pt-5 border-2 rounded-md w-10/12 outline-none pl-2  resize-none' placeholder='Message'>

                </textarea>
                <button
                    onClick={SubmitContent}
                    className={`text-2xl  w-fit px-3 py-2 rounded-md bg-gradient-to-tr from-primary to-sec text-white`}>
                    <IoSend />
                </button>
            </div>

        </div>
    )
}


export default ChatForm