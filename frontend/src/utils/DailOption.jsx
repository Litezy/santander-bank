

import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiCountryFlags, PhoneCodes } from './CountryCodes'
import Imaged from './Imaged'
import { FaCaretDown } from 'react-icons/fa6'


export default function DailOptions({ title, setup, defaultValue }) {
    const [text, setText] = useState('')
    const [content, setContent] = useState({
        img: '',
        code: ''
    })
    const [codes, setCodes] = useState(PhoneCodes || [])
    const togref = useRef()
    const [view, setView] = useState(false)

    const GetContent = useCallback(() => {
        const findCode = defaultValue && PhoneCodes.find(ele => (ele.dial_code === defaultValue))
        if (findCode) {
            const itemflag = ApiCountryFlags.find((ele) => ele.name?.toLocaleLowerCase() === findCode.code?.toLocaleLowerCase())

            setContent({
                img: itemflag?.data,
                code: findCode.dial_code
            })
        }
    }, [defaultValue])

    useEffect(() => {
        GetContent()
        togref && window.addEventListener('click', (e) => { togref.current !== null && !togref.current.contains(e.target) && setView(false) }, true)
    }, [GetContent])

    const handleChange = (val) => {
        setText(val)
        if (val.length > 0) {
            const findText = PhoneCodes.filter(ele =>
                ele.name.toLowerCase().includes(val?.toLowerCase()) ||
                ele.dial_code.toLowerCase().includes(val?.toLowerCase()) ||
                ele.code.toLowerCase().includes(val?.toLowerCase())
            )
            setCodes(findText)
        } else {
            setCodes(PhoneCodes)
        }
    }
    const handleSelection = (val) => {
        const itemflag = ApiCountryFlags.find((ele) => ele.name?.toLowerCase() === val.code?.toLowerCase())
        setContent({
            img: itemflag?.data,
            code: `${val.dial_code}`
        })
        setup(val)
        setView(false)
    }
    return (
        <div className='relative'>
            <div ref={togref} className={`${view ? '' : 'hidden'} absolute top-[2.5rem] z-10 left-0 w-full bg-white border shadow-2xl`}>
                <div className="w-11/12 mx-auto mt-3">
                    <input value={text} onChange={(e) => handleChange(e.target.value)} placeholder='Search!...' type="text" className="w-full p-2 text-sm border rounded-sm" />
                    <div className="h-[10rem] overflow-y-auto scrolls scrollsdown">
                        {codes.map((item, i) => {
                            const itemflag = ApiCountryFlags.find((ele) => ele.name?.toLocaleLowerCase() === item.code?.toLocaleLowerCase())
                            return (
                                <div onClick={() => handleSelection(item)} className="text-xs p-1.5 border-b cursor-pointer hover:bg-slate-50 flex items-center gap-2" key={i}> <Imaged loading="lazy" decoding="async" data-nimg="1" src={itemflag?.data} alt="" className="w-5" /> {item.dial_code}</div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div onClick={() => setView(true)} className="border px-2 py-[0.7rem] border-zinc-300 hover:border-zinc-600 rounded-md focus:border-blue-500">
                {!content.code ? <span className="text-slate-500 flex items-center justify-between">{title} <FaCaretDown className='text-zinc-500' /> </span> : <div className='flex items-center gap-2'> <Imaged src={content.img} className='w-5 h-5' /> <div className='flex items-center justify-between w-full'>{content.code} <FaCaretDown className='text-zinc-500' /> </div> </div>}</div>
        </div>
    )
}
