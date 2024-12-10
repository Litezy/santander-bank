import Summary from 'admin/adminComponents/Summary'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { IoReturnUpBackOutline } from 'react-icons/io5'
import { Apis, GetApi, PostApi, profileImg } from 'services/Api'
import { errorMessage, successMessage } from 'utils/functions'
import moment from 'moment'
import ModalLayout from 'utils/ModalLayout'
import FormComponent from 'utils/FormComponent'
import ButtonComponent from 'utils/ButtonComponent'
import Loader from 'utils/Loader'
import { useSelector } from 'react-redux'

const ValidateDeposit = ({ setScreen }) => {

  const [proofs, setProofs] = useState([])
  const [selectedItem, setSelectedItem] = useState([])
  const [modal, setModal] = useState(false)
  const [validate, setValidate] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [decline, setDecline] = useState(false)


  const getProofs = useCallback(async () => {
    try {
      const res = await GetApi(Apis.admin.all_proofs)
      if (res.status === 200) {
        setProofs(res.data)
        // console.log(res.data)
      } else {
        errorMessage(res.msg)
      }
    } catch (error) {
      console.log(error)
      errorMessage(error.message)
    }
  }, [])
  const [forms, setForms] = useState({
    amount: ''
  })

  const handleChange = (e) => {
    setForms({ ...forms, [e.target.name]: e.target.value })
  }
  useEffect(() => {
    getProofs()
  }, [])

  const val = useRef(null)
  
  useEffect(() => {
    if (val) {
      window.addEventListener('click', (e) => {
        if (val.current && !val.current.contains(e.target)) {
          setValidate(false)
          setDecline(false)
          // setConfirm(false)
        }
      }, true)
    }
  }, [])


  const selectItem = (item) => {
    setSelectedItem(item)
  }

  const ValidatePayment = async (e) => {
    e.preventDefault()
    const formdata = {
      id: selectedItem?.id,
      amount: selectedItem?.amount
    }
    //  return console.log(formdata)
    setConfirm(false)
    setLoading(true)
    try {
      const res = await PostApi(Apis.admin.validate_depo, formdata)
      // console.log(res)
      if (res.status == 200) {
        successMessage(res.msg)
        setModal(false)
        getProofs()
      } else {
        errorMessage(res.msg)
      }
    } catch (error) {
      errorMessage(error.message)
      console.log(error)
    }
    finally {
      setLoading(false)
    }
  }


  const declinePayment = async (e) => {
    e.preventDefault()
    const formdata = {
      id: selectedItem?.id,
    }
    setConfirm(false)
    setLoading(true)
    try {
      const res = await PostApi(Apis.admin.decline_depo, formdata)
      if (res.status == 200) {
        successMessage(res.msg)
        setModal(false)
        getProofs()
      } else {
        errorMessage(res.msg)
      }
    } catch (error) {
      errorMessage(error.message)
      console.log(error)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="w-full flex items-center justify-between">

        {modal &&
          <ModalLayout setModal={setModal} clas={`w-11/12 mx-auto lg:w-[60%]`}>
            <div className="  rounded-lg bg-white p-5 w-full relative">


              {confirm &&
                <div  className="absolute p-5 rounded-md w-11/12 lg:w-2/4 top-1/2 left-1/2 -translate-x-1/2 backdrop-blur-sm bg-primary h-fit">
                  <div className="text-xl font-bold text-center text-white">Take Action?</div>
                  <div className="my-4 flex items-center justify-between">
                    <button onClick={() => setDecline(true)} className='w-fit px-5 py-1 rounded-md bg-red-500 text-white'>decline</button>
                    <button onClick={() => setValidate(true)} className='w-fit px-5 py-1 rounded-md bg-green-500 text-white'>validate</button>
                  </div>
                </div>

              }
              {decline &&
                <div ref={val} className="absolute p-5 rounded-md w-11/12 lg:w-2/4 top-1/2 left-1/2 -translate-x-1/2 backdrop-blur-sm bg-primary  h-fit">
                  <div className="text-xl font-bold text-center text-white">Confirm Decline</div>
                  <div className="my-4 flex items-center justify-between">
                    <button onClick={() => setDecline(false)} className='w-fit px-5 py-1 bg-primary rounded-md  text-white'>cancel</button>
                    <button onClick={declinePayment} className='w-fit px-5 py-1 rounded-md bg-red-500 text-white'>decline</button>
                  </div>
                </div>

              }
              {validate &&
                <div ref={val} className="absolute p-5 rounded-md w-11/12 lg:w-2/4 top-1/2 left-1/2 -translate-x-1/2 backdrop-blur-sm bg-primary  h-fit">
                  <div className="text-xl font-bold text-center text-white">Confirm Approval</div>
                  <div className="my-4 flex items-center justify-between">
                    <button onClick={() => setValidate(false)} className='w-fit px-5 py-1 rounded-md bg-red-500 text-white'>cancel</button>
                    <button onClick={ValidatePayment} className='w-fit px-5 py-1 rounded-md bg-green-500 text-white'>proceed</button>
                  </div>
                </div>

              }
              {loading &&
                <div className="absolute bg-white  w-fit p-6 rounded-md top-1/2 left-1/2 -translate-x-1/2  ">
                  <Loader />
                </div>
              }

              <div className="my-3 font-semibold text-lg text-center">User Details</div>
              <div className="flex w-full items-start flex-col gap-2">
                <div className="flex items-center gap-1">
                  <div className="">First Name:</div>
                  <div className="font-semibold">{selectedItem?.userdeposits?.firstname}</div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="">Last Name: </div>
                  <div className="font-semibold">{selectedItem?.userdeposits?.lastname}</div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="">Amount Deposited: </div>
                  <div className="font-semibold">{selectedItem?.userdeposits?.currency}{selectedItem?.amount}</div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="">Date Submitted</div>
                  <div className="font-semibold"> {moment(selectedItem.createdAt).format(`DD-MM-YYYY hh:mm A`)}</div>
                </div>
              </div>

              <div className="my-3 font-semibold text-lg text-center">Proof of payment</div>
              <div className="w-11/12 mx-auto">
                <img src={`${profileImg}/deposits/${selectedItem.image}`}
                  className='w-fit h-fit'
                  alt="proof-img" />
              </div>

              <div className="w-2/4 mt-5 mx-auto ">
                <button onClick={() => setConfirm(true)} className=' bg-primary w-full py-3 rounded-lg  text-white '>Verify</button>
              </div>

            </div>
          </ModalLayout>
        }
        <div onClick={() => setScreen(0)} className="w-fit cursor-pointer mr-auto bg-primary text-white px-3 py-1 rounded-md">
          <IoReturnUpBackOutline className='text-2xl' />
        </div>
        <div className="text-lg font-semibold">Validate Deposits</div>
      </div>

      <div className="w-2/4 mx-auto">
        <Summary color='bg-green-500 text-white' title={'Proof of Deposits'} data={proofs.length} />
      </div>
      <div className=" my-5 text-lg">Check and Validate Deposits</div>

      <div className="relative overflow-x-auto rounded-md">
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className=" bg-primary text-xl text-white">
            <tr>
              <th scope="col" className="px-6 py-3">
                User
              </th>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                amount
              </th>
              <th scope="col" className="px-6 py-3">
                Date Submitted
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {proofs.length > 0 ? proofs.map((item, i) => (
              <tr className="bg-white border-b " key={i}>
                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                  {item.userdeposits?.firstname}  {item.userdeposits?.lastname}
                </td>
                <td className="px-6 py-4">
                  {item.userdeposits?.id}
                </td>
                <td className="px-6 py-4">
                  {item.userdeposits.currency}{item.amount}
                </td>
                <td className="px-6 py-4">
                  {moment(item.createdAt).format(`DD-MM-YYYY hh:mm A`)}
                </td>
                <td className="px-6 py-4">
                  <button onMouseOver={() => selectItem(item)} onClick={() => setModal(true)} className="bg-primary text-white px-5 rounded-lg py-2">review</button>
                </td>
              </tr>
            )) :
              <tr className=" w-full text-lg font-semibold flex items-center justify-center">
                <td>No deposits to validate</td>
              </tr>
            }

          </tbody>
        </table>


      </div>

    </div>
  )
}

export default ValidateDeposit