import React, { useEffect, useState } from 'react'
import { RiCloseLargeFill } from 'react-icons/ri'
import { RiLockPasswordFill } from "react-icons/ri";
import { MdOutlineMarkEmailRead } from 'react-icons/md';
import ButtonComponent from './ButtonComponent';
import FormComponent from './FormComponent';
import Loader from './Loader';
import { CookieName, errorMessage, successMessage } from './functions';
import { useSelector } from 'react-redux';
import { Apis, PostApi } from 'services/Api';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const EmailandPassModal = ({ email, pass, emaildiv, setModal }) => {

    const profile = useSelector((state) => state.profile.profile)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [code, setCode] = useState(false)
    const [countdown, setCoundown] = useState(0)
    const [verifyemail, setVerifyEmail] = useState(false)
    const [btnDisabled, setBtnDisabled] = useState(false)

    const [forms, setForms] = useState({
        email: '',
        password: '',
        confirm_password: '',
        code:''
    })

    const savePassword = async (e) => {
        e.preventDefault()
        if (!forms.password) return errorMessage("Password is required")
        if (!forms.confirm_password) return errorMessage("Confirm password is required")
        const formdata = {
            email: profile?.email,
            new_password: forms.password,
            confirm_password: forms.confirm_password
        }
        // console.log(formdata)

        setLoading(true)
        try {
            const response = await PostApi(Apis.auth.change_password, formdata)
            if (response.status === 200) {
                successMessage('password change success')
                setModal(false)
                Cookies.remove(CookieName)
                navigate('/login')
            } else {
                errorMessage(response.msg)
            }
        } catch (error) {
            console.log(error)
            errorMessage(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setForms({
            ...forms,
            [e.target.name]: e.target.value
        })
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

    const CheckEmail = async (e) => {
        e.preventDefault()
        if(!forms.email) return errorMessage(`New email is required`)
        setVerifyEmail(true)
        const formdata = {
            email: profile?.email,
            new_email: forms.email
        }
        setLoading(true)
        try {
            const response = await PostApi(Apis.auth.email_otp, formdata)
            if (response.status === 200) {
                successMessage(response.msg)
                setCode(true)
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
    const saveEmail = async (e) => {
        e.preventDefault()
        if(!profile?.email) return errorMessage("Account email is required")
       if(!forms.email) return errorMessage('New email is required')
       if(!forms.code) return errorMessage('Verification code is required')
        const formdata = {
            old_email: profile?.email,
            new_email:forms.email,
            reset_code:forms.code
        }
        setLoading(true)
        try {
            const res = await PostApi(Apis.auth.change_email,formdata)
            if(res.status === 200){
                successMessage(res.msg)
                setVerifyEmail(false)
                Cookies.remove(CookieName)
                navigate('/login')
            }else{
                errorMessage(res.msg)
            }
        } catch (error) {
            console.log(error)
            errorMessage(error.message)
        }finally{
            setLoading(false)
        }


    }
    return (
        <div ref={emaildiv} className="w-full bg-white h-fit py-3 rounded-lg relative ">
            <div className="flex w-full justify-between items-center px-3">
                <div className="text-xl font-bold">Change {email ? 'Email' : 'Password'}</div>
                <RiCloseLargeFill onClick={() => setModal(false)} className='text-2xl cursor-pointer' />
            </div>
            <hr className='my-5 bg-gray' />

            {loading &&
                <div className="absolute h-full  top-1/2 left-1/2 -translate-x-1/2 items-center justify-center">
                    <Loader />
                </div>
            }

            {verifyemail &&
                <div className="flex flex-col gap-3 w-11/12 px-5  mx-auto items-start">
                    <div className="text-center  font-semibold underline">Enter OTP Code</div>
                    <FormComponent formtype='code' placeholder={`*****`} name={`code`} value={forms.code} onchange={handleChange}/>
                    <button onClick={saveEmail} className='w-fit px-4 py-2 self-center rounded-md bg-primary text-white'>Submit</button>


                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                        <div className="text-sm text-gray-500">Didn't receive OTP? </div>
                        {!btnDisabled && <button onClick={CheckEmail} className='text-primary font-semibold text-base'>resend</button>}
                        </div>
                        
                        {btnDisabled && <div className="w-fit text-xs ml-auto flex items-center gap-1 flex-col">
                        <div className="">request again in:</div>
                        <div className="text-primary">{countdown} s</div>
                    </div>}
                    </div>
                </div>
            }
            {!verifyemail && <form onSubmit={pass ? savePassword : CheckEmail} className="w-11/12 mx-auto">
                {email && <MdOutlineMarkEmailRead className='text-center w-full text-6xl mb-10 text-primary' />}
                {pass && <RiLockPasswordFill className='text-center w-full text-6xl mb-10 text-primary' />}
                <div className="w-full flex items-start flex-col gap-3">
                    {email && <div className="flex items-start flex-col w-full">
                        <div className="text-primary font-bold text-[1rem]">New Email</div>
                        <FormComponent formtype={`email`} name={'email'} value={forms.email} onchange={handleChange} placeholder={`Email Address`} />
                    </div>}
                    <div className="flex items-start flex-col w-full gap-2">
                        {pass && <div className="flex items-start flex-col w-full ">
                            <div className="text-primary font-bold text-[1rem]">NewPassword</div>
                            <FormComponent formtype={`password`} value={forms.password} onchange={handleChange} name={'password'}
                                placeholder={`New Password`} />
                        </div>}
                        {pass && <>
                            <div className="flex items-start flex-col w-full ">
                                <div className="text-primary font-bold text-[1rem]">Confirm Password</div>
                                <FormComponent formtype={'password'} value={forms.confirm_password} onchange={handleChange} name={`confirm_password`} placeholder={`Confirm Password`} />
                            </div>
                        </>}
                        {email && <div className="text-sm">A 6-digit code will be sent to this new email for verification.</div>}
                    </div>
                </div>
                <div className=" mt-14">
                    {email && <ButtonComponent
                        type={`submit`}
                        bg={`bg-primary text-white h-10`}
                        title={`Save Changes`} />}


                    {pass && <ButtonComponent
                        bg={`bg-primary text-white h-10`}
                        title={`Save Password`} />}
                </div>
            </form>}
        </div>
    )
}

export default EmailandPassModal