import React, { useCallback, useEffect, useState } from 'react'
import Summary from './Summary'
import { useSelector } from 'react-redux'
import { Apis, GetApi, PostApi } from 'services/Api'
import { errorMessage, successMessage } from 'utils/functions'
import Loader from 'utils/Loader'
import ModalLayout from 'utils/ModalLayout'
import FormComponent from 'utils/FormComponent'
import ButtonComponent from 'utils/ButtonComponent'

const Banks = () => {
  const [banks, setBanks] = useState([])
  const profile = useSelector((state) => state.profile.profile)
  const [loading, setLoading] = useState(false)
  const [selectedItem, setSelectedItem] = useState({})
  const [add, setAdd] = useState(false)

  const fetchBanks = useCallback(async () => {
    try {
      const res = await GetApi(Apis.admin.admin_banks)
      if (res.status === 200) {
        setBanks(res.data)
      } else {
        console.log(res)
        errorMessage(res.smg)
      }
    } catch (error) {
      console.log(error)
      errorMessage(error.message)
    }
  }, [])

  useEffect(() => {
    fetchBanks()
  }, [profile])


  const select = (item) => {
    setSelectedItem(item)
  }
  const HideOrUnhide = async () => {
    const formdata = {
      id: selectedItem.id
    }
    setLoading(true)
    try {
      const res = await PostApi(Apis.admin.hide, formdata)
      if (res.status === 200) {
        successMessage(res.msg)
        fetchBanks()
      } else {
        errorMessage(res.msg)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const [forms, setForms] = useState({
    bank_name: '',
    account_no: '',
    fullname: '',
    bank_address: '',
    route_no: '',
    swift: '',
    iban: ''
  })

  const handleChange = (e) => {
    setForms({ ...forms, [e.target.name]: e.target.value })
  }


  const AddBank = async (e) => {
    e.preventDefault()
    if (!forms.fullname) return errorMessage(`First name is missing`)
    if (!forms.bank_name) return errorMessage(`Bank name is missing`)
    if (!forms.account_no) return errorMessage(`Account number is missing`)
    if (!forms.bank_address) return errorMessage(`Bank address is missing`)
    const formdata = {
      fullname: forms.fullname,
      account_no: forms.account_no,
      bank_name: forms.bank_name,
      bank_address: forms.bank_address,
      route_no: forms.route_no,
      swift: forms.swift,
      iban: forms.iban
    }
    setLoading(true)
    try {
      const res = await PostApi(Apis.admin.add_bank,formdata)
      if(res.status === 200){
        successMessage(res.msg)
        fetchBanks()
        setAdd(false)
      }else{
        errorMessage(res.msg)
      }
    } catch (error) {
      errorMessage(error.messaage)
      console.log(error)
    }finally{
      setLoading(false)
    }
  }

 const deleteBank = async ()=>{
  const formdata = {
    id: selectedItem.id
  }
  setLoading(true)
  try {
    const res = await PostApi(Apis.admin.remove_bank, formdata)
    if (res.status === 200) {
      successMessage(res.msg)
      fetchBanks()
    } else {
      errorMessage(res.msg)
    }
  } catch (error) {
    console.log(error)
  } finally {
    setLoading(false)
  }
 }
  return (
    <div className='w-11/12 mx-auto'>

      {add &&

        <ModalLayout setModal={setAdd} clas={`w-11/12 mx-auto lg:w-[70%]`}>
          <form onSubmit={AddBank} className="w-full bg-white p-5 rounded-md relative">

          {loading &&
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2">
            <Loader />
          </div>
        }
            <div className="my-4 text-primary font-bold text-center text-lg">Add Bank Account</div>
            <div className="flex items-start flex-col lg:w-1/2 mx-auto w-full gap-3">
              <div className="flex items-start gap-1 flex-col w-full ">
                <div className="">Full Name:</div>
                <FormComponent name={`fullname`} value={forms.fullname} onchange={handleChange} />
              </div>
              <div className="flex items-start gap-1 flex-col w-full">
                <div className="">Bank Name</div>
                <FormComponent name={`bank_name`} value={forms.bank_name} onchange={handleChange} />
              </div>
              <div className="flex items-start gap-1 flex-col w-full">
                <div className="">Account No:</div>
                <FormComponent formtype='phone' name={`account_no`} value={forms.account_no} onchange={handleChange} />
              </div>
              <div className="flex items-start gap-1 flex-col w-full">
                <div className="">Bank Address:</div>
                <FormComponent name={`bank_address`} value={forms.bank_address} onchange={handleChange} />
              </div>
              <div className="flex items-start gap-1 flex-col w-full">
                <div className="">Route No:</div>
                <FormComponent name={`route_no`} value={forms.route_no} onchange={handleChange} />
              </div>
              <div className="flex items-start gap-1 flex-col w-full">
                <div className="">Swift No:</div>
                <FormComponent name={`swift`} value={forms.swift} onchange={handleChange} />
              </div>
              <div className="flex items-start gap-1 flex-col w-full">
                <div className="">IBAN:</div>
                <FormComponent name={`iban`} value={forms.iban} onchange={handleChange} />
              </div>
            </div>
            <div className="lg:w-2/4 mx-auto mt-5">
              <ButtonComponent title={`Submit`} bg={`text-white h-12 bg-primary`} />
            </div>
          </form>
        </ModalLayout>
      }
      <div className="lg:w-2/4 w-3/4 mx-auto">
        <Summary color='bg-orange-500 text-white' title={'Total Admin Banks'} data={banks.length} />
      </div>
      <div className="relative overflow-x-auto rounded-md mt-10 ">
        {loading &&
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2">
            <Loader />
          </div>
        }
        <div onClick={() => setAdd(true)} className=" cursor-pointer my-4 w-fit ml-auto px-5 py-1 rounded-md bg-primary text-white">Add Bank</div>

        <div className="relative overflow-x-auto rounded-md">
        <table className="w-full text-sm text-left rtl:text-right rounded-md">
          <thead className=" bg-orange-500 text-base truncate text-white">
            <tr>
              <th scope="col" className="px-3 py-3">
                Bank Name
              </th>
              <th scope="col" className="px-3 py-3">
                Owner
              </th>
              <th scope="col" className="px-3 py-3">
                Address
              </th>
              <th scope="col" className="px-3 py-3">
                Account No.
              </th>
              <th scope="col" className="px-3 py-3">
                Route No.
              </th>
              <th scope="col" className="px-3 py-3">
                Swift No
              </th>
              <th scope="col" className="px-3 py-3">
                Iban No
              </th>
              <th scope="col" className="px-3 py-3">
                Hide/Unhide
              </th>
              <th scope="col" className="px-3 py-3">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {banks.length > 0 ? banks.map((item, i) => (
              <tr className="bg-white border-b " key={i}>
                <td scope="row" className="px-6 py-4 font-medium truncate text-gray-900 whitespace-nowrap ">
                  {item.bank_name}
                </td>
                <td className="px-3 truncate py-3">
                  {item.fullname}
                </td>
                <td className="px-3 py-3 truncate">
                  {item.bank_address}
                </td>
                <td className="px-3 py-3">
                  {item.account_no}
                </td>
                <td className="px-3 py-3">
                  {item.route_no}
                </td>
                <td className="px-3 py-3">
                  {item.swift}
                </td>
                <td className="px-3 py-3">
                  {item.iban}
                </td>
                <td className="px-3 py-3">
                  <button onClick={HideOrUnhide} onMouseOver={() => select(item)} className={`${item.hidden === 'true' ? 'bg-orange-500' : 'bg-primary'} text-white px-3 rounded-lg py-2`}>{item.hidden === 'true' ? 'Unhide' : 'Hide'}</button>
                </td>
                <td className="px-3 py-3">
                  <button onClick={deleteBank} onMouseOver={() => select(item)} className={` text-white px-3 bg-red-600 rounded-lg py-2`}>delete</button>
                </td>
              </tr>
            )) :
              <div className=" w-full text-lg font-semibold flex items-center justify-center">No transactions found</div>
            }

          </tbody>
        </table>
        </div>


      </div>
    </div>
  )
}

export default Banks