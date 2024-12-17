import React, { useCallback, useEffect, useRef, useState } from 'react'
import mastercardimg from '../../assets/dashboard/mastercard.png'
import visacardimg from '../../assets/dashboard/visa.png'
import { errorMessage } from 'utils/functions'
import { Apis, GetApi } from 'services/Api'
import chip from 'assets/chip-sm.png'
import ButtonComponent from 'utils/ButtonComponent'
import { useLocation } from 'react-router-dom'

const CardComponent = () => {
    const [add, setAdd] = useState(false)
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

    const refdiv = useRef(null)
    const location = useLocation()
    const [comp, setComp] = useState(false)
    useEffect(() => {
        if (location.pathname.includes(`/user/linked_accounts`)) return setComp(true)
    }, [])

    useEffect(() => {

        const clickOut = (e) => {
            if(refdiv){
                if (refdiv.current !== null && !refdiv.current.contains(e.target)) {
                    setAdd(false)
                }
            }
        }
        window.addEventListener('click', clickOut, true)

        return ()=>{
            window.removeEventListener('click', clickOut, true)
        }

    }, [])

    return (
        <div className='w-full'>


            <div className="flex mb-2 w-full items-center justify-between">
                <div className=" text-xl font-semibold">My Cards</div>
                {comp &&
                    allcards.length < 2 &&
                    <div className="w-fit ">
                        <ButtonComponent
                            onclick={() => setAdd(true)}
                            title="Request A Virtual Card"
                            bg={`text-white bg-primary px-3  text-sm to-sec h-12`} />
                    </div>
                }
            </div>

            {add &&
                <div ref={refdiv} className="absolute top-1/2 left-1/2 bg-white -translate-x-1/2 w-1/2 px-4 py-4 rounded-md">
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="flex items-center gap-3 flex-col">
                        <div className="lite text-[18px] leading-[23px]">Please contact customer support to get a virtual card</div>
                          <button onClick={()=> setAdd(false)} className='px-3 w-1/2 mx-auto py-2 rounded-xl bg-primary text-white'>Ok</button>
                        </div>
                    </div>
                </div>
            }
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
                            <div key={i} className={`h-60 w-full  bg-col rounded-lg py-6 px-5`}>
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
            <div className="flex flex-col lg:flex-row lg:gap-2 items-start gap">
                <div className="font-light mt-1">* max of two credit/debit cards</div>
                <div className="font-light mt-1">* contact customer support to create your card</div>

            </div>

        </div>
    )
}

export default CardComponent