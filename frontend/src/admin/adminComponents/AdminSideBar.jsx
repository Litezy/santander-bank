
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ModalLayout from 'utils/ModalLayout'
import Cookies from 'js-cookie'
import { useDispatch } from 'react-redux'
import { Apis, GetApi, PostApi } from 'services/Api'
import { CookieName, errorMessage, successMessage } from 'utils/functions'
import { dispatchProfile } from 'app/reducer'
import { BsChevronDoubleDown } from 'react-icons/bs'

const AdminLinks = [
    { path: 'overview', url: '/admin/overview' },
    { path: 'users', url: '/admin/users' },
    { path: 'transfers', url: '/admin/transfers' },
    { path: 'transactions', url: '/admin/transactions' },
    { path: 'pending bank withdrawals', url: '/admin/pending_transfers' },
    { path: 'verified bank withdrawals', url: '/admin/verified_transfers' },
    { path: 'pending card withdrawals', url: '/admin/pending_card_withdrawals' },
    { path: 'verified card withdrawals', url: '/admin/verified_card_withdrawals' },
    { path: 'reverse transfers', url: '/admin/reverse_transfers' },
    { path: 'banks', url: '/admin/banks' },
    { path: 'newsletters', url: '/admin/newsletters' },
    { path: 'contacts', url: '/admin/contacts' },
    { path: 'user kycs', url: '/admin/kycs' },
   
]
const TicketFolder = [
    {
        name: 'tickets',
        icon: <BsChevronDoubleDown />
    }
]
const ticketsArr = [
    { path: 'active tickets', url: 'active_chats' },
    { path: 'closed tickets', url: 'closed_chats' },
]

const AdminLinks2 = [
    { path: 'logout', url: '' },
]

export default function AdminSideBar({setSide}) {
    const location = useLocation()
    const dispatch = useDispatch()
    const [viewall, setViewAll] = useState(false)
    const [logout, setLogout] = useState(false)
    const [profile, setProfile] = useState({})

    const navigate = useNavigate()
    const logOut = (item) => {
        if (item.path === 'logout') {
            setLogout(true)
        }
    }

    const LogoutUser = async () => {
        try {
            const response = await PostApi(Apis.auth.logout)
            console.log(response)
            if (response.status === 200) {
                successMessage(response.msg)
                Cookies.remove(CookieName)
                navigate('/login')
            } else {
                errorMessage(response.msg)
            }
        } catch (error) {
            return errorMessage(error.message)
        }
    }

    const fetchUserProfile = useCallback(async () => {
        try {
            const response = await GetApi(Apis.auth.profile);
            if (response.status === 200) {
                setProfile(response.data);
                dispatch(dispatchProfile(response.data));
            } else {
                errorMessage(response.msg);
            }
        } catch (error) {
            errorMessage(error.message);
        }
    }, [dispatch]);
    useEffect(() => {
        fetchUserProfile()
    }, [fetchUserProfile])

    let firstChar = profile?.firstname?.substring(0, 1)
    let lastChar = profile?.lastname?.substring(0, 1)

    // console.log(location.pathname)
    return (
        <div>
            <div className="flex flex-col px-3">
                {logout &&
                    <ModalLayout setModal={setLogout} clas={`w-[35%] mx-auto`}>
                        <div className="bg-white py-5 px-3 h-fit flex-col text-black rounded-md flex items-center justify-center">
                            <div className="text-xl font-semibold self-center">Confirm Logout</div>
                            <div className="flex items-center justify-between w-full">
                                <button onClick={() => setLogout(false)} className='w-fit text-white px-4 py-2 rounded-lg bg-red-500'>cancel</button>
                                <button onClick={LogoutUser} className='w-fit text-white px-4 py-2 rounded-lg bg-green-500'>confirm</button>
                            </div>
                        </div>
                    </ModalLayout>
                }
                <div className="bg-col rounded-lg p-3 flex flex-col items-center justify-center gap-3 mt-6 mb-5">
                    <div className="py-3 px-3.5 rounded-full text-white bg-gradient-to-tr from-primary to-sec w-fit h-fit uppercase">{firstChar}{lastChar}</div>
                    <div className="text-white text-center capitalize text-sm">Admin {profile?.firstname} {profile?.lastname}</div>

                </div>

                <div className={` ${viewall ? ' transition-all delay-500 h-[28rem]' : 'h-[25rem]'} scroll w-full overflow-y-auto overflow-x-hidden flex items-start  flex-col`}>
                    {AdminLinks.map((item, index) => (
                        <Link to={item.url} key={index} className={`text-sm last:hidden w-full  rounded-lg hover:scale-105 hover:text-orange-200 text-slate-200 hover:translate-x-2 font-semibold ${item.url === location.pathname ? 'bg-col' : ''} px-3 mb-1 py-2 font-extralight capitalize transition-all`}>
                            {item.path}
                        </Link>
                    ))}


                    {TicketFolder.map((item, index) => (
                        <div key={index}
                            onClick={() => setViewAll(prev => !prev)}
                            className={`text-sm mb-2 cursor-pointer  w-full hover:scale-10 flex items-center justify-between text-slate-200 hover:text-orange-200 ${viewall ? 'bg-col rounded-md' : ''} px-3  py-2 font-semibold capitalize transition-all`}>
                            <div className="">{item.name}</div>
                            <div className="animate-bounce"> {item.icon} </div>

                        </div>
                    ))}
                    {viewall && ticketsArr.map((item, index) => (
                        <Link
                            to={`/admin/tickets/${item.url}`}
                            // onClick={closeUp}
                            key={index}
                            className={`text-sm rounded-lg  first:mt-2 w-full hover:scale-10 text-slate-200 hover:text-orange-200 ${(`/admin/tickets/${item.url}`) === location.pathname ? 'bg-col' : ''} hover:translate-x-2 px-3 mb-2 last:mb-0 py-2 font-semibold capitalize transition-all`}>
                            {item.path}
                        </Link>
                    ))}

                    {AdminLinks2.map((item, index) => (
                        <Link to={item.url} onClick={() => logOut(item)} key={index} className="text-sm rounded-lg hover:scale-105 text-slate-200 hover:translate-x-2 w-full font-semibold hover:text-orange-200 px-3 py-2  capitalize transition-all">
                            {item.path}
                        </Link>
                    ))}



                </div>


            </div>

        </div>
    )
}


