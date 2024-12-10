import React from 'react'
import { termsOfUse } from 'utils/Pageutils'

const TermsofUse = () => {
  return (
    <>
     <div className="terms h-[20rem] lg:h-[30rem]"></div>
      <div className="w-11/12 mx-auto mt-10 mb-16">
        <div className="text-2xl lg:text-4xl font-bold">Terms of Use</div>
        <div className="mt-10 w-11/12 mx-auto">
          {termsOfUse.map((item, i) => {

            return (
              <div className="flex w-full items-start flex-col gap-3 mb-5">
                <div className="flex items-center gap-5">
                  <div className="text-xl font-bold">{item.number}.</div>
                  <div className="text-xl lg:text-2xl font-bold text-sky-500">{item.title}</div>
                </div>
                {item.desc.map((des, j) => (
                  <ul className={` list-disc w-full  mb-5`} key={j}>
                    <li dangerouslySetInnerHTML={{ __html: des.info }}/>
                  </ul>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default TermsofUse