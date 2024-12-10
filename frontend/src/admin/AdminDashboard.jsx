import React, { useCallback, useEffect, useState } from 'react'
import { errorMessage } from 'utils/functions'

import { Apis, GetApi, profileImg } from 'services/Api'
import { useDispatch, useSelector } from 'react-redux'
import { dispatchCurrency, dispatchProfile, dispatchUserSavings } from 'app/reducer'
import axios from 'axios'
import ModalLayout from 'utils/ModalLayout'
import Summary from './adminComponents/Summary'

const AdminDashboard = () => {


    const dispatch = useDispatch();
    const [profile, setProfile] = useState(null);
    const [users, setUsers] = useState([])
    const [savings, setSavings] = useState('')
    const [kyc, setKyc] = useState([])
    const [transactions, setTransactions] = useState([])
    const [plans, setPlans] = useState([])
    const [contacts, setContacts] = useState([])
    const [pendingTransfers, setPendingTransfers] = useState([])
    const [amount, setAmount] = useState('')
    const [terminatedamount, setTerminatedAmount] = useState('')
    const [completedamount, setCompletedAmount] = useState('')
    const [deposits, setDeposits] = useState([])
    const [terminatedSavings, setTerminatedSavings] = useState([])
    const [completedSavings, setCompletedSavings] = useState([])
    const [tickets, setTickets] = useState([])
    const [actives, setActives] = useState([])
    const [closed, setClosed] = useState([])
    const [banks, setBanks] = useState([])
    const [adminBanks, setAdminBanks] = useState([])
    const [cards, setCards] = useState([])
    const [pendingKycs, setPendingKycs] = useState([])
    const [approvedKycs, setApprovedKycs] = useState([])
    const [news, setNews] = useState([])
    const [reversed, setReversed] = useState([])



    const fetchUser = useCallback(async () => {
        try {
            const response = await GetApi(Apis.auth.profile)
            if (response.status === 200) {
                setProfile(response.data)
            } else {
                console.log(response.msg)
            }
        } catch (error) {
            errorMessage(error.message)
            console.log(error)
        }
    }, [])

    useEffect(() => {
        fetchUser()
    }, [])
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
    const fetchActiveChats = useCallback(async () => {
        try {
            const res = await GetApi(Apis.admin.all_active_tickets)
            if (res.status !== 200) return;
            setActives(res.data)
        } catch (error) {
            errorMessage(error.message)
        }
    }, [])
    const fetchClosedChats = useCallback(async ()=>{
        try {
            const res = await GetApi(Apis.admin.all_closed_tickets)
            if(res.status !== 200) return ;
                setClosed(res.data)
        } catch (error) {
           errorMessage(`error in fethcing closed messages`, error.message) 
        } 
    },[])

    const fetchUserSavings = useCallback(async () => {
        try {
            const response = await GetApi(Apis.admin.all_depo)
            if (response.status === 200) {
                setSavings(response.data)
            } else {
                console.log(response.msg)
            }
        } catch (error) {
            console.error('Error fetching currency:', error);
        }
    }, [])
    const fetchTransactions = useCallback(async () => {
        try {
            const response = await GetApi(Apis.admin.all_trans)
            if (response.status === 200) {
                setTransactions(response.data)
            } else {
                console.log(response.msg)
            }
        } catch (error) {
            console.error('Error fetching currency:', error);
        }
    }, [])
    const fetchSavingsPlans = useCallback(async () => {
        try {
            const response = await GetApi(Apis.admin.all_plans)
            if (response.status === 200) {
                setPlans(response.data)
            } else {
                console.log(response.msg)
            }
        } catch (error) {
            console.error('Error fetching currency:', error);
        }
    }, [])

    const fetchKyc = useCallback(async () => {
        try {
            const response = await GetApi(Apis.admin.all_kycs)
            if (response.status !== 200) return ;
            setKyc(response.data)
        } catch (error) {
            errorMessage(error.message)
        }
    }, [])

    const fetchPendingKyc = useCallback(async () => {
        try {
            const response = await GetApi(Apis.admin.pending_kycs)
            if (response.status !== 200) return ;
            setPendingKycs(response.data)
        } catch (error) {
            errorMessage(error.message)
        }
    }, [])

    const fetchNews = useCallback( async ()=>{
        try {
          const res = await GetApi(Apis.admin.subs)
          if(res.status === 200 ){
            setNews(res.data)
          }else{
            errorMessage(res.msg)
          }
        } catch (error) {
          errorMessage(error.message)
        }
      },[])

    const fetchApprovedKyc = useCallback(async () => {
        try {
            const response = await GetApi(Apis.admin.verified_kycs)
            if (response.status !== 200) return ;
            setApprovedKycs(response.data)
        } catch (error) {
            errorMessage(error.message)
        }
    }, [])
    const fetchContacts = useCallback(async () => {
        try {
            const response = await GetApi(Apis.admin.all_contacts)
            if (response.status !== 200) return ;
            setContacts(response.data)

        } catch (error) {
            errorMessage(error.message)
        }
    }, [])
    const fetchAllDeposits = useCallback(async () => {
        try {
            const response = await GetApi(Apis.admin.all_deposits)
            if (response.status !== 200) return ;
            setDeposits(response.data)

        } catch (error) {
            errorMessage(error.message)
        }
    }, [])
    const fetchAllTransfers = useCallback(async () => {
        try {
            const response = await GetApi(Apis.admin.pending_transfers)
            if (response.status !== 200) return ;
            setPendingTransfers(response.data)
            setAmount(response.amount)

        } catch (error) {
            errorMessage(error.message)
        }
    }, [])
    const fetchAllTickets = useCallback(async () => {
        try {
            const response = await GetApi(Apis.admin.all_tickets)
            if (response.status !== 200) return ;
            setTickets(response.data)

        } catch (error) {
            errorMessage(error.message)
        }
    }, [])
    const fetchAllTerminatedSavings = useCallback(async () => {
        try {
            const response = await GetApi(Apis.admin.terminated_savings)
            if (response.status !== 200) return ;
            setTerminatedSavings(response.data)
            setTerminatedAmount(response.amount)
        } catch (error) {
            errorMessage(error.message)
        }
    }, [])
    const fetchAllCompletedSavings = useCallback(async () => {
        try {
            const response = await GetApi(Apis.admin.completed_savings)
            if (response.status !== 200) return ;
            setCompletedSavings(response.data)
            setCompletedAmount(response.amount)
        } catch (error) {
            errorMessage(error.message)
        }
    }, [])
    const fetchUserBanks = useCallback(async () => {
        try {
            const res = await GetApi(Apis.admin.all_banks)
            if (res.status !== 200) return ;
            setBanks(res.data)
        } catch (error) {
            errorMessage(error.message)
        }
    }, [])

    const fetchUserCards = useCallback(async () => {
        try {
            const res = await GetApi(Apis.admin.all_cards)
            if (res.status !== 200) return ;
            setCards(res.data)
        } catch (error) {
            errorMessage(error.message)
        }
    }, [])
    const fetchAdminBanks = useCallback(async () => {
        try {
          const res = await GetApi(Apis.admin.admin_banks)
          if (res.status !== 200) return ;
            setAdminBanks(res.data)
        } catch (error) {
          console.log(error)
          errorMessage(error.message)
        }
      }, [])
    const fetchReveresedTrans = useCallback(async () => {
        try {
          const res = await GetApi(Apis.admin.reversed_trans)
          if (res.status !== 200) return ;
            setReversed(res.data)
        } catch (error) {
          console.log(error)
          errorMessage(error.message)
        }
      }, [])
    useEffect(() => {
        fetchUsers()
        fetchTransactions()
        fetchUserSavings()
        fetchSavingsPlans()
        fetchKyc()
        fetchContacts()
        fetchActiveChats()
        fetchClosedChats()
        fetchAllCompletedSavings()
        fetchAllDeposits()
        fetchAllTickets()
        fetchAllTerminatedSavings()
        fetchAllTransfers()
        fetchAdminBanks()
        fetchUserBanks()
        fetchUserCards()
        fetchPendingKyc()
        fetchApprovedKyc()
        fetchNews()
        fetchReveresedTrans()
    }, [profile, dispatch])



    return (
        <div className=' md:mt-5 w-11/12 mx-auto h-fit py-10   '>
            <div className="md:grid block md:grid-cols-2 md:w-full lg:grid-cols-3 w-3/4 mx-auto gap-5 ">
                <Summary color='bg-black text-white' title={'Total Users'} data={users.length} />
                <Summary color='bg-blue-500  text-white' title={"Total User's Balance"} data={`$${savings}`} />
                <Summary color='bg-green-500 text-white' title={'Total Transactions'} data={transactions.length} />
                <Summary color='bg-red-400 text-white' title={"Total Deposits"} data={deposits.length} />
                <Summary color='bg-red-600 text-white' title={"Total User Banks"} data={banks.length} />
                <Summary color='bg-red-900 text-white' title={"Total Admin Banks"} data={adminBanks.length} />
                <Summary color='bg-orange-900 text-white' title={"Total User Cards"} data={cards.length} />
                <Summary color='bg-orange-500 text-white' title={'Total Savings Plans'} data={plans.length} />
                <Summary color='bg-purple-500 text-white' title={"Total Pending Transfers"} data={pendingTransfers.length} />
                <Summary color='bg-purple-700 text-white' title={"Total Pending Transfers Amount"} data={`$${amount}`} />
                <Summary color='bg-slate-500 text-white' title={"Total Terminated Savings"} data={terminatedSavings.length} />
                <Summary color='bg-sky-500 text-white' title={"Total Terminated Savings Amount"} data={`$${terminatedamount}`} />
                <Summary color='bg-slate-700 text-white' title={"Total Completed Savings"} data={completedSavings.length} />
                <Summary color='bg-sky-700 text-white' title={"Total Completed Savings Amount"} data={`$${completedamount}`} />
                <Summary color='bg-sky-300 text-white' title={"Total Reversed Transactions"} data={`${reversed.length}`} />
                <Summary color='bg-yellow-300 text-white' title={"Total KYC's"} data={kyc.length} />
                <Summary color='bg-yellow-600 text-white' title={"Total Pending KYC's"} data={pendingKycs.length} />
                <Summary color='bg-yellow-900 text-white' title={"Total Approved KYC's"} data={approvedKycs.length} />
                <Summary color='bg-indigo-400 text-white' title={"Total Tickets"} data={tickets.length} />
                <Summary color='bg-indigo-600 text-white' title={"Total Active Tickets"} data={actives.length} />
                <Summary color='bg-indigo-900 text-white' title={"Total Closed Tickets"} data={closed.length} />
                <Summary color='bg-blue-700 text-white' title={"Total Contacts"} data={contacts.length} />
                <Summary color='bg-pink-600 text-white' title={"Total Newsletter Subscribers"} data={news.length} />
            </div>
        </div>
    )


}
export default AdminDashboard