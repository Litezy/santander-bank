import { MenuItem } from '@mui/material'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Apis, PostApi } from 'services/Api'
import CountryStates from 'utils/CountryStates'
import DailOptions from 'utils/DailOption'
import Formbutton from 'utils/Formbutton'
import Forminput from 'utils/Forminput'
import { errorMessage, successMessage } from 'utils/functions'

export default function Signup() {
    const [log,setLog] = useState(false)
    const [forms, setForms] = useState({
        firstname: '',
        lastname: '',
        email: '',
        gender: '',
        country: '',
        state: '',
        dialcode: '',
        phone: '',
        password: '',
        confirm_password: '',
    })
    const [submit, setSubmit] = useState(false)
    const [loading,setLoading] = useState(false)

    const [agree, setAgree] = useState(false);
    const [checkError, setCheckError] = useState(false);
    const navigate = useNavigate()

    const handleCheckboxChange = (e) => {
        setAgree(e.target.checked);
        if (!e.target.checked) {
            setCheckError(true);
        } else {
            setCheckError(false);
        }
    };

    const handleForms = (e) => {
        setForms({ ...forms, [e.target.name]: e.target.value })
    }

    const setup = (value) => {
        setForms({ ...forms, dialcode: value })
    }

    const handleCountry = (country, state) => {
        setForms({ ...forms, country: country, state: state })
    }

    async function handleSubmission (e) {
        e.preventDefault()
        setSubmit(true)
        if (!agree) {
          return  setCheckError(true);
        }
       if(!forms.dialcode) return errorMessage('Country dial code is required')
       if(forms.password !== forms.confirm_password) return errorMessage('password mismatched')
       if(!forms.country) return errorMessage('Country  is required')
       if(!forms.state) return errorMessage('State is required')
        const formdata = {
            firstname: forms.firstname,
            lastname: forms.lastname,
            email: forms.email,
            gender: forms.gender,
            country: forms.country,
            state: forms.state,
            dialcode: forms.dialcode,
            phone: forms.phone,
            password: forms.password,
            confirm_password: forms.confirm_password,
        }
        setLoading(true)
        try {
            const res = await PostApi(Apis.non_auth.create_acc, formdata)
            if(res.status === 200){
                successMessage(`sign up success`)
                navigate(`/verify-email?email=${encodeURIComponent(forms.email)}`);
            }else{
                errorMessage(res.msg)
            }
        } catch (error) {
            errorMessage(`sorry, something went wrong on our end`,error.message)
            // console.log(error)
        }finally{
            setLoading(false)
        }
    }
    return (
        <div className='bg-gradient-to-tr from-primary to-sec h-screen overflow-x-hidden'>
            <div className="w-[90%] lg:w-[95%] mx-auto max-w-xl bg-white backdrop-blur-sm p-3 lg:p-5 rounded-lg my-10 ">
                {!log &&<div className="text-3xl lg:text-4xl font-bold text-primary">Create Account</div>}
               {!log ? <form onSubmit={handleSubmission} className="mt-5">
                    <Forminput isError={submit && !forms.firstname ? "First name is missing" : ""}
                        name={'firstname'}
                        onClick={() => setSubmit(false)}
                        value={forms.firstname}
                        onChange={handleForms} formtype="text" label="First Name" />


                    <div className="grid grid-cols-7 gap-1 lg:gap-5">
                        <div className="col-span-5">
                            <Forminput
                                name={'lastname'}
                                value={forms.lastname}
                                onClick={() => setSubmit(false)}
                                onChange={handleForms} formtype="text" label="Last Name"
                                isError={submit && !forms.lastname ? "Last name is missing" : ""}
                            />
                        </div>


                        <div className="col-span-2">
                            <Forminput
                                name={'gender'}
                                value={forms.gender}
                                onClick={() => setSubmit(false)}
                                isError={submit && !forms.gender ? "Gender is missing" : ""}
                                onChange={handleForms}
                                formtype="select" label={'Gender'}>
                                <MenuItem value={'male'}>Male</MenuItem>
                                <MenuItem value={'female'}>Female</MenuItem>
                            </Forminput>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 lg:gap-3">
                        <div className="col-span-2">
                            <DailOptions title="+1" setup={setup} />
                        </div>
                        <div className="col-span-5">
                            <Forminput
                                name={'phone'}
                                value={forms.phone}
                                onChange={handleForms}
                                formtype="text"
                                onClick={() => setSubmit(false)}
                                isError={submit && !forms.phone ? "Phone number is missing" : ""}
                            />
                        </div>
                    </div>


                    <Forminput
                        name={'email'}
                        value={forms.email}
                        onClick={() => setSubmit(false)}
                        onChange={handleForms}
                        formtype="text" label="Email Address"
                        isError={submit && !forms.email ? "Email is missing" : ""}
                    />
                    <CountryStates onChange={handleCountry} />


                    <Forminput
                        name={'password'}
                        value={forms.password}
                        onChange={handleForms}
                        formtype="password"
                        label="Password"
                        onClick={() => setSubmit(false)}
                        isError={submit && !forms.password ? "Password is missing" : ""}
                    />

                    <Forminput
                        name={'confirm_password'}
                        value={forms.confirm_password}
                        onChange={handleForms}
                        formtype="password"
                        label="Confirm Password"
                        onClick={() => setSubmit(false)}
                        isError={submit && !forms.confirm_password ? "Confirm password is missing" : ""}
                    />


                    <div className="flex items-center mb-3">
                    <Forminput
                        isError={checkError ? "Agree to our T&C's" : ""}
                        formtype="checkbox"
                        placeholder=""
                        signup={true}
                        onChange={handleCheckboxChange}
                    />
                    <div className="text-sm">Confirm you agree to our 
                        <Link className='text-blue-700 font-semibold' to={`/terms`}> terms of use</Link> and  
                     <Link to={`/privacy-policy`} className='text-blue-700 font-semibold' > privacy policy</Link>.</div>
                    </div>


                    <Formbutton label="Create Account" loading={loading ? true :false}/>
                    <div className="text-zinc-500 mt-5 text-center">Already have an account? <Link to="/login" className='text-blue-600'>Login Account</Link> </div>
                    <div className="text-zinc-500 mt-3 text-center"><Link to="/" className='text-blue-600'>Go back home</Link> </div>
                </form>:
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