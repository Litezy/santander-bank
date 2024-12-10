import React, { useCallback, useEffect, useRef, useState } from 'react'
import { CiUser } from "react-icons/ci";
import ButtonComponent from 'utils/ButtonComponent';
import FormComponent from 'utils/FormComponent';
import { FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { Apis, ClientPostApi, GetApi, PostApi, profileImg } from 'services/Api';
import { errorMessage, successMessage } from 'utils/functions';
import { FaUserLarge } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { dispatchProfile } from 'app/reducer';
import Loader from 'utils/Loader';

const Profile = () => {

    const [profile, setProfile] = useState({})
    const fetchUserProfile = useCallback(async () => {
        try {
            const response = await GetApi(Apis.auth.profile)
            if (response.status === 200) {
                setProfile(response.data)
            } else {
                errorMessage(response.msg)
            }
        } catch (error) {
            errorMessage(error.message)
        }
    }
    )
    useEffect(() => {
        fetchUserProfile()
    }, [])

    const dispatch = useDispatch()
    const imageRef = useRef()
    const [edit, setEdit] = useState(false)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [forms, setForms] = useState({
        firstname: profile?.firstname ,
        lastname: profile?.lastname,
        phone: profile?.phone,
        country:  profile?.country,
        state:  profile?.state
    })
    const [userimg, setUserImg] = useState({
        img: '',
        image: ''
    })

    const handleProfile = (e) => {
        const file = e.target.files[0]
        if (file.size >= 1000000) {
            imageRef.current.value = null
            return errorMessage('file too large')
        }
        if (!file.type.startsWith(`image/`)) {
            imageRef.current.value = null
            return errorMessage('Invalid file format detected, try with a different photo')
        }
        setUserImg({
            img: URL.createObjectURL(file),
            image: file
        })

    }

    const changeImage = () => {
        if (imageRef.current) {
            imageRef.current.value = ''
        }
        setUserImg({
            img: '',
            image: ''
        })
    }

    const handleChange = (e) => {
        setForms({
            ...forms,
            [e.target.name]: e.target.value
        })
    }

    const saveImage = async () => {

        const formdata = new FormData()
        formdata.append('image', userimg.image)
        formdata.append('firstname', profile?.firstname)
        formdata.append('email', profile?.email)
        console.log(formdata)
        setLoading(true)
        try {
            const response = await ClientPostApi(Apis.non_auth.change_img, formdata)
            if (response.status === 200) {
                successMessage(response.msg)
                changeImage()
                dispatch(dispatchProfile(response.data))
            } else {
                errorMessage(response.msg)
            }
        } catch (error) {
            errorMessage(error.message)
        }finally{
            setLoading(false)
        }
    }

    const submitForm = async (e) => {
        e.preventDefault()
        if (!edit) {
            setEdit(true)
        }
        else if (edit) {
            setLoading(true)
            const formdata = {
                firstname: forms.firstname ? forms.firstname: profile?.firstname ,
                lastname: forms.lastname ? forms.lastname : profile?.lastname,
                email: profile?.email
            }

            // return console.log(formdata)
            try {
                const response = await PostApi(Apis.auth.edit_profile, formdata)
                if (response.status === 200) {
                    successMessage(response.msg)
                    setEdit(false)
                    dispatch(dispatchProfile(response.data))
                    setTimeout(()=>{
                        fetchUserProfile()
                    },3000)
                } else {
                    errorMessage(response.msg)
                }
            } catch (error) {
                console.log(`error in editing profile`, error)
            } finally {
                setLoading(false)
            }
        }

    }
    return (
        <div className='w-full lg:mt-10 mt-5'>
            <div className="w-11/12 mx-auto">
                <div className="text-2xl font-semibold">Personal Account</div>

                <div className="my-3 flex items-start flex-col md:flex-row gap-10  ">
                    <div className="md:w-1/2 w-full px-3 py-5 h-fit bg-white shadow-lg rounded-md relative">
                        {loading &&
                            <div className="absolute top-1/4 z-50 left-1/2 -translate-x-1/2  ">
                                <Loader />
                            </div>
                        }
                        <form onSubmit={submitForm} className="w-full">
                            <div className="mb-2 text-xl font-light">Edit Account</div>
                            <div className="w-full flex items-center justify-between">
                                <div className="w-fit cursor-pointer p-5 rounded-md flex border border-gray text-center ">
                                    <label className='relative'>
                                        {userimg.img ? <img src={userimg.img} className='h-32 w-32 rounded-full object-cover' /> :
                                            <div className="w-20 h-20  mx-auto flex items-center justify-center cursor-pointer">
                                                <input ref={imageRef} type="file" className='hidden' onChange={handleProfile} />
                                                <FaUserLarge className="text-6xl " />
                                            </div>}

                                        {userimg.img && <FaEdit onClick={changeImage} className='absolute top-3 right-0 cursor-pointer text-2xl' />}
                                    </label>
                                </div>
                                {userimg.img && <button onClick={saveImage} className='w-fit px-4 py-2 rounded-lg text-white bg-primary'>Save Image</button>}
                            </div>
                            <div className="mt-5 w-full flex items-start flex-col gap-5">
                                <div className="flex items-start w-full  justify-between gap-5">
                                    <div className="flex items-start flex-col gap-1 lg:w-1/2 w-full">
                                        <div className="">First Name</div>
                                        <FormComponent onchange={handleChange} name={`firstname`} value={edit ?forms.firstname :profile?.firstname } />
                                    </div>
                                    <div className="flex items-start flex-col gap-1 lg:w-1/2 w-full">
                                        <div className="">Last Name</div>
                                        <FormComponent onchange={handleChange} name={`lastname`} value={ edit ?forms.lastname: profile?.lastname } />
                                    </div>
                                </div>
                                
                            </div>
                            <ButtonComponent title={`${edit ? 'Save Details' : "Click here to edit"}`} bg={` h-12 text-white mt-5 ${edit ? 'bg-primary':'bg-slate-400'}`} />
                        </form>
                    </div>
                    <div className="md:w-1/2 w-full h-fit pb-5  px-3 bg-white rounded-md">
                        <div className="mt-5 w-full flex items-start flex-col gap-5">
                            <div className="text-xl font-light ">Account Information</div>
                            <div className="w-full flex items-center justify-center">
                                {profile?.image ? <img src={`${profileImg}/profiles/${profile?.image}`} className='w-32 h-32 object-cover rounded-full' alt={`profile image`} /> :
                                    <div className=""></div>
                                }
                            </div>

                            <div className="flex items-start flex-col w-full justify-between gap-5">
                                <div className="flex items-start flex-col w-full ">
                                    <div className="">First Name</div>
                                    <FormComponent mutate={false}  value={profile?.firstname} />
                                </div>
                                <div className="flex items-start flex-col w-full ">
                                    <div className="">Last Name</div>
                                    <FormComponent mutate={false}  value={profile?.lastname} />
                                </div>
                                <div className="flex items-start flex-col w-full ">
                                    <div className="">Email Address</div>
                                    <FormComponent mutate={false} value={profile?.email} />
                                </div>
                                <div className="flex items-start flex-col w-1/4 ">
                                    <div className="">Sex</div>
                                    <FormComponent mutate={false} value={profile?.gender} formtype='sex' />
                                </div>
                                <div className="flex items-start flex-col w-full ">
                                    <div className="">Phone Number</div>
                                    <FormComponent mutate={false} value={`${profile?.phone}`} />
                                </div>

                                <div className="flex items-start flex-col w-full ">
                                    <div className="">Country</div>
                                    <FormComponent mutate={false} value={profile?.country} />
                                </div>
                                <div className="flex items-start flex-col w-full ">
                                    <div className="">State</div>
                                    <FormComponent mutate={false} value={profile?.state} />
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile