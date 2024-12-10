import React, { useCallback, useEffect, useState } from 'react'
import moment from 'moment'
import { Apis, GetApi } from 'services/Api'
import { errorMessage } from 'utils/functions'
import Summary from './Summary'
import PendingKycs from 'admin/utils/PendingKycs'
import ApprovedKycs from 'admin/utils/ApprovedKycs'
import { Link, useNavigate } from 'react-router-dom'

const UserKYCS = () => {

    const [users, setUsers] = useState([])
    const [active, setActive] = useState(0)

    const fetchKyc = useCallback(async () => {
        try {
            const response = await GetApi(Apis.admin.all_kycs)
            if (response.status !== 200) return console.log(response.msg)
            setUsers(response.data)
        } catch (error) {
            errorMessage(error.message)
        }
    }, [])

    useEffect(() => {
        fetchKyc()
    }, [])
    const Headers = [
        { title: 'Pending Kycs', id: 1, url: 'pending' },
        { title: 'Verified Kycs', id: 2, url: 'verified' },

    ]

    return (
        <div className='w-11/12 mx-auto '>
            {active === 0 && (
                <>
                    <div className="lg:w-2/4 w-3/4 mx-auto">
                        <Summary color='bg-black text-white' title={'Total KYC Submissions'} data={users.length} />
                    </div>
                    <div className="mt-10 font-semibold text-xl">Explore More Details</div>
                    <div className="my-10 lg:w-11/12 mx-auto flex flex-col items-start gap-5">
                        {Headers.map((item, i) => (
                            <div className="h-20 w-full flex items-center p-5 rounded-md justify-between bg-white" key={i}>
                                <div className="text-base font-semibold">{item.title}</div>
                                <Link to={`/admin/kycs/${item.url}`}
                                    className="px-5 py-2 rounded-lg bg-primary w-fit text-white cursor-pointer">
                                    viewmore
                                </Link>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )

}

export default UserKYCS