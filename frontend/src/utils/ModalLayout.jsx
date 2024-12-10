import React, { useEffect, useRef } from 'react'

const ModalLayout = ({children,setModal,clas}) => {

    const refdiv = useRef(null)

    useEffect(()=>{
        if(refdiv){
            window.addEventListener('click', e =>{
              if(refdiv.current !== null && !refdiv.current.contains(e.target)){
                setModal(false)
              }
            },true)
        }
        // eslint-disable-next-ling
    },[])
    return (
        <div className="w-full z-50 h-screen fixed   flex top-0 left-0 items-center justify-center bg-black/40 backdrop-blur-sm ">
            <div ref={refdiv} className={`${clas} max-h-[90dvh] overflow-y-auto `}>{children}</div>
        </div>
    )
}

export default ModalLayout