import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Apis, ClientPostApi, PostApi } from 'services/Api'
import CountryStates from 'utils/CountryStates'
import DailOptions from 'utils/DailOption'
import Formbutton from 'utils/Formbutton'
import Forminput from 'utils/Forminput'
import { errorMessage, successMessage } from 'utils/functions'
import Loader from 'utils/Loader'
import OtpForm from 'utils/OtpForm'
import { FaLongArrowAltLeft } from "react-icons/fa";

export default function ForgotPassword() {

    const [loading, setLoading] = useState(false)
    const [screen, setScreen] = useState(1)
    const [pins, setPins] = useState(['', '', '', '']);
    const [btnDisabled, setBtnDisabled] = useState(false)
    const [countdown, setCoundown] = useState(0)
    const [usermail, setUsermail] = useState('')
    const navigate = useNavigate()
    const [forms, setForms] = useState({
        email: '',
        password: '',
        confirm_password: ''
    })
    const handleForms = (e) => {
        setForms({
            ...forms,
            [e.target.name]: e.target.value
        })
    }

    const setup = (val) => {
        setPins(val)
    }
    const checkEmail = async (e) => {
        e.preventDefault()
        if (!forms.email) return errorMessage(`Email is missing`)
        const data = {
            email: forms.email
        }
        setLoading(true)
        try {
            const res = await PostApi(Apis.non_auth.find_account, data)
            if (res.status === 200) {
                successMessage(res.msg)
                setScreen(2)
            } else {
                errorMessage(res.msg)
            }
        } catch (error) {
            errorMessage(error.message)
            console.log(error)
        } finally {
            setLoading(false)
        }

    }


    const handleCode = async (e) => {
        e.preventDefault()
        const form = {
            code: pins.join('')
        }
        const formdata = {
            email: forms.email,
            reset_code: form.code
        }
        // return console.log(formdata)
        setLoading(true)
        try {
            const res = await PostApi(Apis.non_auth.verify_emailpass, formdata)
            if (res.status === 200) {
                successMessage(res.msg)
                setScreen(3)
            } else {
                errorMessage(res.msg)
            }
        } catch (error) {
            errorMessage(error.message)
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!forms.password) return errorMessage(`Password is missing`)
        if (!forms.confirm_password) return errorMessage(`Confirm password is missing`)
        if (forms.password.length < 5) return errorMessage(`Password characters must be greater than 5`)
        if (forms.confirm_password !== forms.password) return errorMessage(`Password(s) mismatch`)
        const formdata = {
            email: forms.email,
            new_password: forms.password,
            confirm_password: forms.confirm_password
        }
        setLoading(true)
        try {
            const res = await PostApi(Apis.non_auth.change_user_pass, formdata)
            if (res.status === 200) {
                successMessage(res.msg)
                navigate('/login')
            } else {
                errorMessage(res.msg)
            }
        } catch (error) {
            errorMessage(error.message)
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        let timer;
        if (btnDisabled) {
            timer = setInterval(() => {
                setCoundown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer)
                        setBtnDisabled(false)
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000)
        }

        return () => clearInterval(timer)
    }, [btnDisabled])
    const RequestOtp = async (e) => {
        e.preventDefault()
        const formData = {
            email: forms.email
        }
        setLoading(true)
        try {
            const response = await ClientPostApi(Apis.non_auth.resend_otp, formData)
            if (response.status === 200) {
                successMessage(response.msg)
                setBtnDisabled(true)
                setCoundown(60)
            } else {
                errorMessage(response.msg)
            }

        } catch (error) {
            errorMessage(error.message)
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='bg-gradient-to-tr from-primary to-sec h-screen py-20 overflow-x-hidden flex items-center justify-center'>
            <div className="w-[90%] mx-auto max-w-xl bg-white relative backdrop-blur-sm p-5 rounded-lg mt-10 lg:mt-20">

                {loading &&
                    <div className="absolute z-50 top-1/3 left-1/2 -translate-x-1/2 ">
                        <Loader />
                    </div>
                }


                {screen === 1 &&
                    <>
                        <div className="text-2xl lg:text-4xl font-bold text-primary">Forgot Password</div>
                        <div className="">Lets assist you recover your account</div>
                        <form onSubmit={checkEmail} className='mt-5'>
                            <Forminput
                                name={'email'}
                                value={forms.email}
                                onChange={handleForms}
                                formtype="text" label="Email Address"
                            />
                            <Formbutton label="Find my email" />
                        </form>
                    </>
                }


                {screen === 2 &&
                    <form onSubmit={handleCode} className=''>
                        <div onClick={() => setScreen(1)} className="w-fit mr-auto px-5  py-1 cursor-pointer rounded-full bg-gradient-to-tr from-primary to-sec text-white mb-2">
                            <FaLongArrowAltLeft className='text-white text-xl' />
                        </div>
                        <div className="text-center font-semibold">Enter OTP code sent to your email</div>

                        <div className="mb-5">
                            <OtpForm
                                pins={pins}
                                setPins={setPins}
                                setup={setup}
                            />
                        </div>
                        <Formbutton label="Submit code" />


                        <div className="flex mt-3  items-center justify-center flex-col gap-2">
                            <div className="">didn't receive email?</div>
                            {btnDisabled && <div className="w-fit text-xs font-bold  flex items-center gap-1 flex-col">
                                <div className="">request again in:</div>
                                <div className="text-primary">{countdown} s</div>
                            </div>}
                            <button type='button' onClick={RequestOtp} disabled={btnDisabled ? true : false} className={`w-fit px-3 py-1 rounded-full  text-white ${btnDisabled ? 'bg-slate-300' : 'bg-primary'}`}>resend</button>
                        </div>

                    </form>
                }


                {screen === 3 &&
                    <>
                        <form onSubmit={handleSubmit} className='mt-5'>
                            <Forminput
                                name={'password'}
                                value={forms.password}
                                onChange={handleForms}
                                formtype="password"
                                label="Password"
                            />

                            <Forminput
                                name={'confirm_password'}
                                value={forms.confirm_password}
                                onChange={handleForms}
                                formtype="password"
                                label="Confirm Password"

                            />
                            <Formbutton label="Change password" />


                        </form>
                    </>
                }

                <div className="text-zinc-500 mt-3 text-center"><Link to="/" className='text-blue-600'>Go back home</Link> </div>
            </div>
        </div>
    )
}
