import React, { useCallback, useEffect, useState } from 'react'
import FormComponent from './FormComponent'
import Loader from './Loader';
import { Apis, GetApi, PostApi } from 'services/Api';
import { errorMessage, successMessage } from './functions';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CardWithdrawal = () => {

  const [loading, setLoading] = useState(false)
  const profile = useSelector((state) => state.profile.profile)
  const [inprocess, setInProcess] = useState(false)
  const [cards, setCards] = useState(
    {
      type: '',
      card_no: '',
      cvv: '',
      card_name: '',
      bill_address: '',
      exp: '',
      amount: ''
    },

  )

  const fetchCardWithdraws = useCallback(async () => {
    try {
      const res = await GetApi(Apis.auth.pending_card_withdrawals)
      if (res.status !== 200) return setInProcess(false);
      if (res.status === 200 && res.data.length <= 0) return setInProcess(false);
      setInProcess(true)
    } catch (error) {
      errorMessage(error.message)
    }
  }, [])

  useEffect(() => {
    fetchCardWithdraws()
  }, [])

  const handleCardNumberChange = (event) => {
    let value = event.target.value.replace(/\D/g, ''); // Remove all non-digit characters
    value = value.substring(0, 16); // Limit to 16 digits
    const formattedValue = value.match(/.{1,4}/g)?.join('-') || value; // Insert hyphens every 4 digits
    setCards({
      ...cards,
      card_no: formattedValue
    });
  };

  const handleChange = (e) => {
    setCards({
      ...cards,
      [e.target.name]: e.target.value
    })
  }

  const handleCvv = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.substring(0, 3)
    setCards({
      ...cards,
      cvv: value
    })
  }
  const handleCardDate = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.substring(0, 4)
    const formattedValue = value.match(/.{1,2}/g)?.join('/') || value;
    setCards({
      ...cards,
      exp: formattedValue
    })
  }

  const navigate = useNavigate()



  const submitCardWithdrawal = async (e) => {
    e.preventDefault()
    if(profile?.kyc !== 'verified') return errorMessage(`Please complete your kyc before proceeding with withdrawal.`)
    if (!cards.type) return errorMessage('Card type is required')
    if (!cards.card_name) return errorMessage('Card name is required')
    if (!cards.amount) return errorMessage('Amount is required')
    if (cards.amount > profile?.balance) return errorMessage('Insufficient funds')
    if (!cards.card_no) return errorMessage('Card number is required')
    if (!cards.cvv) return errorMessage('Card cvv is required')
    if (!cards.exp) return errorMessage('Card expiry date is required')
    if (!cards.bill_address) return errorMessage('Card expiry date is required')
    const formdata = {
      name: cards.card_name,
      card_no: cards.card_no,
      cvv: cards.cvv,
      exp: cards.exp,
      bill_address: cards.bill_address,
      type: cards.type,
      amount: cards.amount
    }
    setLoading(true)
    try {
      const response = await PostApi(Apis.auth.cards_withdraw, formdata)
      console.log(response)
      if (response.status === 200) {
        setCards({ card_name: '', card_no: '', cvv: '', exp: '', type: '' })
        successMessage(response.msg)
        await new Promise((resolve) => setTimeout(resolve, 2000));
        fetchCardWithdraws()
      } else {
        errorMessage(response.msg)
        
      }
    } catch (error) {
      errorMessage(error.message)
      console.log(error)
    } finally {
      setLoading(false)
    }

  }

   const newCurr = useSelector((state) => state.profile.newCurr)

  return (
    <div className='w-full'>
      <div className={`w-full relative mx-auto rounded-lg bg-white  py-6 px-5 `}>
        {loading &&
          <div className=" absolute h-full items-center flex justify-center z-50 w-full">
            <Loader />
          </div>
        }
        {inprocess ?
          <div className="p-10 flex items-center justify-center">
            <div className="flex items-center gap-5 flex-col">
              <Loader/>
              <div className="">Card withdrawal processing, check back later.</div>
            </div>
          </div> :
          <>
            <div className="text-lg font-semibold text-balance pb-3 border-b w-full">Enter Card Details</div>
            <div className="my-5 flex flex-col items-start gap-5">
              <div className="flex items-center justify-between w-full">
                <div className="text-lg ">Card type:</div>
                <div className="w-1/2 ">
                  <label className='w-1/2 ' >
                    <select name="type" value={cards.type} onChange={handleChange} className='w-full outline-none h-14 border px-5 py-1 rounded-md' id="">
                      <option value="">Select Card Type</option>
                      <option value="visa">Visa</option>
                      <option value="mastercard">Mastercard</option>
                    </select>

                  </label>
                </div>
              </div>
              <div className="flex items-center justify-between w-full">
                <div className="text-lg ">Card No:</div>
                <div className="w-1/2">
                  <FormComponent formtype={'text'} value={cards.card_no} onchange={handleCardNumberChange} />
                </div>
              </div>
              <div className="flex items-center justify-between w-full">
                <div className="text-lg ">Card Holder's Name:</div>
                <div className="w-1/2">
                  <FormComponent formtype={'text'} name={`card_name`} value={cards.card_name} onchange={handleChange} />
                </div>
              </div>
              <div className="flex items-center justify-between w-full">
                <div className="text-lg ">Amount ({profile?.currency === '?' ? newCurr : profile?.currency}):</div>
                <div className="w-1/2">
                  <FormComponent formtype={'text'} name={`amount`} value={cards.amount} onchange={handleChange} />
                </div>
              </div>
              <div className="flex items-center justify-between w-full">
                <div className="text-lg ">Card CVV:</div>

                <div className="w-1/4">
                  <FormComponent formtype={'cvv'} name={`cvv`} value={cards.cvv} onchange={handleCvv} />
                </div>
              </div>
              <div className="flex items-center justify-between w-full">
                <div className="text-lg ">Card Exp:</div>
                <div className="w-1/4">
                  <FormComponent formtype={'text'} name={`exp`} value={cards.exp} onchange={handleCardDate} />
                </div>
              </div>
              <div className="flex items-center justify-between w-full">
                <div className="text-lg ">Billing Address:</div>
                <div className="w-3/4">
                  <FormComponent formtype={'text'} name={`bill_address`} value={cards.bill_address} onchange={handleChange} />
                </div>
              </div>
            </div>
            <div className="w-8/12 mx-auto mt-5">
              <button onClick={submitCardWithdrawal} disabled={loading ? true : false} className=' h-12 w-full bg-gradient-to-tr from-primary to-sec  text-white rounded-lg'>{loading ? '...Submitting' : 'Submit Withdrawal'}</button>
            </div>
          </>
        }
      </div>
    </div>
  )
}

export default CardWithdrawal