import React, { useCallback, useEffect, useRef, useState } from 'react'
import mastercardimg from '../../assets/dashboard/mastercard.png'
import visacardimg from '../../assets/dashboard/visa.png'
import FormComponent from 'utils/FormComponent'
import { errorMessage, successMessage } from 'utils/functions'
import { FaAsterisk } from "react-icons/fa";
import Loader from 'utils/Loader'
import ModalLayout from 'utils/ModalLayout'
import { Apis, GetApi, PostApi } from 'services/Api'
import Formbutton from 'utils/Formbutton'
import chip from 'assets/chip-sm.png'
import ButtonComponent from 'utils/ButtonComponent'
import { useLocation } from 'react-router-dom'

const CardComponent = () => {

    const refdiv = useRef(null)
    const [loading, setLoading] = useState(false)
    const [confirm, setConfirm] = useState(false)
    const [add, setAdd] = useState(false)

    const [cards, setCards] = useState(
        {
            type: '',
            card_no: '',
            cvv: '',
            card_name: '',
            bill_address: '',
            exp: ''
        },

    )


    const [allcards, setAllcards] = useState([])

    const fetchUserCards = useCallback(async () => {
        try {
            const response = await GetApi(Apis.auth.all_cards)
            if (response.status !== 200) return;
            setAllcards(response?.user?.usercards)
        } catch (error) {
            errorMessage(error.message)
        }
    }, [])

    useEffect(() => {
        fetchUserCards()
    }, [fetchUserCards])

    const handleChange = (e) => {
        setCards({
            ...cards,
            [e.target.name]: e.target.value
        })
    }



    useEffect(() => {
        if (refdiv) {
            window.addEventListener('click', e => {
                if (refdiv.current !== null && !refdiv.current.contains(e.target)) {
                    setAdd(false)
                }
            }, true)
        }
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

    const addCardsArr = async (e) => {
        e.preventDefault()
        if (!cards.type) return errorMessage('Card type is required')
        if (!cards.card_name) return errorMessage('Card name is required')
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
            type: cards.type
        }
        setLoading(true)
        try {
            const response = await PostApi(Apis.auth.create_card, formdata)
            if (response.status === 200) {
                setCards({ card_name: '', card_no: '', cvv: '', exp: '', type: '' })
                successMessage(response.msg)
                fetchUserCards()
                setAdd(false)
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

    const location = useLocation()
    const [comp, setComp] = useState(false)
    useEffect(() => {
        if (location.pathname.includes(`/user/linked_accounts`)) return setComp(true)
    }, [])

    return (
        <div className='w-full'>
            {add &&
                <>
                    <ModalLayout setModal={setAdd} clas={`lg:w-[60%] w-11/12 mx-auto`}>
                        <div ref={refdiv} className={`w-full relative mx-auto rounded-lg bg-white  py-6 px-5 `}>
                            {loading &&
                                <div className=" absolute h-full items-center flex justify-center z-50 w-full">
                                    <Loader />
                                </div>
                            }
                            <div className="text-xl font-semibold text-balance">Enter Card Details</div>
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
                            <button disabled={loading ? true : false} onClick={addCardsArr} className=' h-12 w-full bg-gradient-to-tr from-primary to-sec  text-white rounded-lg'>Add Card</button>
                        </div>
                    </ModalLayout>
                </>
            }

            <div className="flex mb-2 w-full items-center justify-between">
                <div className=" text-xl font-semibold">My Cards</div>
                {comp &&
                    allcards.length < 2 &&
                    <div className="w-fit ">
                        <ButtonComponent
                            onclick={() => setAdd(true)}
                            title="Add New Card"
                            bg={`text-white bg-gradient-to-tr px-3 from-primary text-sm to-sec h-12`} />
                    </div>
                }
            </div>
            {Array.isArray(allcards) && allcards.length > 0 ? <div className=" mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
                {allcards.map((item, i) => {
                    return (
                        <div key={i} className={`lg:h-[17rem] h-fit w-full bg-gradient-to-tr from-primary to-sec  rounded-lg py-4 px-5`}>
                            <div className="flex flex-col text-white h-full justify-between">
                                <div className="flex items-center  justify-between">
                                    <div className={`w-fit  ${item.type === 'visa' ? 'h-16' : 'h-fit'} bg-white rounded-md flex items-center justify-center`}>
                                        <img src={item.type === 'visa' ? visacardimg : mastercardimg} className={`w-24 `} alt="" />
                                    </div>
                                    <img src={chip} className={`w-fit h-14 `} alt="" />
                                </div>
                                <div className="mb-2 mt-2 flex  items-center justify-between  text-white text-base">
                                    <div className="flex-col flex items-start">
                                        <div className="text-sm">Card No.</div>
                                        <div className="text-lg font-semibold">{item.card_no}</div>
                                    </div>
                                    <div className="flex items-center mr-3 flex-col">
                                        <div className="">cvv</div>
                                        <div className="text-lg font-bold">{item.cvv}</div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start flex-col">
                                        <div className="text-sm">Card holder</div>
                                        <div className="font-bold text-xl">{item.name}</div>
                                    </div>
                                    <div className="flex items-center flex-col">
                                        <div className="text-sm">exp</div>
                                        <div className="font-bold text-lg">{item.exp}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div> :
                <div className="flex items-center flex-col lg:flex-row justify-between gap-5 lg:gap-10">
                    {new Array(2).fill(0).map((item, i) => {
                        return (
                            <div key={i} className={`h-60 w-full  bg-gradient-to-tr from-primary to-sec rounded-lg py-6 px-5`}>
                                <div className="flex gap-4 flex-col text-white h-full justify-between">
                                    <div className="w-16 p-3 bg-white h-12 rounded-md ml-auto mr-2">
                                    </div>
                                    <div className="flex w-full  items-center justify-between  text-white text-base">
                                        <div className=" w-3/4 flex-col flex items-start">
                                            <div className="flex items-center gap-1 text-lg">
                                                0000 - 0000 - 0000 - 0000 - 0000
                                            </div>
                                        </div>
                                        <div className="w-1/4 bg-white rounded-md h-3"></div>
                                    </div>
                                    <div className="w-full bg-white rounded-md h-3"> </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

            }
            <div className="font-light mt-1">* max of two credit/debit cards</div>


        </div>
    )
}

export default CardComponent