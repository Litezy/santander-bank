import React, { useCallback, useEffect, useState } from 'react'
import { Apis, GetApi } from 'services/Api'
import { errorMessage } from 'utils/functions'
import Summary from './Summary'
import moment from 'moment'
import ModalLayout from 'utils/ModalLayout'

const Contacts = () => {

  const [data, setData] = useState([])

  const [selectedItem, setSelectedItem] = useState({})
  const [open, setOpen] = useState(false)
  const fetchContacts = useCallback(async () => {
    try {
      const res = await GetApi(Apis.admin.contacts)
      if (res.status === 200) {
        setData(res.data)
      } else {
        errorMessage(res.msg)
      }
    } catch (error) {
      console.log(error)
      errorMessage(error.message)
    }
  }, [])

  useEffect(() => {
    fetchContacts()
  }, [])


  const selectAny = (items) => {
    setSelectedItem(items)
  }
  return (
    <div className='w-11/12 mx-auto'>

      {open &&
        <ModalLayout clas={`w-11/12 mx-auto lg:w-[50%]`} setModal={setOpen}>
          <div className="w-full p-5 bg-white rounded-lg">
            <div className="w-full flex flex-col items-center gap-2">
              <div className="text-2xl font-bold">Message</div>
              <div className="">{selectedItem?.message}</div>
            </div>
          </div>
        </ModalLayout>
      }

      <div className="lg:w-2/4 w-3/4 mx-auto">
        <Summary color='bg-yellow-600 text-white' title={'Total Contact Feedbacks'} data={data.length} />
      </div>

      <div className="my-5 text-xl font-bold text-center ">Feedback Details</div>

      <div className="relative overflow-x-auto rounded-md mt-10">
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className=" bg-yellow-600 g:text-xl text-base text-white">
            <tr>
              <th scope="col" className="px-3 py-3">
                ID
              </th>
              <th scope="col" className="px-3 py-3">
                Name
              </th>
              <th scope="col" className="px-3 py-3">
                Email
              </th>
              <th scope="col" className="px-3 py-3">
                Subject
              </th>
              <th scope="col" className="px-3 py-3">
                Message
              </th>
              <th scope="col" className="px-3 py-3">

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
                  {item.name ? item.name : 'Anonymous'}
                </td>
                <td className="px-3 py-3">
                  {item.email ? item.email : 'Anonymous'}
                </td>
                <td className="px-3 py-3">
                  {item.subject ? item.subject : 'Anonymous'}
                </td>
                <td className="px-3 py-3">
                  {item.message.slice(0, 50)}
                </td>
                <td className="px-3 py-3">
                  <button onMouseOver={() => selectAny(item)} onClick={() => setOpen(true)} className='px-3 py-2 w-fit rounded-md bg-yellow-600 truncate text-white'>expand msg</button>
                </td>

              </tr>
            )) :
              <div className=" w-full text-lg font-semibold flex items-center justify-center">No contacts found</div>
            }

          </tbody>
        </table>


      </div>
    </div>
  )
}


export default Contacts