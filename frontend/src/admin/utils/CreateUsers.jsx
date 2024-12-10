import React, { useState } from 'react'
import { IoReturnUpBackOutline } from 'react-icons/io5'
import { Apis, PostApi } from 'services/Api'
import ButtonComponent from 'utils/ButtonComponent'
import FormComponent from 'utils/FormComponent'
import { errorMessage, successMessage } from 'utils/functions'
import Loader from 'utils/Loader'
import ModalLayout from 'utils/ModalLayout'

const CreateUsers = ({ setActive }) => {
    const [forms, setForms] = useState({
        firstname: '',
        lastname: '',
        gender: '',
        dial_code: '',
        email: '',
        country: '',
        state: '',
        password: '',
        phone:'',
        confirm_password: '',
    });
    const [loading, setLoading] = useState(false)
    const handleChange = (e) => {
        setForms({
            ...forms,
            [e.target.name]: e.target.value
        })
    }

    const createUser = async (e) => {
        e.preventDefault()
        const isValidEmail = (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };
        if (!forms.firstname) return errorMessage('Firstname is required')
        if (!forms.lastname) return errorMessage('Lastname is required')
        if (!isValidEmail(forms.email)) return errorMessage('Invalid email')
        if (!forms.country) return errorMessage('Country is required')
        if (!forms.state) return errorMessage('state is required')
        if (!forms.dial_code) return errorMessage('Dial code is required')
        if (!forms.gender) return errorMessage('Gender is required')
        if (!forms.password) return errorMessage('Password is required')
        if (forms.confirm_password !== forms.password) return errorMessage('Password(s) mismatched')
        const formdata = {
            firstname: forms.firstname,
            lastname: forms.lastname,
            gender: forms.gender,
            dialcode: forms.dial_code,
            email: forms.email,
            country: forms.country,
            state: forms.state,
            password: forms.password,
            phone:forms.phone,
            confirm_password: forms.confirm_password,
        }
        setLoading(true)
        try {
            const res = await PostApi(Apis.admin.create_user,formdata)
            if (res.status === 200) {
                successMessage('user created successfully')
                setForms({
                    ...forms,
                    firstname: '',
                    lastname: '',
                    gender: '',
                    dial_code: '',
                    email: '',
                    country: '',
                    state: '',
                    password: '',
                    phone:'',
                    confirm_password: '',
                })
                setActive(0)
            }else{
                errorMessage(res.msg)
            }
        } catch (error) {
            console.log(error)
            errorMessage(error.mesage)
        }finally{
            setLoading(false)
        }
    }
    return (
        <div className='w-full'>
              {loading &&
                    <ModalLayout setModal={setLoading} clas={`w-11/12 mx-auto lg:w-[60%]`}>
                        <div className="absolute left-1/2 bg-white p-5 rounded-md -translate-x-1/2 top-1/2">
                        <Loader />
                    </div>
                    </ModalLayout>
                }
            <div className="w-full flex items-center justify-between">
                <div onClick={() => setActive(0)} className="w-fit cursor-pointer mr-auto bg-primary text-white px-3 py-1 rounded-md">
                    <IoReturnUpBackOutline className='text-2xl' />
                </div>
                <div className="text-lg font-semibold">Create Users</div>
            </div>
            <div className="my-10 text-center font-light">Create new user by entering the following details</div>
            <form onSubmit={createUser} className='shadow-md w-full bg-white p-8 rounded-lg relative'>
                <div className="flex items-start flex-col   lg:flex-row gap-4">
                    <div className="flex items-start flex-col lg:w-1/2 w-full gap-3">
                        <div className="flex items-start gap-1 flex-col w-full ">
                            <div className="">First Name:</div>
                            <FormComponent name={`firstname`} value={forms.firstname} onchange={handleChange} />
                        </div>
                        <div className="flex items-start gap-1 flex-col w-full">
                            <div className="">Last Name:</div>
                            <FormComponent name={`lastname`} value={forms.lastname} onchange={handleChange} />
                        </div>
                        <div className="flex items-start gap-1 flex-col w-full">
                            <div className="">Dial Code:</div>
                            <FormComponent name={`dial_code`} value={forms.dial_code} onchange={handleChange} />
                        </div>
                        <div className="flex items-start gap-1 flex-col w-full">
                            <div className="">Phone no:</div>
                            <FormComponent formtype='phone' name={`phone`} value={forms.phone} onchange={handleChange} />
                        </div>
                        <div className="flex items-start gap-1 flex-col w-full">
                            <div className="">Email Address:</div>
                            <FormComponent formtype='email' name={`email`} value={forms.email} onchange={handleChange} />
                        </div>


                    </div>
                    <div className="flex flex-col items-start lg:w-1/2 w-full gap-3">
                        <div className="flex items-start gap-1 flex-col w-full ">
                            <div className="">Country:</div>
                            <FormComponent name={`country`} value={forms.country} onchange={handleChange} />
                        </div>
                        <div className="flex items-start gap-1 flex-col w-full">
                            <div className="">State:</div>
                            <FormComponent name={`state`} value={forms.state} onchange={handleChange} />
                        </div>
                        <div className="flex items-start gap-1 flex-col ">
                            <div className="">Gender:</div>
                            <label >
                                <select className='w-full py-2 outline-none border-b' name={'gender'} value={forms.gender} onChange={handleChange} >
                                    <option >--select--</option>
                                    <option name='male' value="male">Male</option>
                                    <option name='female' value="Female">Female</option>
                                </select>
                            </label>
                        </div>
                        <div className="flex items-start gap-1 flex-col w-full">
                            <div className="">Password:</div>
                            <FormComponent formtype='password' name={`password`} value={forms.password} onchange={handleChange} />
                        </div>
                        <div className="flex items-start gap-1 flex-col w-full">
                            <div className="">Confirm Password:</div>
                            <FormComponent formtype='password' name={`confirm_password`} value={forms.confirm_password} onchange={handleChange} />
                        </div>
                    </div>
                </div>
                <div className="w-2/4 mx-auto mt-5">
                    <ButtonComponent title={`Create User`} bg={`text-white bg-primary h-12 rounded-md`} />
                </div>
            </form>
        </div>
    )
}

export default CreateUsers