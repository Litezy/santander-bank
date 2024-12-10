import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import { IoReturnUpBackOutline } from 'react-icons/io5'
import { Apis, GetApi, profileImg } from 'services/Api'
import { errorMessage } from 'utils/functions'
import ModalLayout from 'utils/ModalLayout'

const SettledDeposits = ({ setScreen }) => {

    const [deposits, setDeposits] = useState([])
    const [modal,setModal] = useState({id:'',status:false,img:''})

    const fetchDepos = useCallback(async () => {
        try {
            const res = await GetApi(Apis.admin.settled_depos)
            if (res.status === 200) {
                setDeposits(res.data)
                // console.log(res.data)
            } else {
                errorMessage(res.msg)
            }
        } catch (error) {
            console.log(error)
            errorMessage(error.message)
        }
    })
    useEffect(() => {
        fetchDepos()
    }, [])


    const openModal = (param)=>{
        setModal({id:param.id, status:true,img:param.image})
        // console.log(param.id)
    }
    return (
        <div className="w-11/12 mx-auto">

    {
        modal.status && 
        <ModalLayout clas={`w-11/12 mx-auto lg:w-[60%]`} setModal={setModal}>
         <div className="w-full bg-white rounded-md h-fit p-5 flex items-center justify-center">
            <img src={`${profileImg}/deposits/${modal.img}`} alt={`desposit image ${modal.id} `} />
         </div>
        </ModalLayout>
    }

            <div className="w-full flex items-center justify-between">
                <div onClick={() => setScreen(0)} className="w-fit cursor-pointer mr-auto bg-primary text-white px-3 py-1 rounded-md">
                    <IoReturnUpBackOutline className='text-2xl' />
                </div>
                <div className="text-lg font-semibold">Settled Deposits</div>
            </div>
            <div className="my-3 text-2xl font-bold text-center">Settled Deposits</div>
            <div className="relative overflow-x-auto rounded-md mt-10">
                <table className="w-full text-sm text-left rtl:text-right">
                    <thead className=" bg-primary text-xl text-white">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                User
                            </th>
                            <th scope="col" className="px-6 py-3">
                                amount
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Transaction ID
                            </th>
                            <th scope="col" className="px-6 py-3 truncate">
                                Date Submitted
                            </th>
                            <th scope="col" className="px-6 py-3 truncate">
                                Date Settled
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Image
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {deposits.length > 0 ? deposits.map((item, i) => (
                            <tr className="bg-white border-b " key={i}>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                    {item.userdeposits?.firstname}  {item.userdeposits?.lastname}
                                </th>
                                <td className="px-6 py-4">
                                    {item.userdeposits.currency}{item.amount}
                                </td>
                                <td className={`px-6 py-4 font-semibold ${item.status === 'complete' ?'text-green-500':'text-red-600'}`}>
                                   {item.status}
                                </td>
                                <td className={`px-6 py-4 font-semibold `}>
                                   {item.transid}
                                </td>
                                <td className="px-6 py-4">
                                    {moment(item.createdAt).format(`DD-MM-YYYY hh:mm A`)}
                                </td>
                                <td className="px-6 py-4">
                                    {moment(item.updatedAt).format(`DD-MM-YYYY hh:mm A`)}
                                </td>
                                <td className="px-6 py-4">
                                 <button onClick={()=> openModal(item)} className='p-2 border truncate bg-primary text-white rounded-md'>view image</button>
                                </td>

                            </tr>
                        )) :
                            <tr className=" w-full text-lg font-semibold flex items-center justify-center">No deposits to validate</tr>
                        }

                    </tbody>
                </table>


            </div>

        </div>
    )
}

export default SettledDeposits