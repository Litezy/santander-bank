import Footer from 'components/general/Footer'
import Header from 'components/general/Header'
import React from 'react'

export default function GeneralLayout({ children }) {


  return (
    <div className="overflow-hidden w-full">
     
      <Header  />
      {children}
      <Footer />
    </div>
  )
}
