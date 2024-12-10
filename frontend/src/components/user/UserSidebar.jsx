import React, { useCallback, useEffect, useRef, useState } from 'react'
import { IoEyeOutline } from 'react-icons/io5'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Apis, GetApi, PostApi } from 'services/Api'
import { CookieName, errorMessage, successMessage } from 'utils/functions'
import ModalLayout from 'utils/ModalLayout'
import Cookies from 'js-cookie'
import { useDispatch, useSelector } from 'react-redux'
import { BsChevronDoubleDown } from "react-icons/bs";
import { dispatchCurrency, dispatchNewCurr, dispatchNotifications, dispatchProfile } from 'app/reducer'
import axios from 'axios'
import { FiRefreshCcw } from "react-icons/fi";
import { MdVerified } from "react-icons/md";
import logo from 'assets/logo.png'

const SideLinks = [
    { path: 'dashboard', url: '/user' },
    { path: 'deposit / save funds', url: '/user/deposits' },
    { path: ' withdrawal', url: '/user/withdrawals' },
    { path: ' linked accounts', url: '/user/linked_accounts' },
    { path: 'transactions', url: '/user/transactions' },
    { path: 'notifications', url: '/user/notifications' },
    { path: 'profile', url: '/user/profile' },
]

const TicketFolder = [
    {
        name: 'tickets',
        icon: <BsChevronDoubleDown />
    }
]
const ticketsArr = [
    { path: 'create tickets', url: 'create' },
    { path: 'active tickets', url: 'active' },
    { path: 'closed tickets', url: 'closed' },
]

const SideLinks2 = [
    { path: 'settings', url: '/user/settings' },
    { path: 'logout', url: '' },
]

export default function UserSidebar({ setOpenSide, smallView = false }) {
    const location = useLocation()
    const dispatch = useDispatch()
    const [viewall, setViewAll] = useState(false)
    const [logout, setLogout] = useState(false)
    const [hide, setHide] = useState(false)
    const [isRotating, setIsRotating] = useState(false)
    const navigate = useNavigate()
    const logOut = (item) => {
        if (item.path === 'logout') {
            setLogout(true)
        } else if (smallView) {
            setViewAll(false)
            setOpenSide(false)
        }
        else {
            setViewAll(false)
        }
    }

    const LogoutUser = async () => {
        try {
            const response = await PostApi(Apis.auth.logout)
            // console.log(response)
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


    const profile = useSelector((state) => state.profile.profile)
    const currency = useSelector((state) => state.profile.currency)

    const fetchUserProfile = useCallback(async () => {
        setIsRotating(true)
        try {
            const response = await GetApi(Apis.auth.profile);
            if (response.status === 200) {
                dispatch(dispatchProfile(response.data));
            } else {
                errorMessage(response.msg);
            }
        } catch (error) {
            errorMessage(error.message);
        } finally {
            setIsRotating(false)
        }
    }, [dispatch]);
    const fetchCurrency = async () =>{
        try {
            const response = await axios.get(`https://restcountries.com/v3.1/name/${profile?.country}`);
            if (response.data && response.data.length > 0) {
             if(profile?.country === 'china'){
                const countryData = response.data[2];
                const currencySymbol = Object.values(countryData.currencies)[0].symbol;
                dispatch(dispatchNewCurr(currencySymbol))
                // console.log(currencySymbol)
             }else{
                const countryData = response.data[0];
                const currencySymbol = Object.values(countryData.currencies)[0].symbol;
                dispatch(dispatchNewCurr(currencySymbol))
                console.log(currencySymbol)
             }
            } else {
              console.error('Unexpected response format:', response);
            }
          } catch (apiError) {
            console.error('Error fetching currency:', apiError);
          }
    }

   const newCurr = useSelector((state) =>state.profile.newCurr)

    useEffect(()=>{
          if(newCurr === null ) { fetchCurrency()}
    },[newCurr])


    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);


    let firstChar = profile?.firstname?.substring(0, 1)
    let lastChar = profile?.lastname?.substring(0, 1)

    const containerRef = useRef(null)


    const searchParams = new URLSearchParams(location.search);
   

    useEffect(() => {
        if (viewall && containerRef) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }, [viewall])

    const closeDiv = () => {
        setViewAll(false)
        setOpenSide(false)
    }

    const closeUp = () => {
        if (smallView) {
            setOpenSide(false)
        }
    }
    return (
        <div>
            <div className="flex flex-col  px-3 h-[90dvh]">
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
                <div className="bg-col rounded-lg p-3 flex flex-col items-center justify-center gap-3 mt-6 mb-5">
                    <div className="py-3 px-3.5 rounded-full text-white bg-gradient-to-tr from-primary to-sec w-fit h-fit uppercase">{firstChar}{lastChar}</div>
                    <div className="flex items-center gap-2">
                        <div className="text-white text-center capitalize text-sm">{profile?.firstname} {profile?.lastname}</div>
                        {profile?.kyc === 'verified' && <div className=""> <MdVerified className='text-primary text-lg' /></div>}
                    </div>
                    <div className="text-white items-center gap-2 font-bold text-xl flex justify-center">
                        <div onClick={fetchCurrency} className="">
                            <FiRefreshCcw className={`text-sm cursor-pointer ${isRotating ? 'rotating' : ''}`} />
                        </div>
                        <div className="flex items-center ">
                            <span>{profile?.currency === '?' ? newCurr : currency}</span>
                            <span>{hide ? '***' : profile?.balance?.toLocaleString()}</span>
                        </div>
                        <IoEyeOutline onClick={() => setHide(prev => !prev)} className='text-sm self-center ml-2 cursor-pointer' />
                    </div>
                </div>
                <div ref={containerRef} className={` ${viewall ? ' transition-all delay-500 h-[30rem]' : 'h-30rem'} scroll w-full overflow-y-auto overflow-x-hidden flex items-start  flex-col`}>
                    {SideLinks.map((item, index) => (
                        <Link to={item.url}
                            key={index}
                            onClick={closeDiv}
                            className={`text-sm rounded-lg w-full hover:scale-10 text-slate-200 hover:text-orange-200 ${item.url === location.pathname ? 'bg-col' : ''} hover:translate-x-2 px-3 mb-3 py-2 font-semibold capitalize transition-all`}>
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
                            to={`/user/tickets/status/${item.url}`}
                            onClick={closeUp}
                            key={index}
                            className={`text-sm rounded-lg  first:mt-2 w-full hover:scale-10 text-slate-200 hover:text-orange-200 ${`/user/tickets/status/${item.url}` === location.pathname ? 'bg-col' : ''} hover:translate-x-2 px-3 mb-3 py-2 font-semibold capitalize transition-all`}>
                            {item.path}
                        </Link>
                    ))}

                    <div className="flex flex-col w-full mt- mb-3">
                        {SideLinks2.map((item, index) => (
                            <Link to={item.url} onClick={() => logOut(item)} key={index}
                                className={`text-sm rounded-lg flex items-center justify-between  hover:scale-10 text-slate-200 ${item.url === location.pathname ? 'bg-col' : ''} hover:text-orange-200 px-3 mb-2 py-2 hover:translate-x-2 font-semibold capitalize transition-all`}>
                                <div className="">{item.path}</div>
                                <div className=""></div>
                            </Link>
                        ))}
                    </div>
                </div>
                
            </div>
            <div className="mt-2 w-11/12 mx-auto flex items-center justify-center flex-col   ">
                <div className="font-bold text-white"><span className='text-col'>Pine<span>rock</span></span> Credit Union</div>
                <div className="text-white">All rights reserved, 2024</div>
                </div>
        </div>
    )
}
