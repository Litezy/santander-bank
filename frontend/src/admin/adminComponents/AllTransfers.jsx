import React, { useCallback, useEffect, useState } from 'react'
import Summary from './Summary'
import { errorMessage } from 'utils/functions'
import { Apis, GetApi } from 'services/Api'
import ValidateDeposit from 'admin/utils/ValidateDeposit'
import InitiateDeposit from 'admin/utils/InitiateDeposit'
import InitateWithdrawal from 'admin/utils/InitateWithdrawal'
import SettledDeposits from 'admin/utils/SettledDeposits'

const AllTransfers = () => {
  const [screen, setScreen] = useState(0)
  const userHeaders = [
    { title: 'Validate Deposit', id: 1 },
    { title: 'Initiate Deposit', id: 2 },
    { title: 'Initiate Withdrawal', id: 3 },
    { title: 'Settled Deposits', id: 4 },
  ]

  const [transhistory, setTranshistory] = useState([])
  const getTransHistory = useCallback(async () => {
    try {
      const res = await GetApi(Apis.admin.all_trans)
      if (res.status === 200) {
        setTranshistory(res.data)
      } else {
        errorMessage(res.msg)
      }
    } catch (error) {
      console.log(error)
      errorMessage(error.message)
    }
  }, [])

  useEffect(()=>{
    getTransHistory()
  },[])
  return (
    <div className='w-11/12 mx-auto mt-3'>
      {screen === 0 && (
        <>
          <div className="w-2/4 mx-auto">
            <Summary color='bg-black text-white' title={'Total Transactions'} data={transhistory.length}/>
          </div>
          <div className="mt-10 font-semibold text-xl">Explore More Transfers</div>
          <div className="my-10 full  flex flex-col items-start gap-5">
            {userHeaders.map((item, i) => (
              <div className="h-20 w-full flex items-center p-5 rounded-md justify-between bg-white" key={i}>
                <div className="text-base font-semibold">{item.title}</div>
                <div
                  onClick={() => {
                    setScreen(item.id)
                  }}
                  className="px-5 py-2 rounded-lg bg-primary w-fit text-white cursor-pointer">
                  viewmore
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      
      {screen === 1 && <ValidateDeposit setScreen={setScreen}/>}
      {screen === 2 && <InitiateDeposit setScreen={setScreen}/> }
      {screen === 3 && <InitateWithdrawal setScreen={setScreen}/> }
      {screen === 4 && <SettledDeposits setScreen={setScreen}/> }
      
      </div>
  )
}

export default AllTransfers