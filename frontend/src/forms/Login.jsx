import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CookieName, errorMessage, successMessage, UserRole } from 'utils/functions'
import Cookies from 'js-cookie'
import { Apis, ClientPostApi, PostApi } from 'services/Api'
import { decodeToken } from 'react-jwt'
import Loader from 'utils/Loader'
import { GoChevronDown, GoChevronUp } from 'react-icons/go'
import { MdClose } from 'react-icons/md'

export default function Login({openbanks,setOpenBanks,setLogin }) {

    const [loading, setLoading] = useState(false)
    const bankings = ['Retail online banking', 'Mortgage accounts', 'business online banking', 'Investment services', 'consumer credit cards']
  const [banks, setBanks] = useState(bankings[0])
    const [forms, setForms] = useState({
        username: '',
        password: ''
    })

    const selectBank = (bank) => {
        setBanks(bank)
        setOpenBanks(false)
      }
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForms({ ...forms, [e.target.name]: e.target.value })
    }


    const LoginAcc = async (e) => {
        e.preventDefault()
        if (!forms.username) return errorMessage(' Username is required')
        if (!forms.password) return errorMessage('Password is required')
        const formdata = {
          username: forms.username,
          password: forms.password
        }
        setLoading(true)
        try {
          const response = await ClientPostApi(Apis.non_auth.login, formdata)
          if (response.status === 200) {
            Cookies.set(CookieName, response.token)
            successMessage(response.msg)
            const decoded = decodeToken(response.token)
            const findUserRole = UserRole.find((ele) => ele.role === decoded.role)
            if (findUserRole) {
              navigate(findUserRole.url)
            }
          }
          else {
            errorMessage(response.msg)
          }
        }
        catch (error) {
          return errorMessage(error.message)
        }
        finally {
          setLoading(false)
        }
      }
    

      const BankIcon = openbanks ? GoChevronUp : GoChevronDown
    return (
        <div className="relative w-full">
            <div className="flex items-center justify-between">
                <div className="sans text-[16px] leading-[23px] font-bold">Login to Retail Online Banking</div>
                <div onClick={() => setLogin(false)} className="flex items-center gap-1 hover:text-primary cursor-pointer">
                    <MdClose />
                    <div className="underline lite text-sm ">Close</div>
                </div>
            </div>

            {loading &&
            <div className="absolute left-1/2 -translate-x-1/2 top-1/3">
                <Loader/>
            </div>
            }
            <form onSubmit={LoginAcc} className="mt-5 flex items-start gap-5 flex-col">
                <div className="flex items-start flex-col gap-2 w-full">
                    <div className="sans text-[15px] leading-[17px] font-bold">User:</div>
                    <input name="username" value={forms.username} onChange={handleChange} type="text" className="w-full border border-dark h-12 rounded-full pl-2 outline-none" />
                </div>
                <div className="flex items-start flex-col gap-2 w-full">
                    <div className="sans text-[15px] leading-[17px] font-bold">Password:</div>
                    <input name="password" value={forms.password} onChange={handleChange} type="password" className="w-full border border-dark h-12 rounded-full pl-2 outline-none" />
                </div>
                <button disabled={loading ? true :false} className="py-3 sans text-[20px] leading-[20px] rounded-full w-full text-center bg-primary text-white">{loading ? 'Logging in' :'Login'}</button>
            </form>

            <div className="mt-5 flex items-start flex-col gap-1 text-dark">
                <Link to={`/signup`} className="sans text-[15px] leading-[18px] underline">First time user? Enroll now!</Link>
                <div className="sans text-[15px] leading-[18px] underline">Forgot User ID?</div>
                <div className="sans text-[15px] leading-[18px] underline">Forgot Password?</div>
            </div>
            <hr className="mt-5 w-full border-gray-400 border" />
            <div className="sans mt-2 text-[16px] leading-[23px] font-bold">Online Services</div>

            <div className="flex mt-2 w-full items-center justify-between gap-5">
                <div className="w-2/3 relative">
                    <div className="w-full flex items-center justify-between px-2 border">
                        <div className="w-[75%] py-2 text-[12px] capitalize leading-[23px] sans border-r-2 border-r-slate">{banks}</div>
                        <div onClick={() => setOpenBanks(prev => !prev)} className="w-[25%] cursor-pointer flex items-center justify-center">
                            <BankIcon className="text-3xl text-primary " />
                        </div>
                    </div>
                    {openbanks &&
                        <div className="w-full absolute top-12 z-50 py- bg-white">
                            <div className="w-full flex items-start gap-1 flex-col ">
                                {bankings.map((bank, _) => {
                                    return (
                                        <div onClick={() => selectBank(bank)} key={_} className="text-[13px] capitalize cursor-pointer pl-3 w-full hover:bg-red-600 hover:text-white leading-[23px]">{bank}</div>
                                    )
                                })}
                            </div>
                        </div>
                    }
                </div>
                <div className="w-1/3 rounded-full  hover:border-primary hover:border-2">
                    <div className="w-full h-full text-center py-2 cursor-pointer rounded-full text-white bg-primary hover:bg-white hover:text-primary">Ok</div>
                </div>


            </div>
        </div>
    )
}
