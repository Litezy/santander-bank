

import img from 'assets/not-found.png'
import { Link } from 'react-router-dom'
import Imaged from "utils/Imaged"



export default function Notfound() {
  return (
    <div className='w-11/12 mx-auto'>
            <div className='flex items-center justify-center h-screen gap-3 flex-col'>
                <div className="w-full h-[60dvh] relative">
                <Imaged src={img} className="w-auto h-full mx-auto" />
                </div>
                <div className='font-extrabold text-4xl lg:text-5xl text-primary text-center'>Page not found!</div>
                <div className='text-zinc-500 text-xl text-center'>Oops! Looks like you followed a bad link. If you think this is a problem with us, please tell us.</div>
                <div className='mt-10 text-white bg-primary py-3 px-8 rounded-lg'>
                    <Link to="/">Go back Home</Link>
                </div>
            </div>
        </div>
  )
}
