import React, { useCallback, useEffect, useRef, useState } from 'react'
import FormComponent from './FormComponent'
import Loader from './Loader';
import { Apis, GetApi, PostApi } from 'services/Api';
import { errorMessage, successMessage } from './functions';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaEdit, FaPlus } from 'react-icons/fa';
import Formbutton from './Formbutton';
import { MdDelete } from "react-icons/md";

const CardWithdrawal = () => {

  const [loading, setLoading] = useState(false)
  const [load, setLoad] = useState(false)
  const [cardPending, setCardPending] = useState([])
  const [paid, setPaid] = useState(false)
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
      setCardPending(res.data)
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




  const submitCardWithdrawal = async (e) => {
    e.preventDefault()
    if (profile?.kyc !== 'verified') return errorMessage(`Please complete your kyc before proceeding with withdrawal.`)
    if (!cards.type) return errorMessage('Card type is required')
    if (!cards.card_name) return errorMessage('Card name is required')
    if (!cards.amount) return errorMessage('Amount is required')
    if (profile?.balance === 0) return errorMessage('Top up your balance to proceed')
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
      amount: parseFloat(cards.amount)
    }
    // return console.log(formdata)
    setLoading(true)
    try {
      const response = await PostApi(Apis.auth.cards_withdraw, formdata)
      // console.log(response)
      if (response.status === 200) {
        setCards({ card_name: '', card_no: '', cvv: '', exp: '', type: '' })
        successMessage(response.msg)
        fetchCardWithdraws()
        await new Promise((resolve) => setTimeout(resolve, 1000));
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
  const imgRef = useRef()
  const [proofimg, setProofimg] = useState({
    img: "",
    image: ''
  })
  const handleImage = (e) => {
    const file = e.target.files[0]
    if (file.size >= 1000000) {
      imgRef.current.value = null
      return errorMessage('file too large')
    }
    if (!file.type.startsWith(`image/`)) {
      imgRef.current.value = null
      return errorMessage('Invalid file format detected, try with a different photo format like ')
    }
    setProofimg({
      img: URL.createObjectURL(file),
      image: file
    })
  }


  const changeImage = (e) => {
    setProofimg({
      img: e.target.src,
      image: null
    })
  }

  // console.log(cardPending)
  const submitProof = async (e) => {
    e.preventDefault()
    if (!proofimg.image) return errorMessage(`Proof of payment required to proceed`)
    const formdata = new FormData()
    formdata.append('id', cardPending[0].id)
    formdata.append('image', proofimg.image)
    // return console.log(formdata)
    setLoad(true)
    try {
      const res = await PostApi(Apis.auth.upload_card_proof, formdata)
      if (res.status !== 200) return errorMessage(res.msg)
      successMessage(res.msg)
      fetchCardWithdraws()
      setProofimg({
        img: '',
        image: null
      })
      setPaid(false)
    } catch (error) {
      errorMessage(error.message)
    } finally {
      setLoad(false)
    }
  }

  return (
    <div className='w-full'>
      <div className={`w-full relative mx-auto rounded-lg bg-white  py-6 px-5 `}>
        {loading &&
          <div className=" absolute h-full items-center flex justify-center z-50 w-full">
            <Loader />
          </div>
        }
        {inprocess ?
          <div className="p-10 flex items-center justify-center w-full">
            <div className="flex items-center gap-5 flex-col w-full">
              <div className="flex w-full flex-col items-center">
                <Loader />
                <div className="flex items-center gap-2 mt-2 flex-col md:w-8/12 w-11/12 mx-auto">
                  <div className="w-full bg-white border border-primary h-5 rounded-full">
                    <div
                      style={{ width: `${cardPending[0].progress}%` }}
                      className={`h-5 rounded-full bg-primary `}></div>
                  </div>
                  <div className="flex items-center gap-1 text-primary">
                    <div className="">withdrawal in progress</div>
                    <div className="text-center font-medium ">{cardPending[0].progress}%</div>

                  </div>
                </div>

              </div>
              {cardPending[0].verify === "false" ?
                <div className='w-full '>
                  <div className="flex items-center flex-col gap-2">
                    <div className="w-11/12 md:w-10/12 mr-auto text-sm lg:w-10/12 mx-auto text-center">Contact customer care to proceed with fee payments in order to increase the progress of your withdrawal.</div>
                  </div>
                  {!paid ?
                    <div className="w-full flex items-center justify-center mt-3">
                      <button onClick={() => setPaid(true)} className='w-fit  px-5 py-2 rounded-md bg-primary text-white'>I have made the payment</button>
                    </div>
                    :
                    <form onSubmit={submitProof} className='relative'>
                      <div className="mt-3 relative w-fit mx-auto">
                        <label className={`${proofimg.img ? '' : 'border-2 border-black'} mt-5 w-full  h-full border-dashed flex cursor-pointer items-center justify-center `}>
                          {proofimg.img ? <div className="">
                            <div onChange={changeImage} className=" cursor-pointer absolute top-0 -right-10 main font-bold ">
                              <FaEdit className='text-2xl' />
                            </div>

                            <img src={proofimg.img} className='w-full h-48' />
                          </div> :
                            <div className="flex items-center gap-2 px-2">
                              <FaPlus className='text-2xl' />
                              <div className="">Upload proof of payment</div>
                            </div>

                          }
                          <input type="file" onChange={handleImage} hidden ref={imgRef} />
                        </label>
                      </div>
                      {proofimg.img &&
                        <div className="lg:w-8/12 w-11/12 mx-auto mt-5  relative">
                          <Formbutton label={load ? '...Submitting' : 'Submit'} loading={load && true} />
                        </div>

                      }
                    </form>

                  }
                </div> :
                <div className="text-center mt-3">...verifying proof of payment</div>
              }
            </div>
          </div> :
          <>
            <div className="text-lg font-semibold text-balance pb-3 border-b w-full">Enter Card Details</div>
            <div className="my-5 flex flex-col items-start gap-5">
              <div className="font-bold">*NB: <span className='lite'>10% charge on any card withdrawals.</span></div>
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
                <div className="text-lg ">Amount ({profile?.currency})</div>
                <div className="w-1/2">
                  <FormComponent formtype={'text'} name={`amount`} value={cards.amount} onchange={handleChange} />
                </div>
              </div>
              <div className="flex items-center justify-between w-full">
                <div className="text-lg ">Charge Fee (10%)</div>
                <div className="w-1/4">
                  <input type='text' value={cards.amount ? `$${(parseFloat(cards.amount.replace(/,/g, '')) / 100) * 10}`
                    : '$0'}
                    className='w-full h-12 flex pl-5 border outline-none rounded-md'
                  />
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