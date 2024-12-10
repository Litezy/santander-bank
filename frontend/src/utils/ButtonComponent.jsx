import React from 'react'

const ButtonComponent = ({bg,title,type='submit',onclick,disabled}) => {
    return (
        <div className={`w-full $ rounded-lg ${bg} `}>
            <button onClick={onclick} disabled={disabled} type={type} className='font-bold w-full h-full'>{title}</button>
        </div>
      )
}

export default ButtonComponent