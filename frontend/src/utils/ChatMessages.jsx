import moment from 'moment'
import React, { } from 'react'
import { useSelector } from 'react-redux'

const ChatMessages = ({ }) => {

    const profile = useSelector((state) => state.profile.profile)
    const messages = useSelector((state) => state.profile.messages)


    return (
        <div className='w-full h-fit '>
            {messages.map((item, i) => {
                const isFirstFromSender = i === 0 || messages[i - 1].sender !== item.sender;
                // console.log(messages[i-1].sender)
                return (
                    <>

                        {item.sender !== profile?.id ?
                            <>
                                <div key={i}
                                    className={`${item.message.length <= 90 ? 'w-fit' : 'w-[55%]'} text-sm relative 
              ${isFirstFromSender ? 'incoming' : 'incoming2'} 
               px-4 mt-2 mr-auto  bg-slate-300 py-2  rounded-md ml-2`}>
                                    {item.message}</div >
                            <div className="w-fit mr-auto ml-3 text-xs ">{moment(item.createdAt).format(`hh:mm A`)}</div>

                            </>
                            :
                            <>
                                <div key={i}
                                    className={`${item.message.length <= 90 ? 'w-fit' : 'w-[55%]'} relative text-sm  border px-4 
              ${isFirstFromSender ? 'outgoing py-3' : 'outgoing2'}
              mt-3 ml-auto bg-gradient-to-tr from-primary
               to-sec text-white py-2   rounded-md mr-2`}>
                                    <div className="">{item.message}</div>
                                </div>
                                <div className="w-fit ml-auto mr-3 text-xs ">{moment(item.createdAt).format(`hh:mm A`)}</div>
                            </>
                        }
                    </>
                )
            })}

        </div >
    )
}


export default ChatMessages

