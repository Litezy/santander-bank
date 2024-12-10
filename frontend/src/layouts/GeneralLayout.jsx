import Footer from 'components/general/Footer'
import Header from 'components/general/Header'
import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function GeneralLayout({ children }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const showTimeout = setTimeout(() => {
      setShow(true)
      // const hideTimeout = setTimeout(() => {
      //   setShow(false)
      // }, 5000)
      // return () => clearTimeout(hideTimeout);
    }, 10000)

    // return () => clearTimeout(showTimeout);
  }, [])  // The empty dependency array ensures it runs only once

  const handleClose = () => {
    setShow(false)
  }
  const ref = useRef(null)

  useEffect(()=>{
   if(ref){
    window.addEventListener('click', (e)=>{
      if(ref.current !== null && !ref.current.contains(e.target)) return setShow(false)
    },true)
   }
  },[])


  return (
    <div className="overflow-hidden w-full">
      {/* <AnimatePresence onExitComplete={()=>setShow(false)}>
        {show && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: -500 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1.5 }}
            exit={{ opacity: 0, y: -500 }}
            className="fixed bg-black/50 lg:p-10 p-2 backdrop-blur-sm w-full h-fit z-50 overflow-hidden"
          >
            <div className="w-11/12 lg:w-3/4 lg:p-10 p-3 mx-auto bg-white rounded-lg flex items-center flex-col gap-3 text-center">
              <div className="capitalize text-2xl font-bold">Pinerock credit union</div>
              <div className="font-semibold  text-primary text-xl">Install Pinerock credit union on your phone</div>
              <div className="text-base lg:w-2/4 w-11/12 mx-auto">
                Install Pinerock credit union on your phone, and access it just like a regular native app. Open your Browser menu and tap "Add to Home Screen".
              </div>
              <button onClick={handleClose} className="text-orange-500 uppercase underline flex items-center font-bold lg:text-2xl text-xl">
                Maybe Later
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence> */}
      <Header show={show} />
      {children}
      {/* <Footer /> */}
    </div>
  )
}
