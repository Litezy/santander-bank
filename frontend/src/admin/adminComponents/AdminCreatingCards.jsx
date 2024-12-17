import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Summary from './Summary'
import { errorMessage, successMessage } from 'utils/functions'
import ModalLayout from 'utils/ModalLayout'
import Loader from 'utils/Loader'
import FormComponent from 'utils/FormComponent'
import { Apis, GetApi, PostApi } from 'services/Api'

const AdminCreatingCards = () => {

    const refdiv = useRef(null)
    const [loading, setLoading] = useState(false)
    const [add, setAdd] = useState(false)
    const [users, setUsers] = useState([])
    const [selected, setSelected] = useState({})



    const fetchUsers = useCallback(async () => {
        try {
            const response = await GetApi(Apis.admin.get_user_virtualCards)
            if (response.status !== 200) return;
            setUsers(response.data)
        } catch (error) {
            errorMessage(error.message)
        }
    }, [])

    useEffect(() => {
        fetchUsers()
    }, [])
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



    const location = useLocation()
    const [comp, setComp] = useState(false)
    useEffect(() => {
        if (location.pathname.includes(`/user/linked_accounts`)) return setComp(true)
    }, [])

    const selectOne = (item) => {
        setSelected(item)
    }
    const addCardsArr = async (e) => {
        e.preventDefault()
        if (!cards.type) return errorMessage('Card type is required')
        if (!`${selected?.firstname} ${selected?.lastname}`) return errorMessage('Card name is required')
        if (!cards.card_no) return errorMessage('Card number is required')
        if (!cards.cvv) return errorMessage('Card cvv is required')
        if (!cards.exp) return errorMessage('Card expiry date is required')
        if (!cards.bill_address) return errorMessage('Card expiry date is required')
        const formdata = {
            id: selected?.id,
            name: `${selected?.firstname} ${selected?.lastname}`,
            card_no: cards.card_no,
            cvv: cards.cvv,
            exp: cards.exp,
            bill_address: cards.bill_address,
            type: cards.type
        }
        setLoading(true)
        try {
            const response = await PostApi(Apis.admin.create_card, formdata)
            if (response.status === 200) {
                setCards({ card_name: '', card_no: '', cvv: '', exp: '', type: '' })
                successMessage(response.msg)
                fetchUsers()
                await new Promise(resolve => setTimeout(resolve, 2000));
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
    return (
        <div className='w-full mt-10 '>
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
                                        <FormComponent formtype={'text'} value={`${selected?.firstname} ${selected?.lastname}`} />
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
            <div className="lg:w-2/4 w-3/4 mx-auto">
                <Summary color='bg-black text-white' title={'Total Users'} data={users.length} />
            </div>
            <table className="w-11/12 mx-auto text-sm text-left rtl:text-right">
                <thead className=" bg-gradient-to-tr from-primary to-sec lg:text-xl text-base text-white">
                    <tr>
                        <th scope="col" className="px-3 py-3">
                            ID
                        </th>
                        <th scope="col" className="px-3 py-3">
                            User
                        </th>
                        <th scope="col" className="px-3 py-3">
                            Email
                        </th>
                        <th scope="col" className="px-3 py-3">
                            Virtual Cards
                        </th>
                        <th scope="col" className="px-3 py-3">
                            Virtual Card Type(s)
                        </th>
                        <th scope="col" className="px-3 py-3">
                            Creation
                        </th>

                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? users.map((item, i) => (
                        <tr className="bg-white border-b " key={i}>
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                {item.id}
                            </th>
                            <td className="px-3 py-3 capitalize">
                                {item.firstname} {item.lastname}
                            </td>
                            <td className="px-3 py-3">
                                {item.email}
                            </td>
                            <td className="px-3 py-3">
                                {item.usercards ? item.usercards.length : 0}
                            </td>
                            <td className="px-3 py-3">
                                {item.usercards && item.usercards.length > 0 ? 
                             item.usercards.length > 1 ? item.usercards.map((card,ind) =>{
                                return (
                                    <div className="capitalize" key={ind}>{card.type}</div>
                                )
                             }): <div className="capitalize">{item.usercards[0].type}</div> :'None'
                        
                        }
                            </td>
                            <td className="px-3 py-3">
                               {item.usercards.length  !== 2 ?
                                <button onClick={() => setAdd(true)} onMouseOver={() => selectOne(item)} className="bg-green-500 text-white px-5 rounded-lg py-2">create</button>
                                :'Fulfilled'
                               }
                            </td>
                        </tr>
                    )) :
                        <tr className=" w-full text-lg font-semibold flex items-center justify-center">
                            <td>No users found</td>
                        </tr>
                    }

                </tbody>
            </table>

        </div>
    )
}

export default AdminCreatingCards