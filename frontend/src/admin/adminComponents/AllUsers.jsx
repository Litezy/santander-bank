import React, { useCallback, useEffect, useState } from 'react'
import Summary from './Summary'
import { Apis, GetApi } from 'services/Api'
import { errorMessage } from 'utils/functions'
import UserBanks from 'admin/utils/UserBanks'
import UserCards from 'admin/utils/UserCards'
import CreateUsers from 'admin/utils/CreateUsers'
import UserDetails from 'admin/utils/UserDetails'


const AllUsers = () => {
  const [users, setUsers] = useState([])
  const [selectedItem, setSelectedItem] = useState({})
  const [active, setActive] = useState(0)

  const fetchUsers = useCallback(async () => {
    try {
      const response = await GetApi(Apis.admin.all_users)
      if (response.status === 200) {
        setUsers(response.data)
      } else {
        console.log(response.msg)
      }
    } catch (error) {
      errorMessage(error.message)
      console.log(error)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const userHeaders = [
    { title: 'User Banks', id: 1 },
    { title: 'User Cards', id: 2 },
    { title: 'Create Users', id: 3 },
    { title: 'Users Details', id: 4 },
  ]

  return (
    <div className='w-11/12 mx-auto mt-3'>
      {active === 0 && (
        <>
          <div className="lg:w-2/4 w-3/4 mx-auto">
            <Summary color='bg-black text-white' title={'Total Users'} data={users.length} />
          </div>
          <div className="mt-10 font-semibold text-xl">Explore More User Details</div>
          <div className="my-10 lg:w-11/12 mx-auto flex flex-col items-start gap-5">
            {userHeaders.map((item, i) => (
              <div className="h-20 w-full flex items-center p-5 rounded-md justify-between bg-white" key={i}>
                <div className="text-base font-semibold">{item.title}</div>
                <div 
                  onClick={() => {
                    setActive(item.id)
                  }} 
                  className="px-5 py-2 rounded-lg bg-primary w-fit text-white cursor-pointer">
                  viewmore
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {active === 1 && <UserBanks setActive={setActive} />}
      {active === 2 && <UserCards setActive={setActive} />}
      {active === 3 && <CreateUsers setActive={setActive} />}
      {active === 4 && <UserDetails setActive={setActive} />}
    </div>
  )
}

export default AllUsers
