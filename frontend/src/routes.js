import Signup from "forms/Signup";
import Home from "./general/Home";
import Dashboard from "./user/Dashboard";
import Notfound from "general/Nofound";
import Login from "forms/Login";
import ForgotPassword from "forms/ForgotPassword";
import VerifyEmailAccount from "forms/VerifyEmail";
import Savings from "user/Savings";
import Transfer from "user/Transfer";
import Transactions from "user/Transactions";
import Notifications from "user/Notifications";
import Settings from "user/Settings";
import Profile from "user/Profile";
import Loans from "user/Loans";
import AdminDashboard from "admin/AdminDashboard";
import AllTransfers from "admin/adminComponents/AllTransfers";
import AllUsers from "admin/adminComponents/AllUsers";
import AllTransactions from "admin/adminComponents/AllTransactions";
import Banks from "admin/adminComponents/Banks";
import Contacts from "admin/adminComponents/Contacts";
import Newsletters from "admin/adminComponents/Newsletters";
import Services from "components/general/Services";
import ContactUs from "components/general/ContactUs";
import AboutUs from "components/general/AboutUs";
import PrivacyPolicy from "components/general/PrivacyPolicy";
import TermsofUse from "components/general/TermsofUse";
import TicketsStatus from "user/TicketsStatus";
import Messages from "user/Messages";
import UserKYC from "utils/UserKYC";
import AdminActiveChats from "admin/adminComponents/AdminActiveChats";
import AdminClosedChats from "admin/adminComponents/AdminClosedChats";
import AdminMessages from "admin/utils/AdminMessages";
import UserKYCS from "admin/adminComponents/UserKYCS";
import PendingKycs from "admin/utils/PendingKycs";
import ApprovedKycs from "admin/utils/ApprovedKycs";
import KycModal from "admin/utils/KycModal";
import ActiveComponent from "utils/ActiveComponent";
import ClosedComponent from "utils/ClosedComponent";
import VerifiedTransfers from "admin/adminComponents/VerifiedTransfers";
import PendingTransfers from "admin/adminComponents/PendingTransfers";
import LinkedAccounts from "user/LinkedAccounts";
import PendingCardWithdrawals from "admin/adminComponents/PendingCardWithdrawals";
import VerifiedCardWithdrawals from "admin/adminComponents/VerifiedCardWithdrawals";
import ReverseWithdrawals from "admin/adminComponents/ReverseWithdrawals";





export const FormRoutes = [
    { path: '/signup', component: Signup },
    { path: '/login', component: Login },
    { path: '/forgot-password', component: ForgotPassword },
    { path: '/verify-email', component: VerifyEmailAccount },
]

export const GeneralRoutes = [
    { path: '/', component: Home },
    { path: '*', component: Notfound },
    { path: 'services', component: Services },
    { path: 'contact-us', component: ContactUs },
    { path: 'about-us', component: AboutUs },
    { path: 'privacy-policy', component: PrivacyPolicy },
    { path: 'terms', component: TermsofUse },
]


export const UserRoutes = [
    { path: '', component: Dashboard },
    { path: 'deposits', component: Savings },
    { path: 'withdrawals', component: Transfer },
    { path: 'linked_accounts', component: LinkedAccounts },
    // { path: 'local-transfers', component: InternalTransfer },
    { path: 'transactions', component: Transactions },
    { path: 'notifications', component: Notifications },
    { path: 'settings', component: Settings },
    { path: 'profile', component: Profile },
    { path: 'loans', component: Loans },
    { path: 'tickets/status/active_chats/:id', component: Messages },
    { path: 'tickets/status/closed_chats/:id', component: Messages },
    { path: 'tickets/status/create', component: TicketsStatus },
    { path: 'tickets/status/active', component: ActiveComponent },
    { path: 'tickets/status/closed', component: ClosedComponent },
    { path: 'kyc', component: UserKYC}


]
export const AdminRoutes = [
    { path: 'overview', component: AdminDashboard },
    { path: 'transfers', component: AllTransfers },
    { path: 'transactions', component: AllTransactions },
    { path: 'users', component: AllUsers },
    { path: 'pending_transfers', component: PendingTransfers },
    { path: 'verified_transfers', component: VerifiedTransfers  },
    { path: 'reverse_transfers', component: ReverseWithdrawals  },
    { path: 'banks', component: Banks },
    { path: 'contacts', component: Contacts },
    { path: 'newsletters', component: Newsletters },
    { path: 'tickets/active_chats', component: AdminActiveChats },
    { path: 'tickets/closed_chats', component: AdminClosedChats },
    { path: 'tickets/active_chats/chats/:id', component: AdminMessages },
    { path: 'tickets/closed_chats/chats/:id', component: AdminMessages },
    { path: 'kycs', component: UserKYCS },
    { path: 'kycs/pending', component: PendingKycs },
    { path: 'kycs/verified', component: ApprovedKycs },
    { path: 'kycs/verified/:id', component: KycModal },
    { path: 'kycs/pending/:id', component: KycModal },
    { path: 'pending_card_withdrawals', component: PendingCardWithdrawals },
    { path: 'verified_card_withdrawals', component: VerifiedCardWithdrawals },


]