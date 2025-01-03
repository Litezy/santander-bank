import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { FaMinus } from 'react-icons/fa6'
import { IoIosMailUnread } from 'react-icons/io'
import { useSelector } from 'react-redux'
import { Apis, GetApi } from 'services/Api'
import { errorMessage, successMessage } from 'utils/functions'
import { FaCopy, FaFilter } from "react-icons/fa";
import Loader from 'utils/Loader'
import { useNavigate } from 'react-router-dom'
import { CiFilter } from "react-icons/ci";

const Transactions = () => {
  const [transdata, setTransData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [selectedItem, setSelectedItem] = useState({})
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 10
  const profile = useSelector((state)=> state.profile.profile)

  const fetchTransHistory = useCallback(async () => {
    setLoading(true)
    try {
      const response = await GetApi(Apis.auth.trans_history)
      if (response.status === 200) {
        setTransData(response.data)
        setFilteredData(response.data) // Initialize filteredData with the fetched data
      } else {
        console.log(response.msg)
      }
    } catch (error) {
      errorMessage(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTransHistory()
  }, [fetchTransHistory])

  const currency = useSelector((state) => state.profile.currency)
  const navigate = useNavigate()

  const npage = Math.ceil(filteredData.length / recordsPerPage)
  const lastIndex = currentPage * recordsPerPage
  const firstIndex = lastIndex - recordsPerPage
  const records = filteredData.slice(firstIndex, lastIndex)

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const nextPage = () => {
    if (currentPage < npage) {
      setCurrentPage(currentPage + 1)
    }
  }

  const copyToClip = async () => {
    try {
      await navigator.clipboard.writeText(selectedItem.transaction_id)
      successMessage('Transaction ID copied!')
    } catch (err) {
      errorMessage('Failed to copy!')
    }
  }

  const filterData = (val) => {
    if (val) {
      const lowerVal = val.toLowerCase()
      const filterID = transdata.filter((item) => item.transaction_id?.toLowerCase().includes(lowerVal))
      if (filterID.length > 0) return setFilteredData(filterID)

      const filterType = transdata.filter((item) => item.type?.toLowerCase().includes(lowerVal))
      if (filterType.length > 0) return setFilteredData(filterType)

      const filterStatus = transdata.filter((item) => item.status?.toLowerCase().includes(lowerVal))
      if (filterStatus.length > 0) return setFilteredData(filterStatus)

      return setFilteredData(transdata)
    } else {
      setFilteredData(transdata)
    }
  }
  const newCurr = useSelector((state) => state.profile.newCurr)
  const terminated = 'Goal Savings Terminated'
  return (
    <div className='w-full'>
      <div className=" relative mx-auto mt-1 lg:mt-3 ">
        <div className="lg:w-[78.8%] md:w-[98.25%]  mb-5 pt-5 w-[100%] bg-white  overflow-y-hidden overflow-x-hidden fixed  h-fit px-5 py-2">
          <div className="border-b pb-2 text-xl lg:text-2xl font-semibold">Transaction History</div>
          {records.length > 0 && <div className="flex items-center justify-center mt-2 flex-col w-11/12 mx-auto">
            <input onKeyUp={(e) => filterData(e.target.value.toLowerCase())} type="text" className='w-10/12 lg:w-1/2 pl-2 bg-slate-100 h-12 border rounded-md outline-none'
              placeholder='Filter by transaction ID, Type , Status '
            />
          </div>}
        </div>

        {loading && 
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2">
            <Loader />
          </div>
        }

        <div className=" w-11/12 pt-[9rem] mx-auto">
          {records.length > 0 ? records.map((item, index) => (
            <div className="rounded-xl mb-3 bg-white shadow-md border" key={index}>
              <div className="flex flex-col">
                <div className="p-3 border-b last:border-none cursor-pointer">
                  <div className="grid grid-cols-2">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full p-1 bg-blue-300 text-blue-50">
                        <div className="bg-blue-400 rounded-full p-1">
                          <IoIosMailUnread className='text-xl' />
                        </div>
                      </div>
                      <div className="text-sm font-bold">{item.type}</div>
                      <FaMinus className='text-slate-500 hidden lg:block' />
                      <div className={`text-xs font-semibold hidden lg:block ${item.status === 'success' ? 'text-green-600' : item.status === 'pending' ? 'text-yellow-500' : 'text-red-600'}`}>{item.status}</div>
                    </div>
                    <div className="">
                      <div className={`text-base font-bold text-right 
                        ${item.type === 'Deposit' && item.status === 'pending' ? 'text-yellow-500' :
                          item.type === 'Deposit' && item.status === 'success' ? 'text-green-600' :
                            item.type === terminated && item.status === 'success' ? 'text-green-600' : "text-red-600"
                        }`}>
                        {item.type === 'Deposit' && item.status === 'success' ? '+' :
                          item.type === 'Deposit' && item.status === 'pending' ? '' :
                            item.type === terminated && item.status === 'success' ? '+' : '-'}{profile?.currency === '?' ? newCurr : currency}{parseInt(item.amount).toLocaleString()}
                      </div>
                      <div className="text-xs text-right">{item.date}</div>
                    </div>
                  </div>
                  <div className="text-sm text-slate-500">{item.message}</div>
                  <div className="flex items-center gap-3 text-sm mt-2 text-slate-500">
                    <div>Transaction ID:</div>
                    <div>{item.transaction_id}</div>
                    <div onClick={copyToClip} onMouseOver={() => setSelectedItem(item)}>
                      <FaCopy className='text-blue-400 text-lg' />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )) :
            <>
              <div className="text-center w-full">No transactions data found</div>
              <div onClick={() => navigate('/user')} className="text-center w-full mt-5 underline text-primary text-base cursor-pointer">Go back to dashboard</div>
            </>
          }
        </div>

        {records.length > 0 && (
          <div className="w-fit ml-auto mr-5 mt-10 mb-5">
            <div className="w-full flex flex-col items-center">
              <span className="text-sm text-gray-700">
                Showing <span className="font-semibold text-black">{(records.length > 0 && firstIndex === 0) ? '1' : firstIndex + 1}</span> to
                <span className="font-semibold text-black"> {lastIndex > filteredData?.length ? filteredData?.length : lastIndex}</span> of
                <span className="font-semibold text-black"> {filteredData?.length} </span>
                Transactions
              </span>
              <div className="flex items-center gap-3 mt-2">
                <button onClick={prevPage} className="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-col rounded-md">
                  Prev
                </button>
                <button onClick={nextPage} className="flex items-center justify-center px-4 h-10 text-base font-medium text-white bg-col rounded-md">
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Transactions


//  Toppings function
// const [pizza,setPizza] = useState({ base:'', toppings:[]})
// to update base = 
// const addBase = (base) =>{
//   setPizza(prev => ({...prev, base}))
// }

// const addToppings = (topping) =>{
//   let newToppings;
//   if(!pizza.toppings.includes(topping)){
//     newToppings = [...pizza.toppings, topping]
//   } else{
//     newToppings = pizza.toppings.filter(item => item !== topping)
//   }
//   setPizza({...pizza,toppings:newToppings})
// }

// bg-gradient-to-tr from-[#021526]   to-[#201E43]