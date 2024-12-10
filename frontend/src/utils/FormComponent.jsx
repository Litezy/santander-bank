import React, { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa6'
import { VscEyeClosed ,VscEye} from "react-icons/vsc";

const FormComponent = ({ formtype = 'text', placeholder,name,value,onchange,onKeyUp,onclick,outline=false,mutate=true }) => {
    const [open,setOpen] = useState(false)
    const Icon = open ? VscEyeClosed: VscEye
    return (
        <div className='w-full'>
            {formtype === 'text' && 
            <input onClick={onclick} 
            value={value} 
            name={name}  
            onChange={onchange} 
            onKeyUp={onKeyUp} 
            type="text" 
            disabled={mutate? false:true}
            className={`w-full border-zinc-300 ${mutate ?'hover:border-zinc-600':'bg-slate-200'}  h-12 border px-2 py-1 rounded-md ${!outline && 'outline-none'}`} placeholder={placeholder} />}

            {formtype === 'code' && 
            <input 
            value={value} 
            name={name}  
            onChange={onchange} 
            onClick={onclick}
            type="text" 
            className='w-full border-zinc-300 hover:border-zinc-600  h-12 border text-center py-1 rounded-md  outline-none px-5' placeholder={placeholder} />}

            {formtype === 'sex' && 
            <input onClick={onclick} 
            value={value} 
            disabled={mutate? false:true} 
            type="text" 
            className={`w-full border border-zinc-300 ${mutate ?'hover:border-zinc-600':'bg-slate-200'}  h-12 flex items-center justify-center rounded-lg outline-none pl-2`} placeholder={placeholder} />}


            {formtype === 'email' && 
            <input 
            type="email" 
            value={value} 
            name={name} 
            onChange={onchange} 
            className='w-full tracking-wide border-zinc-300 border-gray border-2 h-12 font-normal rounded-lg outline-none pl-2' placeholder={placeholder} />}


            {formtype === 'phone' && 
            <input 
            onChange={onchange} 
            value={value} 
            name={name}  
            type="number" 
            className='w-full  h-12 border px-2 border-zinc-300 py-1 hover:border-zinc-600  rounded-md  outline-none pl-2' 
            placeholder={placeholder} />}

            {formtype === 'cvv' && 
            <input 
            onChange={onchange} 
            value={value} 
            name={name}  
            type="number" 
            onKeyUp={onKeyUp}
            className='w-full  h-12 border px-2 border-zinc-300 py-1 hover:border-zinc-600  rounded-md  outline-none pl-2' 
            placeholder={placeholder} />}

            {formtype === 'country' &&
                <div className="border-gray border-2 h-12  rounded-lg pr-3 flex items-center justify-between">
                    <input 
                    type="number" 
                    onChange={onchange}  
                    className='w-full h-full outline-none pl-2 bg-transparent' 
                    placeholder={placeholder} 
                    value={value} 
                    name={name}  />
                    <FaChevronDown className='cursor-pointer' />
                </div>
            }

         
         {formtype === 'password' &&
         <div className="w-full border border-zinc-300  hover:border-zinc-600  bg-white text-black items-center h-12 rounded-lg flex">
            <input 
            type={`${open ?'text':'password'}`} 
            value={value} 
            name={name} 
            onChange={onchange}  
            className='outline-none h-full text-dark  font-normal tracking-normal px-2  bg-transparent w-[90%]' placeholder={placeholder} />
            <Icon className='cursor-pointer text-2xl text-dark ' onClick={()=> setOpen(!open)}/>
         </div>
         }
            
        </div>
    )
}

export default FormComponent