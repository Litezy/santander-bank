import CardComponent from 'components/user/CardComponent'
import React, { useState } from 'react'
import UserBanks from 'utils/UserBanks'

const LinkedAccounts = () => {
    const [add,setAdd] = useState(false)
  return (
    <div className='w-11/12 mx-auto mt-12'>
          <div className="my-10 relative">
                <CardComponent setAdd={setAdd} add={add} />
            </div>
            <div className="my-10 relative">
                <UserBanks setAdd={setAdd} add={add} />
            </div>
    </div>
  )
}

export default LinkedAccounts