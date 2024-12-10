import React, { useCallback, useEffect, useRef, useState } from 'react'
import { FaEdit } from 'react-icons/fa'
import { FaArrowLeft, FaPlus } from 'react-icons/fa6'
import { Apis, GetApi, PostApi } from 'services/Api'
import { errorMessage, successMessage } from 'utils/functions'
import loanimg from 'assets/dashboard/loan1.png'
import { useSelector } from 'react-redux'
import { FaChevronRight } from "react-icons/fa6";
import ButtonComponent from 'utils/ButtonComponent'
import ReviewLoan from 'utils/ReviewLoan'

const Loans = () => {

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({})
    const [screen, setScreen] = useState(1)
    const profile = useSelector((state) => state.profile.profile)

    const fetchUser = useCallback(async () => {
        setLoading(true)
        try {
            const response = await GetApi(Apis.auth.profile)
            if (response.status === 200) {
                setData(response.data)
            } else {
                errorMessage(response.msg)
            }

        } catch (error) {
            errorMessage(error.message)
        } finally {
            setLoading(false)
        }
    }, [])


    useEffect(() => {
        fetchUser()
    }, [])


    const frontRef = useRef()
    const backRef = useRef()
    const [forms, setForms] = useState({
        firstname: '',
        lastname: '',
        marital: '',
        address: '',
        dob: '',
        id_type: '',
        zip: '',
        id_number: ''
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


    const handleImageFront = (e) => {
        const file = e.target.files[0]
        setfrontImg({
            img: URL.createObjectURL(file),
            image: file
        })
    }
    const handleImageBack = (e) => {
        const file = e.target.files[0]
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
        
        console.log(forms, frontimg.image, backimg.image)
        if (!profile?.firstname) return errorMessage("Firstname field can't be empty")
        if (!profile?.lastname) return errorMessage("Lastname field is required")
        if (!forms.marital) return errorMessage("Marital status is required")
        if (!forms.dob) return errorMessage("Date of birth is required")
        if (!forms.address) return errorMessage("Adress is required")
        if (!forms.zip) return errorMessage("Zip code is required")
        if (!forms.id_type) return errorMessage("ID card type is required")
        if (!forms.id_number) return errorMessage("ID card number is required")
        if (frontimg.image === null) return errorMessage('ID front image is required')
        if (backimg.image === null) return errorMessage('ID back image is required')
        const formdata = new FormData()
        formdata.append('frontimg', frontimg.image)
        formdata.append('backimg', backimg.image)
        formdata.append('firstname', forms.firstname)
        formdata.append('lastname', forms.lastname)
        formdata.append('dob', forms.dob)
        formdata.append('marital', forms.marital)
        formdata.append('zip', forms.zip)
        formdata.append('address', forms.address)
        formdata.append('id_number', forms.id_number)
        formdata.append('id_type', forms.id_type)

         setScreen(3)
        
    }



    return (
        <div className=' h-fit full mt-5'>
            <div className="w-11/12 mx-auto">
                {screen === 1 &&
                    <>
                        <div className="w-full  bg-[#7e98ce] shadow-lg p-5   rounded-md">
                            <div className="font-semibold text-xl text-white">Complete your KYC now and apply for a loan</div>
                        </div>
                        <div className="w-full  bg-white shadow-lg p-5  my-4 rounded-md">
                            <div className="font-semibold text-xl ">Active Loans</div>
                            <div className="text-center ">Dear {profile?.firstname}, you have no active loans. </div>
                        </div>
                    </>
                }
                {screen === 1 &&
                    <>
                        <div className="my-10 text-2xl  text-center capitalize font-bold">Explore our loan packages</div>
                        {new Array(5).fill(0).map((item, i) => (
                            <div className="md:w-11/12 mx-auto  md:p-5 p-2 mb-3 bg-white rounded-md  shadow-lg" key={i}>
                                <div className="flex items-center justify-between gap-5 md:gap-0 ">
                                    <div className="w-1/2 flex flex-col items-center">
                                       
                                            <div className="">
                                                <img src={loanimg} className='md:w-52  md:h-52 object-cover rounded-sm' alt="loanimg" />
                                            </div>
                                            
                                
                                        <div className="">
                                                <div className="text-lg font-semibold">type: <span className='text-primary font-semibold'>Educational Loan</span></div>
                                            </div>
                                        <div className=" rounded-md py-1 flex items-center gap-3">
                                            <div className="md:text-lg text-center font-bold">Max Amount:</div>
                                            <div className="text-lg text-center font-bold text-primary">$2000</div>
                                        </div>
                                    </div>
                                    <div className="w-1/2 ">
                                        <div className="flex md:items-center w-full  flex-col gap-4 justify-between">
                                            <div className="flex md:items-center gap-2">
                                                <div className="">Interest:</div>
                                                <div className="">5%</div>

                                            </div>
                                            <div className="">
                                                <div onClick={() => setScreen(2)} className="flex w-fit px-5 py-2 rounded-md bg-primary items-center cursor-pointer gap-2  text-white">
                                                    <div className="lg:text-xl font-bold capitalize ">apply now</div>
                                                    <span><FaChevronRight className='text-2xl font-extrabold ' /></span>
                                                </div>
                                                <div className="md:text-xl font-semibold">Tenure upto 12 months</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                }

                {screen === 2 && <div className=" h-fit border rounded-md text-sm bg-[white] py-3  px-4">
                    <div className="text-2xl font-bold text-center my-4">Submit your details</div>
                    <form onSubmit={submitForm} className="w-full">
                        <div className="md:flex md:items-baseline gap-5 w-full ">
                            <div className="md:w-1/2">
                                <div className="flex flex-col w-full">
                                    <h1>First Name:</h1>
                                    <input value={profile?.firstname} type="text" className='w-full outline-none border-b h-8' />
                                </div>
                                <div className="flex flex-col w-full mt-3  ">
                                    <h1>Last Name:</h1>
                                    <input value={profile?.lastname} type="text" className='w-full outline-none border-b h-8' />
                                </div>

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
                                    <h1 >Date of Birth</h1>
                                    <div className="relative max-w-sm w-1/2">
                                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                            </svg>
                                        </div>
                                        <input name='dob' value={forms.dob} onChange={handleChange} datepicker datepicker-buttons datepicker-autoselect-today type="date" className="bg-white mt-2 border border-gray-300 text-gray-900 text-sm rounded-lg outline-none w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
    dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date" />
                                    </div>
                                </div>
                                <div className="flex flex-col w-full mt-3  ">
                                    <h1>Home Address:</h1>
                                    <input name='address' value={forms.address} onChange={handleChange} type="text" className='w-full outline-none border-b h-8 overflow-x-auto' />
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
                                        <option value="Passport">Passport/Passport ID</option>
                                        <option value="social security card">Social Security Card</option>
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
                                                <div onChange={changeImageback} className="absolute top-0 right-3 main font-bold ">
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
                        <div className="w-full flex mt-3 items-center justify-between gap-20">
                            <div className="w-1/2 ">
                                <div onClick={() => setScreen(1)} className="font-bold text-xl cursor-pointer text-white w-full text-center h-10 px-5 py-2 rounded-md bg-primary">back</div>
                            </div>
                            <div className="w-1/2 ml-auto">
                                <ButtonComponent title={`Submit Details`} bg={`bg-primary text-xl text-white h-10`} />
                            </div>
                        </div>
                    </form>

                </div>}


                {screen === 3 &&
                    <ReviewLoan setScreen={setScreen} />
                }
            </div>


        </div>

    )
}

export default Loans