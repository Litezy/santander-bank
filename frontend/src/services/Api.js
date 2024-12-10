import axios from 'axios'
import Cookies from 'js-cookie'
import { CookieName } from 'utils/functions'


/*

Database 
database = pinerock_bankingdb 
username =pinerock_bankinguser 
password = pinerock_banking

Email 
email = support@pinerockcreditunion.com 
password = pinerockcreditunion.com

JIVO 
password = pinerockcreditunion.com
email = support@pinerockcreditunion.com


*/

export let URL;
export let profileImg;

if(window.location.origin.includes('pinerockcreditunion.com')) {
    URL = 'https://backend.pinerockcreditunion.com'
    profileImg = 'https://backend.pinerockcreditunion.com'
 }

if(window.location.origin.includes('localhost')) {
    URL = 'http://localhost:5003'
    profileImg = 'http://localhost:5003'
}





const user = 'user'
const admin = 'admin'

export const non_auth_urls = {
    create_acc: user + `/signup`,
    change_user_pass: user +'/change-pass',
    login: user + '/login',
    verify_email: user + '/verify-email',
    verify_emailpass: user + '/verify-emailpass',
    resend_otp: user + '/resend-otp',
    change_img: user + '/upload-img',
    find_account: user + '/find-account',
    email_sub: user + '/email-subscribe',
    contact_us: user + '/contact'
}
export const auth_urls = {
    profile: user + '/profile',
    logout: user + '/logout',
    edit_profile: user + '/edit-profile',
    user_savings: user + '/user-savings',
    topup: user + '/top-up',
    create_savings: user + '/create-savings',
    trans_history: user + '/trans-history',
    delete_savings: user + '/delete-savings',
    all_cards: user + '/user-cards',
    cards_withdraw: user +'/card-withdraw',
    pending_card_withdrawals: user + '/pending-card-withdraw',
    pending_bank_withdrawals: user + '/pending-bank-withdraw',
    create_card: user + '/create-card',
    user_notifications: user + '/user-notifications',
    markas_read: user + '/mark-read',
    change_password: user + '/change-password',
    change_email: user + '/change-email',
    email_otp: user + '/email-otp',
    mark_all: user + '/all-read',
    get_banks: user + '/get-user-banks',
    add_bank: user + '/add-bank',
    deposit: user + '/deposit',
    get_transfers : user + '/find-transfers',
    get_verifications : user + '/find-verifications',
    get_adminBanks: user +'/admin-banks',
    transfer: user + '/transfer',
    upload_trans_prof: user +'/upload-proof',
    user_transfers : user + '/user-transfers',
    all_savings : user + '/all-savings',
    verify_otp: user + '/verify-otp',
    withdraw_savings : user + '/withdraw-savings',
    save_history: user + '/save-history',
    fetch_p2p:user +'/find-p2p',
    internal_transfer: user + '/credit-p2p',
    submit_kyc: user + '/submit-kyc',
    
    //tickets
    create_ticket: user + '/create-ticket',
    one_ticket_msgs: user + '/one-ticket-msgs',
    active_tickets: user + '/active-tickets',
    closed_tickets: user + '/closed-tickets',
    send_msg: user + '/send-msg',
    find_admin: user + '/find-admin'
}

export const admin_urls = {
    all_users: admin + '/all-users',
    all_depo: admin + '/all-depo',
    all_kycs: admin + '/all-kycs',
    all_proofs: admin + '/all-proofs',
    all_plans: admin + '/all-plans',
    all_trans: admin + '/all-trans',
    all_banks: admin + '/all-banks',
    all_cards: admin + '/all-cards',
    validate_depo: admin + '/validate-depo',
    create_user: admin + '/create-user',
    find_email: admin + '/find-email',
    inititate_depo: admin + '/initiate-depo',
    initiate_with: admin + '/initiate-with',
    trans_date: admin + '/trans-date',
    add_bank: admin + '/add-bank',
    hide:admin + '/hide',
    admin_banks: admin +'/admin-banks',
    create_verify: admin + '/create-verify',
    update_verify: admin + '/update-verify',
    decline_depo: admin + '/decline-depo',
    settled_depos: admin + '/settled-depo',
    remove_bank: admin + '/remove-bank',
    contacts:admin + '/contacts',
    subs:admin + '/subs',
    completed_transfers: admin + '/completed-transfers',
    confirm_trans: admin + '/confirm-trans',
    otp: admin + '/otp',
    single_trans: admin + '/single-trans',
    pending_transfers : admin + '/all-pending-transfers',
    terminated_savings : admin + '/all-terminated-savings',
    completed_savings : admin + '/all-completed-savings',
    all_contacts : admin + '/all-contacts',
    all_deposits: admin + '/all-deposits',
    verified_kycs: admin + '/verified-kycs',
    all_card_pendings: admin + '/all-card-pendings',
    all_card_complete: admin + '/all-card-complete',
    confirm_card_withdrawal: admin + '/confirm-card-withdrawal',

    //reverse
    confirmed_withdrawals: admin + '/fetch_successful_trans',
    reverse_funds: admin + '/reverse_trans',
    reversed_trans: admin + '/allreversed',

    //tickets and kycs
    all_active_tickets: admin + '/all-active-tickets',
    all_closed_tickets: admin + '/all-closed-tickets',
    admin_response: admin + '/admin-response',
    get_one_msg: admin + '/one-ticket-msgs',
    pending_kycs: admin + '/pending-kycs',
    one_kyc: admin + '/one-kyc',
    verified_kycs: admin + '/verified-kycs',
    close_ticket: admin +'/close-ticket',
    approve_kyc: admin + '/approve-kyc',
    overturn_kyc: admin + '/overturn-kyc',
    all_tickets: admin + '/all-tickets'
}
export const Apis = {
    non_auth: non_auth_urls,
    auth: auth_urls,
    admin: admin_urls


}

export const ClientGetApi = async (endpoint) => {
    const response = await axios.get(`${URL}/${endpoint}`)
    return response.data
}
export const ClientPostApi = async (endpoint, data) => {
    const response = await axios.post(`${URL}/${endpoint}`, data)
    return response.data
}

export const GetApi = async (endpoint) => {
    const getCookie = Cookies.get(CookieName)
    const response = await axios.get(`${URL}/${endpoint}`, {
        headers: {
            Authorization: `Bearer ${getCookie}` // Include the JWT token in the Authorization header
        }
    })
    return response.data
}



export const PostApi = async (endpoint, data) => {
    const token = Cookies.get(CookieName)
    const response = await axios.post(`${URL}/${endpoint}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data
}
export const LogoutApi = async (endpoint) => {
    const token = Cookies.get(CookieName)
    const response = await axios.post(`${URL}/${endpoint}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data
}
export const PutApi = async (endpoint, data) => {
    const token = Cookies.get(CookieName)
    const response = await axios.put(`${URL}/${endpoint}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data
}
