import React, { useEffect, useRef } from 'react'

const ReverseModal = ({children,setModal,clas,actionOne=false, actionTwo=false}) => {

    const refdiv = useRef(null)

    useEffect(()=>{
        const handleClickOutside = (e) =>{
              if(refdiv.current !== null && !refdiv.current.contains(e.target)){
                setModal(false)
              }
        }

        window.addEventListener('click', handleClickOutside, true)

        return ()=>{
            window.removeEventListener('click', handleClickOutside, true)
        }
    },[setModal])

    return (
        <div className="w-full z-50 h-screen fixed   flex top-0 left-0 items-center justify-center bg-black/40 backdrop-blur-sm ">
            <div ref={refdiv} className={`${clas} max-h-[90dvh] overflow-y-auto `}>{children}</div>
        </div>
    )
}

export default ReverseModal