import React, { useState } from 'react'
import { Apis, ClientPostApi } from 'services/Api'
import ButtonComponent from 'utils/ButtonComponent'
import { errorMessage, successMessage } from 'utils/functions'
import Loader from 'utils/Loader'

export default function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [forms, setForms] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setForms({
      ...forms,
      [e.target.name]: e.target.value
    })
  }

  const SubmitForm = async (e) => {
    e.preventDefault()
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
    if (forms.email) {
      if (!isValidEmail(forms.email)) return errorMessage('Invalid email')
    }
    if (!forms.message) return errorMessage('Message is missing')
    const formdata = {
      name: forms.name,
      email: forms.email,
      subject: forms.subject,
      message: forms.message
    }
    setLoading(true)
    try {
      const res = await ClientPostApi(Apis.non_auth.contact_us, formdata)
      if (res.status === 200) {
        successMessage(`Message sent successfully`)
        setForms({
          name: '',
          email: '',
          subject: '',
          message: ''
        })
      } else {
        errorMessage(`something went wrong`)
      }
    } catch (error) {
      console.log(error)
      errorMessage(error)
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className='h-fit bg-white p-4 rounded-xl '>
      <div className="nunito font-bold text-3xl text-black text-center">Get In Touch</div>
      <form onSubmit={SubmitForm} className="w-full rounded-md h-fit py-3 bg-white relative">

        {loading &&
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2">
            <Loader />
          </div>
        }
        <div className="flex md:items-center flex-col md:flex-row justify-between w-full gap-5">
          <div className="md:w-1/2 h-14 ">
            <input type="text" name='name' value={forms.name} onChange={handleChange} className='border w-full h-full pl-2 rounded-sm  ' placeholder='full name' />
          </div>
          <div className="md:w-1/2 h-14 ">
            <input type="email" name='email' value={forms.email} onChange={handleChange} className='border w-full h-full pl-2 rounded-sm ' placeholder='email address' />
          </div>
        </div>
        <div className="my-3 w-full h-14">
          <input type="text" name='subject' value={forms.subject} onChange={handleChange} className='border w-full h-full pl-2 rounded-sm ' placeholder='subject' />
        </div>
        <div className="my-3 w-full ">
          <textarea name='message' value={forms.message} onChange={handleChange} className='w-full resize-none h-40 lg:h-52 p-3 border ' placeholder='message'></textarea>
        </div>
        <div className="mt-3">
          <ButtonComponent title={`Send Message`} bg={`text-white bg-gradient-to-tr from-primary to-sec h-12`} />
        </div>
      </form>
    </div>
  )
}

