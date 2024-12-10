import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { FaEdit } from 'react-icons/fa';
import kycpassed from 'assets/kycpassed.png'
import pendingkyc from 'assets/pendingkyc.gif'
import { Apis, GetApi, PostApi } from 'services/Api';
import { errorMessage, successMessage } from './functions';
import { useSelector } from 'react-redux';
import Loader from './Loader';
import { Link, useNavigate } from 'react-router-dom';
import ModalLayout from './ModalLayout';
import { FaRegIdCard } from "react-icons/fa";
import Forminput from './Forminput';
import { MenuItem } from '@mui/material';
import FormComponent from './FormComponent';
import ButtonComponent from './ButtonComponent';


const UserKYC = ({ }) => {
    const [loading, setLoading] = useState(false)
    const [load, setLoad] = useState(false)
    const [data, setData] = useState({})
    const [confirm, setConfirm] = useState(false)

    const profile = useSelector((state) => state.profile.profile)


    const frontRef = useRef()
    const navigate = useNavigate()
    const backRef = useRef()
    const [forms, setForms] = useState({
        marital: '',
        first_address: '',
        second_address: '',
        dob: '',
        id_type: '',
        zip: '',
        id_number: '',
        ssn: '',
        options: ''
    })
    const [frontimg, setfrontImg] = useState({
        img: null,
        image: null
    })
    const [backimg, setbackImg] = useState({
        img: null,
        image: null
    })


    const handleChange = (e) => {
        setForms({
            ...forms,
            [e.target.name]: e.target.value
        })
    }
    const checkdob = () => {
        console.log(
            forms.dob
        )
    }

    const handleImageFront = (e) => {
        const file = e.target.files[0]
        if (!file.type.startsWith(`image/`)) {
            frontRef.current.value = null
            return errorMessage('Invalid file format detected, try with a different photo')
        }
        setfrontImg({
            img: URL.createObjectURL(file),
            image: file
        })
    }
    const handleImageBack = (e) => {
        const file = e.target.files[0]
        if (!file.type.startsWith(`image/`)) {
            backRef.current.value = null
            return errorMessage('Invalid file format detected, try with a different photo')
        }
        setbackImg({
            img: URL.createObjectURL(file),
            image: file
        })
    }

    const changeImageback = (e) => {
        setbackImg({
            img: e.target.src,
            image: null
        })
    }
    const changeImagefront = (e) => {
        setfrontImg({
            img: e.target.src,
            image: null
        })
    }

    const submitForm = async (e) => {
        e.preventDefault()
        // console.log(forms, frontimg.image, backimg.image)
        if (!forms.marital) return errorMessage("Marital status is required")
        if (!forms.dob) return errorMessage("Date of birth is required")
        if (!forms.first_address) return errorMessage("First line adress is required")
        if (!forms.zip) return errorMessage("Zip code is required")
        if (!forms.id_type) return errorMessage("ID card type is required")
        if (!forms.id_number) return errorMessage("ID card number is required")
        if (frontimg.image === null) return errorMessage('ID front image is required')
        if (backimg.image === null) return errorMessage('ID back image is required')
        const formdata = new FormData()
        formdata.append('frontimg', frontimg.image)
        formdata.append('backimg', backimg.image)
        formdata.append('dob', forms.dob)
        formdata.append('marital', forms.marital)
        formdata.append('zip', forms.zip)
        formdata.append('first_address', forms.first_address)
        formdata.append('second_address', forms.second_address)
        formdata.append('id_number', forms.id_number)
        formdata.append('id_type', forms.id_type)

        setLoading(true)
        try {
            const response = await PostApi(Apis.auth.submit_kyc, formdata)
            if (response.status !== 200) return errorMessage(response.msg)
            successMessage(response.msg)
            navigate(`/user/settings`)
        } catch (error) {
            errorMessage(error.message)
        } finally {
            setLoading(false)
        }
    }


    const submitUSKYC = async () => {
        if (!forms.marital) return errorMessage("Marital status is required")
        if (!forms.dob) return errorMessage("Date of birth is required")
        if (!forms.first_address) return errorMessage("First line adress is required")
        if (!forms.zip) return errorMessage("Zip code is required")
        if (!forms.id_type) return errorMessage("ID card type is required")
        if (!forms.id_number) return errorMessage("ID card number is required")
        if (frontimg.image === null) return errorMessage('ID front image is required')
        if (backimg.image === null) return errorMessage('ID back image is required')
        if (!forms.ssn === null) return errorMessage('SSN is required for government compliance')
        const formdata = new FormData()
        formdata.append('frontimg', frontimg.image)
        formdata.append('backimg', backimg.image)
        formdata.append('dob', forms.dob)
        formdata.append('marital', forms.marital)
        formdata.append('zip', forms.zip)
        formdata.append('first_address', forms.first_address)
        formdata.append('second_address', forms.second_address)
        formdata.append('id_number', forms.id_number)
        formdata.append('id_type', forms.id_type)
        formdata.append('ssn', forms.ssn)
        setLoad(true)
        try {
            const response = await PostApi(Apis.auth.submit_kyc, formdata)
            if (response.status !== 200) return errorMessage(response.msg)
            successMessage(response.msg)
            navigate(`/user/settings`)
        } catch (error) {
            errorMessage(error.message)
        } finally {
            setLoad(false)
        }
    }


    const [width, setWidth] = useState('0%');
    useEffect(() => {
        if (profile?.kyc === 'verified') {
            setWidth('100%');
        }
        if (profile?.kyc === 'submitted') {
            setWidth('50%');
        }
        if (profile?.kyc === 'unverified') {
            setWidth('05%');
        }
    }, [profile?.kyc]);


    const NextPage = () => {
        if (!forms.marital) return errorMessage("Marital status is required")
        if (!forms.dob) return errorMessage("Date of birth is required")
        if (!forms.first_address) return errorMessage("First line adress is required")
        if (!forms.zip) return errorMessage("Zip code is required")
        if (!forms.id_type) return errorMessage("ID card type is required")
        if (!forms.id_number) return errorMessage("ID card number is required")
        if (frontimg.image === null) return errorMessage('ID front image is required')
        if (backimg.image === null) return errorMessage('ID back image is required')
        setConfirm(true)
    }

    const handleITIN = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
        value = value.substring(0, 9); // Limit to 9 digits
        let formattedValue = value;
        // Format as XXX-XX-XXXX
        if (value.length > 5) {
            formattedValue = `${value.substring(0, 3)}-${value.substring(3, 5)}-${value.substring(5, 9)}`;
        } else if (value.length > 3) {
            formattedValue = `${value.substring(0, 3)}-${value.substring(3, 5)}`
        }
        setForms({
            ...forms,
            ssn: formattedValue
        })
    };

    useEffect(() => {
        if (confirm === false) {
            setForms({
                ...forms,
                options: ''
            })
        }
    }, [confirm])

    return (
        <div className=' h-fit px-4 mt-3 py-5 '>

            {confirm &&
                <ModalLayout setModal={setConfirm} clas={`w-11/12 mx-auto lg:w-[60%]`}>
                    <div className="w-full bg-white p-10 rounded-lg">

                        {load &&
                            <div className="absolute top-0  backdrop-blur-sm w-full z-40 h-full rounded-md left-1/2 -translate-x-1/2">
                                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-fit p-5 rounded-md bg-white"><Loader />
                                </div>
                            </div>
                        }

                        <div className="flex flex-col gap-5">
                            <div className="text-2xl font-bold">Confirm your Social Security Number Number or ITIN</div>
                            <div className="text-base">US law requires we verify your identity. This is a one-time verification process and will not affect your credit score. We keep your information safe, encrypted and never share it.

                            </div>

                            <div className="flex items-center gap-10 w-full">
                                <div className="text-lg font-bold">ITIN Type:</div>
                                <div className="w-1/2 ">
                                    <label className='w-1/2 ' >
                                        <select name="options" value={forms.options} onChange={handleChange} className='w-full outline-none h-14 border px-5 py-1 rounded-md' id="">
                                            <option value="">--select--</option>
                                            <option value="SSN">SSN</option>
                                            <option value="ITIN">ITIN</option>
                                        </select>

                                    </label>
                                </div>
                            </div>

                            {forms.options &&
                                <>
                                    <div className="w-11/12 mx-auto lg:w-3/4 lg:mx-0">
                                        <Forminput
                                            name={'ssn'}
                                            value={forms.ssn}
                                            onChange={handleITIN}
                                            formtype="text"
                                            label={`${forms.options} Number`} />
                                    </div>

                                    {forms.ssn.length > 10 && <div className="w-11/12 mx-auto lg:w-3/4">
                                        <ButtonComponent onclick={submitUSKYC} type='button' title={`Submit `} bg={`h-14 bg-primary text-white rounded-md`} />
                                    </div>}
                                </>
                            }
                        </div>

                    </div>
                </ModalLayout>
            }


            <div className="w-11/12 mx-auto ">
                <Link to={'/user/settings'} className="w-fit  rounded-md px-5 py-1 bg-gradient-to-tr from-primary to-sec text-white mr-auto cursor-pointer ">
                    back
                </Link>
                <h1 className='mb-2 mt-5 text-2xl font-bold'>{profile?.kyc === 'unverified' ? 'Complete Kyc Information below' : profile?.kyc === 'submitted' ? 'Track your kyc review progress' : 'Kyc Approved'}</h1>
                <div className={`w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 
                ${profile?.kyc !== 'verified' ? ' animate-pulse' : ''}`}>
                    <div className={`${profile?.kyc === 'verified' ? 'bg-green-500' : "bg-gradient-to-tr from-primary to-sec"}  h-2.5 rounded-full`} style={{ width }}></div>
                </div>
                <div className="flex w-full items-center justify-between mt-2 text-sm">
                    <p className={`${profile?.kyc === 'unverified' && 'text-primary font-bold'}`}>
                        Not Submitted</p>
                    <p className={`${profile?.kyc === 'submitted' && 'text-primary font-bold'}`}>Submitted</p>
                    <p className={`${profile?.kyc === 'verified' && 'text-green-500 font-bold'}`}>Approved</p>
                </div>
            </div>
            {profile?.kyc === 'unverified' &&
                <>


                    <form className="mt-5 h-fit relative  border rounded-md text-sm bg-[white] py-5 px-4">

                        {loading &&
                            <div className="absolute top-0  backdrop-blur-sm w-full z-40 h-full rounded-md left-1/2 -translate-x-1/2">
                                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-fit p-5 rounded-md bg-white"><Loader />
                                </div>
                            </div>
                        }
                        <div className="md:flex md:items-baseline gap-5 w-full ">
                            <div className="md:w-1/2">

                                <div className="flex flex-col w-full mt-5 ">
                                    <h1 className='mb-2'>Marital Status:</h1>
                                    <select name="marital" onChange={handleChange} value={forms.marital} id="" className='border-b w-1/2 outline-none'>
                                        <option >--select--</option>
                                        <option value="single">Single</option>
                                        <option value="married">Married</option>
                                        <option value="divorced">Divorced</option>
                                    </select>
                                </div>
                                <div className="flex flex-col w-full mt-5  ">
                                    <h1 onClick={checkdob}>Date of Birth</h1>
                                    <div class="relative max-w-sm w-1/2">
                                        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                            </svg>
                                        </div>
                                        <input name='dob' value={forms.dob} onChange={handleChange} datepicker datepicker-buttons datepicker-autoselect-today type="date" class="bg-white mt-2 border border-gray-300 text-gray-900 text-sm rounded-lg outline-none w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
    dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date" />
                                    </div>
                                </div>
                                <div className="flex flex-col w-full mt-3  ">
                                    <h1>First line Address:</h1>
                                    <input name='first_address' value={forms.first_address} onChange={handleChange} type="text" className='w-full outline-none border-b h-8 overflow-x-auto' />
                                </div>
                                <div className="flex flex-col w-full mt-3  ">
                                    <h1>Second Line Address (Optional):</h1>
                                    <input name='second_address' value={forms.second_address} onChange={handleChange} type="text" className='w-full outline-none border-b h-8 overflow-x-auto' />
                                </div>

                                <div className="flex flex-col w-full mt-3  ">
                                    <h1>Zip Code:</h1>
                                    <input name='zip' value={forms.zip} onChange={handleChange} type="text" className='w-full outline-none border-b h-8 overflow-x-auto' />
                                </div>

                            </div>
                            <div className="md:w-1/2  h-full">
                                <div className="flex flex-col w-full  ">
                                    <h1 className="">Government Issued ID:</h1>
                                    <select name="id_type" onChange={handleChange} value={forms.id_type} className='border-b w-full outline-none mt-3'>
                                        <option >--select--</option>
                                        <option value="driver's license/state ID">Driver's License/State ID</option>
                                        <option value="Passport">Passport</option>
                                        <option value="national id">National ID</option>
                                    </select>
                                </div>
                                <div className="flex flex-col w-full mt-3  ">
                                    <h1>ID Number:</h1>
                                    <input name='id_number' value={forms.id_number} onChange={handleChange} type="text" className='w-full outline-none border-b h-8 overflow-x-auto' />
                                </div>
                                <div className="mt-5 ">
                                    <h1 className='text-center text-lg font-bold'>Upload Front ID Image</h1>

                                    <div className="md:h-60 h-48  w-11/12 mx-auto relative">
                                        <label className={`${frontimg.img ? '' : 'border-2 border-black'} mt-5 w-full  h-full border-dashed flex cursor-pointer items-center justify-center `}>
                                            {frontimg.img ? <div className="">
                                                <div onChange={changeImagefront} className="absolute top-0 right-3 main font-bold ">
                                                    <FaEdit className='text-2xl' />
                                                </div>
                                                <img src={frontimg.img} className='w-full h-48' />
                                            </div> : <FaPlus className='text-2xl' />}
                                            <input type="file" onChange={handleImageFront} hidden ref={frontRef} />
                                        </label>
                                    </div>
                                </div>
                                <div className="mt-5 ">
                                    <h1 className='text-center text-lg font-bold'>Upload Back ID Image</h1>

                                    <div className="md:h-60 h-48 w-11/12 mx-auto relative ">
                                        <label className={`${backimg.img ? '' : 'border-2 border-black border-dashed'} mt-5 w-full h-full  flex cursor-pointer items-center justify-center `}>
                                            {backimg.img ? <div className="">
                                                <div r onChange={changeImageback} className="absolute top-0 right-3 main font-bold ">
                                                    <FaEdit className='text-2xl' />
                                                </div>
                                                <img src={backimg.img} className='w-full h-48' />
                                            </div> : <FaPlus className='text-2xl' />}
                                            <input type="file" onChange={handleImageBack} hidden ref={backRef} />
                                        </label>
                                    </div>
                                </div>

                            </div>

                        </div>
                        <div className="mt-5 w-8/12  mx-auto">
                            {profile?.country === 'United States' ?
                                <button type='button' onClick={NextPage} className='px-5 py-3  w-full bg-gradient-to-tr from-primary to-sec text-white rounded-full text-base lg:text-xl'>Next</button> :
                                <button type='button'
                                    onClick={submitForm}
                                    className='px-5 py-3  w-full bg-gradient-to-tr from-primary to-sec text-white rounded-full text-base lg:text-xl'>Submit</button>
                            }
                        </div>
                    </form>
                </>}
            {
                profile?.kyc === 'verified' &&
                <>
                    <div className="h-screen">
                        <div className="flex mt-5 md:mt-0 items-center justify-center h-3/4 shadow-lg bg-white w-11/12 mx-auto rounded-md">
                            <div className="px-4 flex flex-col">
                                <h1 className='text-center md:text-xl'>Congratulations, You have passed your KYC.</h1>
                                <img src={kycpassed} className='w-96 mx-auto' alt="" />
                            </div>
                        </div>
                    </div>
                </>
            }
            {
                profile?.kyc === 'submitted' &&
                <>
                    <div className="h-screen mt-8">
                        <div className="flex mt-5 md:mt-0 items-center justify-center h-3/4 shadow-lg bg-white w-11/12 mx-auto rounded-md">
                            <div className="px-4 flex flex-col">
                                <h1 className='md:text-center md:text-xl'>Kindly wait for your KYC submission to be approved.</h1>
                                <p className='md:text-center text-sm'>This usually takes about 3-5 working days.</p>
                                <img src={pendingkyc} className='w-96 mx-auto' alt="" />
                            </div>
                        </div>
                    </div>
                </>
            }
        </div >

    )
}

export default UserKYC