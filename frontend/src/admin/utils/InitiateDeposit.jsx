import React, { useState } from 'react'
import { IoReturnUpBackOutline } from 'react-icons/io5'
import { Apis, GetApi, PostApi } from 'services/Api'
import ButtonComponent from 'utils/ButtonComponent'
import FormComponent from 'utils/FormComponent'
import { errorMessage, successMessage } from 'utils/functions'
import Loader from 'utils/Loader'

const InitiateDeposit = ({ setScreen }) => {
  const [loading, setLoading] = useState(false)
  const [userdata, setUserdata] = useState({})

  const [forms, setForms] = useState({
    email: '',
    amount: ''
  })

  const [view, setView] = useState(1)
  const handleChange = (e) => {
    setForms({
      ...forms,
      [e.target.name]: e.target.value
    })
  }

  const checkEmail = async (e) => {
    e.preventDefault()
    if (!forms.email) return errorMessage(`Email is required`)
    const formdata = {
      email: forms.email
    }
    setLoading(true)
    try {
      const res = await PostApi(Apis.admin.find_email, formdata)
      if (res.status === 200) {
        successMessage(res.msg)
        setUserdata(res.data)
        setView(2)
      } else {
        errorMessage(res.msg)
      }
    } catch (error) {
      errorMessage(error.mesage)
    } finally {
      setLoading(false)
    }

  }
  const deposit = async (e) => {
    e.preventDefault()
    if (!forms.amount) return errorMessage(`Amount is required`)
    if (forms.amount <= 0) return errorMessage(`Negative amount not allowed`)
    const formdata = {
      email: forms.email,
      amount: forms.amount
    }
    setLoading(true)
    try {
      const res = await PostApi(Apis.admin.inititate_depo, formdata)
      if (res.status === 200) {
        successMessage(res.msg)
        setForms({
          ...forms,
          email: '',
          amount: ''
        })
        setView(1)
      } else {
        errorMessage(res.msg)
      }
    } catch (error) {
      errorMessage(error.mesage)
    } finally {
      setLoading(false)
    }

  }
  return (
    <div>
      <div className="w-full flex items-center justify-between">
        <div onClick={() => setScreen(0)} className="w-fit cursor-pointer mr-auto bg-primary text-white px-3 py-1 rounded-md">
          <IoReturnUpBackOutline className='text-2xl' />
        </div>
        <div className="text-lg font-semibold">Initiate Deposits</div>
      </div>
      <div className="my-10 text-xl font-bold text-center">Find email and credit</div>
      {view === 1 && <div className="w-11/12 mx-auto bg-white rounded-lg  h-fit p-8 flex relative items-center justify-center">


        <form onSubmit={checkEmail} className="w-2/4 mx-auto flex flex-col relative items-start gap-2">
          {loading &&
            <div className="absolute w-20 rounded-md top-1/3 h-full left-1/2 -translate-x-1/2">
              <Loader />
            </div>
          }
          <div className="w-1/2 text-lg font-bold">Email Address</div>
          <FormComponent formtype='email' name={`email`} value={forms.email} placeholder={`Email address`} onchange={handleChange} />
          <div className="w-3/4 mx-auto mt-3">
            <ButtonComponent title={`Check Email`} bg={`bg-primary text-white h-10`} />
          </div>
        </form>
      </div>}
      {view === 2 && <div className="w-11/12 mx-auto bg-white h-fit p-8 rounded-lg flex items-center justify-center">
        <form onSubmit={deposit} className="w-2/4 mx-auto flex flex-col items-start gap-2">
          {loading &&
            <div className="absolute w-20 rounded-md top-1/2 h-full left-1/2 -translate-x-1/2">
              <Loader />
            </div>
          }
          <div className="text-lg font-bold text-center">User Details</div>
          <div className="flex items-center gap-3">
            <div className="text-lg font-bold">Name:</div>
            <div className="">{userdata.firstname} {userdata.lastname}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-lg font-bold">Email:</div>
            <div className="">{userdata.email}</div>
          </div>

          <div className="w-1/2 text-lg font-bold">Amount($)</div>
          <FormComponent formtype='phone' name={`amount`} value={forms.amount} onchange={handleChange} />
          <div className="w-3/4 mx-auto mt-3">
            <ButtonComponent title={`Deposit`} bg={`bg-primary text-white h-10`} />
          </div>
        </form>
      </div>}
    </div>
  )
}

export default InitiateDeposit