const { adminPrivacy } = require("../auth/UserAuth")
const { getAllUsers, getAllDeposits, getPaymentProof, getAllPlans, getAllTrans, getUserBanks, getUserCards, CreateUser, ValidateDeposits, InitiateDeposits, FindUserEmail, InitiateWithdraw, AlterTransaDate, addAdminBank, unhideBank, getAdminBanks, createVerification,  getAllTransfers, DeclineDeposits, getSettledDeposits, removeAdminBank, getAllEmailSubs, getAllContacts, getAllVerifications, sendPaymentOtp, confirmTransfer, getSingleTransfer, getAllActiveTickets, getAllClosedTickets,getKYCUsers, getAllPendingUserKYCS, getAllVerifiedUserKYCS, getOneUserKyc, ApproveKYC, OverturnKyc, getAllPendingReq, getAllTerminatedSavings, getAllCompletedSavings, getDeposits, getAllTickets, getCompletedTransfers, getAllApprovedKycs, getAllpendingCardWithdrawals, getAllCompleteCardWithdrawals, confirmCardWithdrawal, fetchSuccessfulTrans, reverseWithrawals, getAllReveresedTrans } = require("../controllers/adminControllers")
const { createMessageAdmin, getOneTicketMessagesAdmin, closeTicket } = require("../controllers/ticketsControllers")

const router = require(`express`).Router()

router.get('/all-users', adminPrivacy,getAllUsers)
router.get('/all-depo', adminPrivacy, getAllDeposits)
router.get('/all-deposits', adminPrivacy, getDeposits)
router.get('/all-kycs', adminPrivacy, getKYCUsers)
router.get('/all-proofs', adminPrivacy, getPaymentProof)
router.get('/all-plans', adminPrivacy, getAllPlans)
router.get('/all-trans', adminPrivacy, getAllTrans)
router.get('/all-banks', adminPrivacy, getUserBanks)
router.get('/all-cards', adminPrivacy, getUserCards)
router.post('/validate-depo', adminPrivacy, ValidateDeposits)
router.post('/initiate-depo', adminPrivacy, InitiateDeposits)
router.post('/decline-depo', adminPrivacy, DeclineDeposits)
router.post('/initiate-with', adminPrivacy, InitiateWithdraw)
router.post('/create-user', adminPrivacy, CreateUser)
router.post('/find-email', adminPrivacy, FindUserEmail)
router.post('/trans-date', adminPrivacy, AlterTransaDate)
router.post('/add-bank',adminPrivacy,addAdminBank)
router.post('/remove-bank',adminPrivacy,removeAdminBank)
router.get('/admin-banks',adminPrivacy,getAdminBanks)
router.post('/hide',adminPrivacy,unhideBank)
router.post('/create-verify',adminPrivacy,createVerification)
router.get('/completed-transfers',adminPrivacy,getCompletedTransfers)
router.get('/single-trans/:id',adminPrivacy,getSingleTransfer)
router.get('/settled-depo',adminPrivacy,getSettledDeposits)
router.get('/subs',adminPrivacy,getAllEmailSubs)
router.get('/all-verifications',adminPrivacy,getAllVerifications)
router.get('/contacts',adminPrivacy,getAllContacts)
router.post('/otp', adminPrivacy, sendPaymentOtp)
router.post('/confirm-trans', adminPrivacy, confirmTransfer)
router.get('/all-pending-transfers', adminPrivacy, getAllPendingReq)
router.get('/all-terminated-savings', adminPrivacy, getAllTerminatedSavings)
router.get('/all-completed-savings', adminPrivacy, getAllCompletedSavings)
router.get('/all-contacts', adminPrivacy, getAllContacts)
router.get('/all-card-pendings', adminPrivacy, getAllpendingCardWithdrawals)
router.get('/all-card-complete', adminPrivacy, getAllCompleteCardWithdrawals)
router.post('/confirm-card-withdrawal', adminPrivacy, confirmCardWithdrawal)

router.get('/fetch_successful_trans', adminPrivacy, fetchSuccessfulTrans)
router.post('/reverse_trans', adminPrivacy, reverseWithrawals)
router.get('/allreversed',adminPrivacy, getAllReveresedTrans)


// tickets
router.get('/all-tickets', adminPrivacy, getAllTickets)
router.get('/all-active-tickets', adminPrivacy, getAllActiveTickets)
router.post('/admin-response', adminPrivacy, createMessageAdmin)
router.get('/all-closed-tickets', adminPrivacy, getAllClosedTickets)
router.get('/pending-kycs', adminPrivacy, getAllPendingUserKYCS)
router.get('/verified-kycs', adminPrivacy, getAllApprovedKycs)
router.get('/verified-kycs', adminPrivacy, getAllVerifiedUserKYCS)
router.get('/one-ticket-msgs/:id',adminPrivacy,getOneTicketMessagesAdmin)
router.get('/one-kyc/:id',adminPrivacy,getOneUserKyc)
router.post('/approve-kyc',adminPrivacy,ApproveKYC)
router.post('/overturn-kyc',adminPrivacy,OverturnKyc)
router.post('/close-ticket/:id',adminPrivacy,closeTicket)



module.exports = router