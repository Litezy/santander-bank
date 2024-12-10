import { Box, LinearProgress } from '@mui/material';
import AdminSideBar from 'admin/adminComponents/AdminSideBar';
import { FaBars } from "react-icons/fa6";
import React, { useEffect, useRef, useState } from 'react'
import { GrClose } from "react-icons/gr";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Apis, PostApi } from 'services/Api';
import ModalLayout from 'utils/ModalLayout';
import { CookieName, errorMessage, successMessage } from 'utils/functions';
import Cookies from 'js-cookie';
import { BsChevronDoubleDown } from 'react-icons/bs';
import { useSelector } from 'react-redux';

export default function AdminLayout({ children,show=true }) {
    const profile = useSelector((state) => state.profile.profile)
    const [loading, setLoading] = useState(true)
    const [side, setSide] = useState(false)
    const [logout, setLogout] = useState(false)
    const [viewall, setViewAll] = useState(false)
    const sideDiv = useRef(null)
    const navigate = useNavigate()

    const Icon = side ? GrClose : FaBars
    React.useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 2000);
    }, [])
    const logOut = (item) => {
        if (item.path === 'logout') {
            setLogout(true)
            setSide(false)
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
    useEffect(() => {
        if (sideDiv) {
            window.addEventListener('click', e => {
                if (sideDiv.current !== null && !sideDiv.current.contains(e.target)) {
                    setSide(false)
                }
            }, true)
        }
    }, [])

    const SideLinks = [
        { path: 'overview', url: '/admin/overview' },
        { path: 'users', url: '/admin/users' },
        { path: 'transfers', url: '/admin/transfers' },
        { path: 'transactions', url: '/admin/transactions' },
        { path: 'pending transfers', url: '/admin/pending_transfers' },
        { path: 'verified transfers', url: '/admin/verified_transfers' },
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

    const SideLinks2 = [
        { path: 'logout', url: '' },
    ]
    const closeUp = () => {
        setSide(false)  
    }
    const location = useLocation()

    let firstChar = profile?.firstname?.substring(0, 1)
    let lastChar = profile?.lastname?.substring(0, 1)
   
    if(location.pathname.includes(`active_chats/chats`)){
        show=false
    }



    if (loading) return (
        <div>
            <div className="flex items-center h-screen">
                <div className="hidden lg:block w-[23%] bg-white border-r h-full pt-10">
                    {new Array(10).fill(0).map((ele, index) => (
                        <div className="bg-slate-200 h-14 mb-2 w-11/12 mx-auto rounded-lg" key={index}></div>
                    ))}
                </div>
                <div className="w-full ml-auto bg-slate-100 h-screen">
                    <div className="flex items-center justify-between bg-white p-3">
                        <div className="">
                            <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                            <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                            <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                        </div>
                    </div>
                    <div className="h-[91.1dvh] flex items-center w-4/5 max-w-xl mx-auto justify-center pb-10 overflow-y-auto">
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress />
                        </Box>
                    </div>
                </div>
            </div>
        </div>
    )
    return (
        <div>
            <div className={`flex items-center h-screen overflow-hidden `}>

                <div className="h-screen hidden lg:block lg:w-[30%] w-[35%] bg-gradient-to-tr from-primary to-sec text-white">
                    <AdminSideBar />
                </div>
                {show === true &&<div className="p-4 lg:hidden bg-gradient-to-tr from-primary to-sec text-white fixed z-50 w-full top-0 flex items-center justify-between">
                    <div onClick={() => setSide(prev => !prev)} className="">
                        <Icon className='text-3xl cursor-pointer' />
                    </div>
                    <div className="">Admin</div>
                </div>}
                {side &&
                    <div className="w-[55%] md:w-[35%] rounded-s-lg z-50 top-0   left-0 bg-gradient-to-tr from-primary to-sec h-screen fixed p-4">
                        <div className="bg-slate-100/20 rounded-lg p-3 flex flex-col items-center justify-center gap-3 mb-5">
                            <div className="py-3 px-3.5 rounded-full text-white bg-gradient-to-tr from-primary to-sec w-fit h-fit uppercase">{firstChar}{lastChar}</div>
                            <div className="text-white text-center capitalize text-sm">{profile?.firstname} {profile?.lastname}</div>

                        </div>
                        <div ref={sideDiv} className={` ${viewall ? ' transition-all delay-500 h-[20rem]' : 'h-[23rem]'} scroll w-full overflow-y-auto overflow-x-hidden flex items-start  flex-col`}>
                            {SideLinks.map((item, index) => (
                                <Link to={item.url}
                                    key={index}
                                    onClick={closeUp}
                                    className={`text-sm rounded-lg w-full hover:scale-10 text-slate-200 hover:text-orange-200 ${item.url === location.pathname ? 'bg-slate-100/40' : ''} hover:translate-x-2 px-3 mb-3 py-2 font-semibold capitalize transition-all`}>
                                    {item.path}
                                </Link>
                            ))}

                            {TicketFolder.map((item, index) => (
                                <div key={index}
                                    onClick={() => setViewAll(prev => !prev)}
                                    className={`text-sm mb-2 cursor-pointer  w-full hover:scale-10 flex items-center justify-between text-slate-200 hover:text-orange-200 ${viewall ? 'bg-slate-100/40 rounded-md' : ''} px-3  py-2 font-semibold capitalize transition-all`}>
                                    <div className="">{item.name}</div>
                                    <div className="animate-bounce"> {item.icon} </div>
                                </div>
                            ))}
                            {viewall && ticketsArr.map((item, index) => (
                                <Link
                                    to={`/admin/tickets/${item.url}`}
                                    onClick={closeUp}
                                    key={index}
                                    className={`text-sm rounded-lg  first:mt-2 w-full hover:scale-10 text-slate-200 hover:text-orange-200 ${(`/admin/tickets/${item.url}`) === location.pathname ? 'bg-slate-100/40' : ''} hover:translate-x-2 px-3 mb-3 py-2 font-semibold capitalize transition-all`}>
                                    {item.path}
                                </Link>
                            ))}
                            {SideLinks2.map((item, index) => (
                                <Link to={item.url} onClick={() => logOut(item)} key={index}
                                    className={`text-sm rounded-lg flex items-center justify-between  hover:scale-10 text-slate-200 ${item.url === location.pathname ? 'bg-slate-100/40' : ''} hover:text-orange-200 px-3 mb-2 py-2 hover:translate-x-2 font-semibold capitalize transition-all`}>
                                    <div className="">{item.path}</div>
                                    <div className=""></div>
                                </Link>
                            ))}


                        </div>
                    </div>
                }
                {logout &&
                    <ModalLayout setModal={setLogout} clas={`lg:w-[35%] w-11/12 mx-auto`}>
                        <div className="bg-white py-5 px-3 h-fit flex-col text-black rounded-md flex items-center justify-center">
                            <div className="text-xl font-semibold self-center">Confirm Logout</div>
                            <div className="flex items-center justify-between w-full">
                                <button onClick={() => setLogout(false)} className='w-fit text-white px-4 py-2 rounded-lg bg-red-500'>cancel</button>
                                <button onClick={LogoutUser} className='w-fit text-white px-4 py-2 rounded-lg bg-green-500'>confirm</button>
                            </div>
                        </div>
                    </ModalLayout>
                }
                <div className={`${show === true && 'slate-50 mt-[8rem] overflow-y-auto'} h-screen w-full mt-0 lg:mt-0  overflow-x-hidden`}>
                    <div className={`${show === true && 'overflow-y-auto pb-20'} bg-slate-50 h-[100dvh]  overflow-x-hidden `}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
