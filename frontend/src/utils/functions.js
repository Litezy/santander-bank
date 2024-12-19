import {toast} from "sonner"

export const SiteName = 'Santtandderbank'
export const SiteEmail = 'support@santtandderbank.com'
export const SiteContact = '+ Coming soon'
export const SiteAddress = ''
export const Currency = '£'
export const errorMessage = (message) => {
    return toast.error(message)
}
export const successMessage = (message) => {
    return toast.success(message)
}

export const CookieName = 'bankingmain'
export const UserRole = [
    {
        role: 'user',
        url: '/user'
    },
    {
        role: 'admin',
        url: '/admin/overview'
    }
]
export const MoveToBottom = ()=>{
    const div = document.querySelector('.downdiv')
    if(div){
        div.scrollTo({
            top:div.scrollHeight,
            behavior:'smooth'
        })
    }
}
export const MoveToTop= () =>{
    const div = document.querySelector('.updiv')
    if(div){
        div.scrollTop =0
    }
}