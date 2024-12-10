import React, { useCallback, useEffect, useState } from 'react'
import Summary from './Summary'
import { errorMessage } from 'utils/functions'
import { Apis, GetApi } from 'services/Api'
import moment from 'moment'

const Newsletters = () => {

    const [data,setData] = useState([])

    const fetchNews = useCallback( async ()=>{
      try {
        const res = await GetApi(Apis.admin.subs)
        if(res.status === 200 ){
          setData(res.data)
        }else{
          errorMessage(res.msg)
        }
      } catch (error) {
        console.log(error)
        errorMessage(error.message)
      }
    },[])

    useEffect(()=>{
      fetchNews()
    },[])
  return (
    <div className='w-11/12 mx-auto'>
         <div className="lg:w-2/4 w-3/4 mx-auto">
        <Summary color='bg-slate-600 text-white' title={'Total Newsletter Subscribers'} data={data.length} />
      </div>

      <div className="my-5 text-xl font-bold text-center ">Susbscribers Details</div>

      <div className="relative overflow-x-auto rounded-md mt-10">
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className=" bg-slate-600 lg:text-xl text-base text-white">
            <tr>
              <th scope="col" className="px-3 py-3">
                ID
              </th>
              <th scope="col" className="px-3 py-3">
                Email
              </th>
              <th scope="col" className="px-3 py-3">
                Date Subcribed
              </th>
              
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? data.map((item, i) => (
              <tr className="bg-white border-b " key={i}>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                  {item.id}
                </th>
                <td className="px-3 py-3">
                  {item.email}
                </td>
                <td className="px-3 py-3">
                  {moment(item.createdAt).format(`DD-MM-YYYY hh:mm A`)}
                </td>
                
              </tr>
            )) :
              <div className=" w-full text-lg font-semibold flex items-center justify-center">No Subscribers found</div>
            }

          </tbody>
        </table>


      </div>
    </div>
  )
}

export default Newsletters