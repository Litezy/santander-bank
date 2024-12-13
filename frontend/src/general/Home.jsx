import Community from 'components/general/Community'
import Helping from 'components/general/Helping'
import SantanderFreedom from 'components/general/SantanderFreedom'
import React from 'react'

const Home = () => {
  return (
    <div className="lg:w-[95%] w-full mx-auto mb-20">
      <Helping/>
      <SantanderFreedom/>
      <Community/>
    </div>
  )
}

export default Home