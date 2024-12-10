import React from 'react'


const Summary = ({title,color,data}) => {
  return (
    <div className="shadow-md rounded-e-xl h-32 my-5">
        <div className={`w-full ${color} rounded-lg h-1/2  flex font-bold px-3  items-center justify-center`}>
            <h1 className='text-base lg:text-lg'>{title}</h1>
        </div>
        <div className="h-1/2 flex items-center text-base lg:text-lg font-bold justify-center">{data}</div>
     </div>
  )
}

export default Summary