import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ButtonComponent from 'utils/ButtonComponent'
import FormComponent from 'utils/FormComponent'
import Forminput from 'utils/Forminput'
import { CookieName, errorMessage, successMessage, UserRole } from 'utils/functions'
import Cookies from 'js-cookie'
import { Apis, PostApi } from 'services/Api'
import { decodeToken } from 'react-jwt'
import Loader from 'utils/Loader'

export default function Login() {

    const [loading, setLoading] = useState(false)
    const [forms, setForms] = useState({
        email: '',
        password: ''
    })

    const [login, setLogin] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForms({ ...forms, [e.target.name]: e.target.value })
    }


    const isValidEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    const LoginAcc = async (e) => {
        e.preventDefault()
        if (!forms.email) return errorMessage('Email address is required')
        if (!isValidEmail(forms.email)) return errorMessage('Please input a valid email')
        if (!forms.password) return errorMessage('Password is required')
        const formdata = {
            email: forms.email,
            password: forms.password
        }
        setLoading(true)
        try {
            const response = await PostApi(Apis.non_auth.login, formdata)
            if (response.status === 200) {
                Cookies.set(CookieName, response.token,)
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
    return (
        <div className='bg-gradient-to-tr from-sec  to-primary h-screen overflow-x-hidden flex items-center justify-center'>
            <div className="w-[90%] mx-auto max-w-xl bg-white backdrop-blur-sm p-5 relative rounded-lg mt-10 lg:mt-20">

                {loading &&
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2">
                        <Loader />
                    </div>
                }
                {!login ? <div>
                    <div className="text-3xl lg:text-4xl font-bold text-sec">Login Account</div>
                    <form onSubmit={LoginAcc} className='mt-5 flex items-start gap-4 flex-col'>
                        <FormComponent formtype="email" name={`email`} value={forms.email} onchange={handleChange} placeholder="Email Address" />
                        <FormComponent formtype="password" name={`password`} value={forms.password} onchange={handleChange} placeholder="Password" />
                        <div className="grid grid-cols-2 gap-4 items-center mb-3">

                            <div className="text-right">
                                <Link to="/forgot-password" className='text-primary font-semibold'>Forgot Password?</Link>
                            </div>
                        </div>
                        <ButtonComponent bg={`bg-sec text-white h-12`} title={loading ? "...Logging in" : "Login Account"} />
                        <div className="text-zinc-500 mt-5 text-center ">Don't have an account? <Link to="/signup" className='text-sec font-semibold'>Create Account</Link> </div>
                        <div className="text-zinc-500 mt-3 text-center"><Link to="/" className='text-sec font-semibold'>Go back home</Link> </div>
                    </form>
                </div> :
                    <div className="flex items-start flex-col gap-5">
                        <div className="">Site Maintenance Notice</div>

                        <div className="font-bold">Dear User,</div>

                        <div className="">
                        Our website is currently undergoing scheduled maintenance to improve your experience. During this time, some services may be temporarily unavailable. We apologize for any inconvenience and appreciate your patience as we work to enhance our platform.
                        </div>

                        <div className="">
                        Estimated Downtime:  <span className='font-bold'>November 9th, 2:00 AM to November 11th at 6:00 AM UTC</span> <br />
                        We’ll Be Back Shortly!
                        </div>

                        <div className="">
                        Thank you for your understanding and support. If you have any urgent inquiries, please contact us at support@pinerockcreditunion.com.
                        </div>

                        <div className="">Best regards, 
                        <span className='font-bold'>Pinerockcredit Union IT/Support Team</span></div>

                        <Link to={`/`} className="underline text-primary">Go back home</Link>
                    </div>
                }
            </div>
        </div>
    )
}
