
import { useCallback, useEffect, useRef, useState } from 'react'
import Countries from './Countries'
import { FaCaretDown } from 'react-icons/fa6'


export default function CountryStates({ title, onChange, defaultValue }) {
    const [text, setText] = useState('')
    const [text2, setText2] = useState('')
    const [content, setContent] = useState({
        country: '',
        state: ''
    })
    const [country, setCountry] = useState(Countries || [])
    const [states, setStates] = useState([])
    const [states2, setStates2] = useState([])
    const togref = useRef()
    const togref2 = useRef()
    const [view, setView] = useState(false)
    const [view2, setView2] = useState(false)


    const GetContent = useCallback(() => {
        const findCode = defaultValue && Countries.find(ele => (ele.name === defaultValue))
        if (findCode) {
            setContent({
                ...content,
                country: findCode.name
            })
        }
    }, [defaultValue])

    useEffect(() => {
        GetContent()
        togref && window.addEventListener('click', (e) => { togref.current !== null && !togref.current.contains(e.target) && setView(false) }, true)
        togref2 && window.addEventListener('click', (e) => { togref2.current !== null && !togref2.current.contains(e.target) && setView2(false) }, true)
    }, [GetContent])

    const handleChange2 = (val) => {
        setText2(val)
        if (val.length > 0) {
            const findText = states.filter(ele =>
                ele.name.toLowerCase().includes(val?.toLowerCase())
            )
            setStates(findText)
        } else {
            setStates(states2)
        }
    }
    const handleSelection2 = (val) => {
        setContent({
            ...content,
            state: val.name
        })
        // onChange(val)
        setView2(false)
        onChange(content.country, val.name)
    }

    const handleChange = (val) => {
        setText(val)
        if (val.length > 0) {
            const findText = Countries.filter(ele =>
                ele.name.toLowerCase().includes(val?.toLowerCase())
            )
            setCountry(findText)
        } else {
            setCountry(Countries)
        }
    }
    const handleSelection = (val) => {
        setContent({
            ...content,
            country: val.name,
            state: ''
        })
        setView(false)
        setStates(val.states)
        setStates2(val.states)
        onChange(val.name, '')
    }
    return (
        <div className="grid grid-cols-2 gap-3 mb-3">
            <div className='relative'>
                <div ref={togref} className={`${view ? '' : 'hidden'} absolute top-[2.5rem] z-10 left-0 w-full bg-white border shadow-2xl`}>
                    <div className="w-11/12 mx-auto mt-3">
                        <input
                            value={text}
                            onChange={(e) => handleChange(e.target.value)}
                            placeholder='Search!...'
                            type="text"
                            className="w-full p-2 text-sm border rounded-sm"
                        />
                        <div className="max-h-[10rem] pb-2 overflow-y-auto scrolls scrollsdown">
                            {country.map((item, i) => (
                                <div
                                    onClick={() => handleSelection(item)}
                                    className="text-xs p-1.5 border-b cursor-pointer hover:bg-slate-50 flex items-center gap-2"
                                    key={i}
                                >
                                    {item.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div
                    onClick={() => setView(true)}
                    className="border px-2 py-[0.9rem] border-zinc-300 hover:border-zinc-600 rounded-md focus:border-blue-500"
                >
                    {!content.country ? (
                        <span className="text-slate-500 flex items-center justify-between">
                            Country <FaCaretDown className='text-zinc-500' />
                        </span>
                    ) : (
                        <div className='flex items-center gap-2'>
                            <div className='flex items-center justify-between w-full'>
                                {content.country} <FaCaretDown className='text-zinc-500' />
                            </div>
                        </div>
                    )}
                </div>
            </div>
    
            <div className='relative'>
                <div ref={togref2} className={`${view2 ? '' : 'hidden'} absolute top-[2.5rem] z-10 left-0 w-full bg-white border shadow-2xl`}>
                    <div className="w-11/12 mx-auto mt-3">
                        <input
                            value={text2}
                            onChange={(e) => handleChange2(e.target.value)}
                            placeholder='Search!...'
                            type="text"
                            className="w-full p-2 text-sm border rounded-sm"
                        />
                        <div className="max-h-[10rem] pb-2 overflow-y-auto scrolls scrollsdown">
                            {states.map((item, i) => (
                                <div
                                    onClick={() => handleSelection2(item)}
                                    className="text-xs p-1.5 border-b cursor-pointer hover:bg-slate-50 flex items-center gap-2"
                                    key={i}
                                >
                                    {item.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div
                    onClick={() => setView2(true)}
                    className="border px-2 py-[0.9rem] border-zinc-300 hover:border-zinc-600 rounded-md focus:border-blue-500"
                >
                    {!content.state ? (
                        <span className="text-slate-500 flex items-center justify-between">
                            State <FaCaretDown className='text-zinc-500' />
                        </span>
                    ) : (
                        <div className='flex items-center gap-2'>
                            <div className='flex items-center justify-between w-full'>
                                {content.state} <FaCaretDown className='text-zinc-500' />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
    
}