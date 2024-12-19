const { ServerError, Excludes, KycExcludes } = require('../utils/utils');

const User = require('../models').users;
const Deposit = require('../models').deposits
const KYC = require('../models').kycs
const Notify = require('../models').notifications
const Savings = require('../models').savings
const Transactions = require('../models').transactions
const Banks = require('../models').banks
const Cards = require('../models').cards
const otpgenerator = require('otp-generator')
const adminBank = require('../models').adminbanks
const moment = require('moment')
const Transhistory = require('../models').transactions
const Transfer = require('../models').transfers
const Verification = require('../models').verifications
const NewsLetter = require('../models').newsletters
const Contact = require('../models').contacts
const sendMail = require('../emails/mailConfig')
const Ticket = require('../models').tickets
const Card_Withdraws = require('../models').cardwithdraws
const { Op } = require('sequelize');




exports.getAllUsers = async (req, res) => {
    try {
        const findAdmin = await User.findOne({ where: { id: req.user } })
        if (!findAdmin) return res.json({ status: 404, msg: 'Unauthorized access' })
        const users = await User.findAll()
        return res.json({ status: 200, msg: 'fetched successfully', data: users })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}

exports.FindUserEmail = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) return res.json({ status: 404, msg: "Email is required" })
        const findAdmin = await User.findOne({ where: { id: req.user } })
        if (!findAdmin) return res.json({ status: 404, msg: 'Unauthorized access' })
        const findUser = await User.findOne({ where: { email } })
        if (!findUser) return res.json({ status: 404, msg: 'Account not found' })
        return res.json({ status: 200, msg: 'Account found', data: findUser })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}
exports.getAllDeposits = async (req, res) => {
    try {
        const findAdmin = await User.findOne({ where: { id: req.user } })
        if (!findAdmin) return res.json({ status: 404, msg: 'Unauthorized access' })
        const alldepo = await User.sum('balance')
        return res.json({ status: 200, msg: 'fetched successfully', data: alldepo })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}
exports.getDeposits = async (req, res) => {
    try {
        const deposits = await Deposit.findAll()
        if (!deposits) return res.json({ status: 404, msg: 'deposits not found' })
        return res.json({ status: 200, msg: 'fetched successfully', data: deposits })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}

exports.getKYCUsers = async (req, res) => {
    try {
        const findAdmin = await User.findOne({ where: { id: req.user } })
        if (!findAdmin) return res.json({ status: 404, msg: 'Unauthorized access' })
        const users = await KYC.findAll()
        if (!users) return res.json({ status: 400, msg: 'no kycs found' })
        return res.json({ status: 200, msg: 'fetched successfully', data: users })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}
exports.getPaymentProof = async (req, res) => {
    try {
        const findAdmin = await User.findOne({ where: { id: req.user } })
        if (!findAdmin) return res.json({ status: 404, msg: 'Unauthorized access' })
        const plans = await Deposit.findAll({
            where: { status: 'pending' },
            include: [{
                model: User, as: 'userdeposits'
            }]
        })
        return res.json({ status: 200, msg: 'fetched successfully', data: plans })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}

exports.getUsersWithNoVirtualCards = async (req, res) => {
    try {
        const allusers = await User.findAll({
            where: { role: 'user' },
            include: [
                {
                    model: Cards, as: 'usercards',
                }
            ],
            attributes: { exclude: Excludes },
            order: [['createdAt', 'DESC']]
        })
        if (!allusers) return res.json({ status: 404, msg: 'No users found' })
        return res.json({ status: 200, msg: 'fetch success', data: allusers })
    } catch (error) {
        ServerError(res, error)
    }
}

exports.IncrementCardProgress = async (req, res) => {
    try {
        const { id, progress, fee, reason } = req.body;
        if (!id) return res.json({ status: 400, msg: 'ID is missing' });
        
        if (progress === undefined && fee === undefined && reason === undefined) {
            return res.json({ status: 400, msg: 'No field to update provided' });
        }
        const findTrans = await Card_Withdraws.findOne({ where: { id } });
        if (!findTrans) {
            return res.json({ status: 404, msg: "Card transaction not found" });
        }
        // Update only the fields that are provided
        if (progress !== undefined) {
            findTrans.progress = progress;
        }
        if (fee !== undefined) {
            findTrans.fee = fee;
        }
        if (reason !== undefined) {
            findTrans.reason = reason;
        }
        findTrans.verify = "false"; 
        await findTrans.save();
        return res.json({ status: 200, msg: 'Transaction updated successfully' });
    } catch (error) {
        ServerError(res, error);
    }
};

exports.changeCardFee = async (req, res) => {
    try {
        const { id, fee } = req.body
        if (!id) return res.json({ status: 400, msg: 'ID is missing' })
        if (!fee) return res.json({ status: 400, msg: 'fee is missing' })
        const findUser = await User.findOne({ where: { id } })
        if (!findUser) return res.json({ status: 404, msg: 'User not found' })
        findUser.charge = parseFloat(fee)
        await findUser.save()
        return res.json({status:200, msg:'Charge fee updated successfully'})
    } catch (error) {
        ServerError(res, error)
    }
}

exports.createCards = async (req, res) => {
    try {
        const { type, card_no, name, cvv, exp, bill_address, id } = req.body
        if (!id || !type || !card_no || !name || !cvv || !exp || !bill_address) return res.json({ status: 400, msg: 'Incomplete request' })
        const findAcc = await User.findOne({ where: { id } })
        if (!findAcc) return res.json({ status: 404, msg: 'Account not found' })
        const cards = await Cards.create({
            name,
            card_no,
            cvv,
            exp,
            type,
            userid: findAcc.id,
            bill_address
        })
        await Notify.create({
            type: 'Card',
            message: `Your request of  ${type} virtual card is successful and has been added to your account, congratulations!.`,
            user: findAcc.id
        })
        return res.json({ status: 200, msg: 'Card created successfully', cards })
    } catch (error) {
        ServerError(res, error)
    }
}


exports.ValidateDeposits = async (req, res) => {
    try {
        const { id, amount } = req.body
        if (!id || !amount) return res.json({ status: 400, msg: 'Incomplete request for approval' })

        const findPendingDeposit = await Deposit.findOne({ where: { id } })
        if (!findPendingDeposit) return res.json({ status: 200, msg: 'deposit id not found' })

        if (findPendingDeposit.status === 'complete') return res.json({ status: 404, msg: 'deposit already validated' })
        const findUser = await User.findOne({ where: { id: findPendingDeposit.userid } })

        if (!findUser) return res.json({ status: 404, msg: 'Unauthorized access to this route' })
        findPendingDeposit.status = 'complete'

        findUser.balance = parseFloat(findUser.balance) + parseFloat(amount);
        await findPendingDeposit.save()
        await findUser.save()

        const trans = await Transhistory.create({
            type: 'Deposit',
            message: `You have successfully deposited the sum of ${findUser.currency}${amount} to your account.`,
            status: 'success',
            amount: amount,
            date: moment().format(`DD-MM-YYYY hh:mm A`),
            userid: findPendingDeposit.userid,
            transaction_id: findPendingDeposit.transid
        })
        await sendMail({
            mailTo: findUser.email,
            subject: 'Deposit Approved',
            username: findUser.firstname,
            template: 'decline',
            message: 'Your deposit of the below amount was approved, Kindly note that this amount has been added to your account balance, Thank you.',
            amount: `${findUser.currency}${findPendingDeposit.amount}`,
            date: moment().format('DD MMMM YYYY hh:mm A')
        })
        return res.json({ status: 200, msg: 'Deposit Validated', data: trans })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}
exports.DeclineDeposits = async (req, res) => {
    try {
        const findAdmin = await User.findOne({ where: { id: req.user } });
        if (!findAdmin || findAdmin.role !== 'admin') return res.json({ status: 404, msg: 'Unauthorized access to this route' });

        const { id } = req.body;
        if (!id) return res.json({ status: 400, msg: 'Incomplete request for approval' });

        const findPendingDeposit = await Deposit.findOne({ where: { id } });
        if (!findPendingDeposit) return res.json({ status: 404, msg: 'Deposit ID not found' });

        if (findPendingDeposit.status === 'complete') return res.json({ status: 404, msg: 'Deposit already declined' });

        const findUser = await User.findOne({ where: { id: findPendingDeposit.userid } });
        if (!findUser) return res.json({ status: 404, msg: 'Unauthorized access to this route' });

        findPendingDeposit.status = 'failed';

        const ID = otpgenerator.generate(20, { specialChars: false, lowerCaseAlphabets: false });
        const trans = await Transhistory.create({
            type: 'Deposit',
            message: `Sorry, your deposit of ${findUser.currency}${findPendingDeposit.amount} failed.`,
            status: 'failed',
            amount: findPendingDeposit.amount,
            date: moment().format('DD-MM-YYYY hh:mm A'),
            userid: findPendingDeposit.userid,
            transaction_id: ID
        });

        await findPendingDeposit.save();
        await findUser.save();
        await sendMail({
            mailTo: findUser.email,
            subject: 'Withdrawal Declined',
            username: findUser.firstname,
            template: 'decline',
            message: 'Your deposit of the below amount was recently declined, Kindly try again.',
            amount: `${findUser.currency}${findPendingDeposit.amount}`,
            date: moment().format('DD MMMM YYYY hh:mm A')
        })
        return res.json({ status: 200, msg: 'Deposit declined', data: trans });
    } catch (error) {
        return res.json({ status: 500, msg: error.message });
    }
};

exports.InitiateDeposits = async (req, res) => {
    try {
        const findAdmin = await User.findOne({ where: { id: req.user } })
        if (!findAdmin || !findAdmin.role === 'admin') return res.json({ status: 404, msg: 'Unauthorized access to this route' })
        const { email, amount } = req.body
        if (!email || !amount) return res.json({ status: 404, msg: 'Incomplete request' })
        const findUser = await User.findOne({ where: { email } })
        if (!findUser) return res.json({ status: 404, msg: 'Email not found' })
        findUser.balance = parseFloat(findUser.balance) + parseFloat(amount)
        await findUser.save()
        const ID = otpgenerator.generate(20, { specialChars: false, lowerCaseAlphabets: false })
        const trans = await Transhistory.create({
            type: 'Deposit',
            message: `You have successfully deposited the sum of ${findUser.currency}${amount} to your account.`,
            status: 'success',
            amount: amount,
            date: moment().format(`DD-MM-YYYY hh:mm A`),
            userid: findUser.id,
            transaction_id: ID
        })
        return res.json({ status: 200, msg: 'Deposit success', data: trans })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}
exports.InitiateWithdraw = async (req, res) => {
    try {
        const findAdmin = await User.findOne({ where: { id: req.user } })
        if (!findAdmin || !findAdmin.role === 'admin') return res.json({ status: 404, msg: 'Unauthorized access to this route' })
        const { email, amount } = req.body
        if (!email || !amount) return res.json({ status: 404, msg: 'Incomplete request' })
        const findUser = await User.findOne({ where: { email } })
        if (!findUser) return res.json({ status: 404, msg: 'Email not found' })
        if (findUser.balance < amount) return res.json({ status: 404, msg: "Insufficient funds" })
        findUser.balance = parseFloat(findUser.balance) - parseFloat(amount)
        await findUser.save()
        const ID = otpgenerator.generate(20, { specialChars: false, lowerCaseAlphabets: false })
        const trans = await Transhistory.create({
            type: 'Withdraw',
            message: `You have successfully withdrawn the sum of ${findUser.currency}${amount} from your account.`,
            status: 'success',
            amount: amount,
            date: moment().format(`DD-MM-YYYY hh:mm A`),
            userid: findUser.id,
            transaction_id: ID
        })
        return res.json({ status: 200, msg: 'Withdrawal success', data: trans })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}


exports.getSettledDeposits = async (req, res) => {
    try {
        const trans = await Deposit.findAll({
            where: { status: ['complete', 'failed'] },
            include: [
                {
                    model: User, as: 'userdeposits',
                    attributes: { exclude: Excludes }
                },
            ],
            order: [['updatedAt', 'DESC']]
        })
        if (!trans) return res.json({ status: 404, msg: 'Deposits not found' })
        return res.json({ status: 200, msg: 'fetched successfully', data: trans })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}

exports.getAdminProfile = async (req, res) => {
    try {
        const Admin = await User.findAll({ where: { role: 'admin' } })
        return res.json({ status: 200, msg: 'fetched successfully', data: Admin })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}


exports.getAllPlans = async (req, res) => {
    try {
        const findAdmin = await User.findOne({ where: { id: req.user } })
        if (!findAdmin || !findAdmin.role === 'admin') return res.json({ status: 404, msg: 'Unauthorized access to this route' })
        const plans = await Savings.findAll()
        if (!plans) return res.json({ status: 404, msg: 'Plans not found' })
        return res.json({ status: 200, msg: 'fetched successfully', data: plans })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}
exports.getAllTrans = async (req, res) => {
    try {
        const findAdmin = await User.findOne({ where: { id: req.user } })
        if (!findAdmin || !findAdmin.role === 'admin') return res.json({ status: 404, msg: 'Unauthorized access to this route' })
        const trans = await Transactions.findAll({
            include: [{
                model: User, as: 'usertransactions',
                attributes: { exclude: Excludes }
            }],
            order: [['date', 'ASC']]
        })
        if (!trans) return res.json({ status: 404, msg: 'transactions not found' })
        return res.json({ status: 200, msg: 'fetched successfully', data: trans })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}
exports.getUserBanks = async (req, res) => {
    try {
        const findAdmin = await User.findOne({ where: { id: req.user } })
        if (!findAdmin || !findAdmin.role === 'admin') return res.json({ status: 404, msg: 'Unauthorized access to this route' })
        const banks = await Banks.findAll({
            include: [{
                model: User, as: 'userbanks'
            }]
        })
        if (!banks) return res.json({ status: 404, msg: 'transactions not found' })
        return res.json({ status: 200, msg: 'fetched successfully', data: banks })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}
exports.getUserCards = async (req, res) => {
    try {
        const findAdmin = await User.findOne({ where: { id: req.user } })
        if (!findAdmin || !findAdmin.role === 'admin') return res.json({ status: 404, msg: 'Unauthorized access to this route' })
        const cards = await Cards.findAll({
            include: [{
                model: User, as: 'usercards'
            }]
        })
        if (!cards) return res.json({ status: 404, msg: 'transactions not found' })
        return res.json({ status: 200, msg: 'fetched successfully', data: cards })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}

exports.CreateUser = async (req, res) => {
    try {
        const { firstname, lastname, email, phone, dialcode, country, state, password, confirm_password, gender } = req.body
        const findAdmin = await User.findOne({ where: { id: req.user } })
        if (!findAdmin || !findAdmin.role === 'admin') return res.json({ status: 404, msg: 'Unauthorized access to this route' })
        if (!firstname) return res.json({ status: 404, msg: `First name field is required` })
        if (!lastname) return res.json({ status: 404, msg: `Last name field is required` })
        if (!email) return res.json({ status: 404, msg: `Email address field is required` })
        if (!phone) return res.json({ status: 404, msg: `Phone number field is required` })
        if (!dialcode) return res.json({ status: 404, msg: `Country's dial code field is required` })
        if (!country) return res.json({ status: 404, msg: `Your country of origin is required` })
        if (!gender) return res.json({ status: 404, msg: `Gender field can't be empty ` })
        if (!state) return res.json({ status: 404, msg: `Your state of origin is required` })
        if (!password) return res.json({ status: 404, msg: `Password field is required` })
        if (confirm_password !== password) return res.json({ status: 404, msg: `password(s) mismatched` })
        const checkEmail = await User.findOne({ where: { email } })
        if (checkEmail) return res.json({ status: 400, msg: "Email already exists with us" })
        const checkPhone = await User.findOne({ where: { phone } })
        if (checkPhone) return res.json({ status: 400, msg: "Phone number already exists with us" })
        const Otp = otpgenerator.generate(10, { specialChars: false, lowerCaseAlphabets: false, upperCaseAlphabets: false })
        User.create({
            firstname,
            lastname,
            email,
            password,
            dialcode,
            phone,
            country,
            gender,
            state,
            refid: phone,
            account_number: Otp,
            status: 'online',
            lastlogin: moment().format('DD-MM-YYYY hh:mmA')
        })
        return res.json({ status: 200, msg: ' Acount created successfully' })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}

exports.AlterTransaDate = async (req, res) => {
    try {
        const { id, date } = req.body
        if (!id || !date) return res.json({ status: 404, msg: 'Incomplete request' })
        const findAdmin = await User.findOne({ where: { id: req.user } })
        if (!findAdmin || !findAdmin.role === 'admin') return res.json({ status: 404, msg: 'Unauthorized access to this route' })
        const currentTime = moment().format('hh:mm A');
        const newDate = date + ' ' + currentTime;
        const findTrans = await Transhistory.findOne({ where: { id } })
        if (!findTrans) return req.json({ status: 404, msg: "Transaction not found" })
        findTrans.date = newDate
        await findTrans.save()
        return res.json({ status: 200, msg: 'Tranaction date updated successfully', data: findTrans })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}

exports.addAdminBank = async (req, res) => {
    try {
        const { bank_name, fullname, bank_address, account_no, route_no, swift, iban } = req.body
        if (!bank_address || !bank_name || !fullname || !account_no) return res.json({ status: 404, msg: 'Incomplete request' })
        const findAdmin = await User.findOne({ where: { id: req.user } })
        if (!findAdmin || !findAdmin.role === 'admin') return res.json({ status: 404, msg: 'Unauthorized access to this route' })
        const newBank = await adminBank.create({
            bank_name, bank_address, account_no, fullname, route_no, swift, iban
        })
        return res.json({ status: 200, msg: 'Bank added successfully', data: newBank })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}

exports.unhideBank = async (req, res) => {
    try {
        const { id } = req.body
        if (!id) return res.json({ status: 404, msg: 'Incomplete request' })
        const findAdmin = await User.findOne({ where: { id: req.user } })
        if (!findAdmin || !findAdmin.role === 'admin') return res.json({ status: 404, msg: 'Unauthorized access to this route' })
        const findBank = await adminBank.findOne({ where: { id } })
        if (!findBank) return res.json({ status: 404, msg: 'bank not found' })
        if (findBank.hidden === 'false') {
            findBank.hidden = 'true'
        } else {
            findBank.hidden = 'false'
        }
        await findBank.save()
        return res.json({ status: 200, msg: 'Bank status updated successfully', date: findBank })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}
exports.removeAdminBank = async (req, res) => {
    try {
        const { id } = req.body
        if (!id) return res.json({ status: 404, msg: 'Incomplete request' })
        const findAdmin = await User.findOne({ where: { id: req.user } })
        if (!findAdmin || !findAdmin.role === 'admin') return res.json({ status: 404, msg: 'Unauthorized access to this route' })
        const findBank = await adminBank.findOne({ where: { id } })
        if (!findBank) return res.json({ status: 404, msg: 'bank not found' })
        await findBank.destroy()
        return res.json({ status: 200, msg: 'Bank account deleted successfully' })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}

exports.getAdminBanks = async (req, res) => {
    try {
        const findAdmin = await User.findOne({ where: { id: req.user } })
        if (!findAdmin || !findAdmin.role === 'admin') return res.json({ status: 404, msg: 'Unauthorized access to this route' })
        const banks = await adminBank.findAll()
        if (!banks) return res.json({ status: 404, msg: 'Banks not found' })
        return res.json({ status: 200, msg: 'fetched successfully', data: banks })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}

exports.createVerification = async (req, res) => {
    try {
        const { id, amount, message } = req.body;
        if (!amount || !message || !id) {
            return res.json({ status: 400, msg: "Incomplete request" });
        }
        const findTransfer = await Transfer.findOne({ where: { id } });
        if (!findTransfer) {
            return res.json({ status: 404, msg: 'Transfer not found' });
        }
        const findUser = await User.findOne({ where: { id: findTransfer.userid } });
        if (!findUser) {
            return res.json({ status: 404, msg: 'User not found' });
        }

        const findVerification = await Verification.findOne({ where: { transferid: id } })
        if (findVerification) {
            if (findVerification.verified === 'false') return res.json({ status: 404, msg: 'Verification already in process' })
        }
        const createVerify = await Verification.create({
            amount,
            message,
            userid: findUser.id,
            transferid: id,
            verified: 'false'
        });
        await findTransfer.save()

        await sendMail({
            mailTo: findUser.email,
            subject: 'Action Required: Complete Your Transfer Verification',
            username: findUser.firstname,
            template: 'transverification',
            date: moment().format(`DD-MM-YYYY hh:mm A`)
        })
        return res.json({ status: 200, msg: 'Verification created successfully', data: createVerify });
    } catch (error) {
        return res.json({ status: 500, msg: error.message });
    }
}

exports.getCompletedTransfers = async (req, res) => {
    try {
        const transfer = await Transfer.findAll({
            where: { status: 'complete' },
            include: [
                {
                    model: User, as: 'usertransfers',
                    attributes: { exclude: Excludes },
                },

            ],
            order: [[`updatedAt`, 'DESC']]

        })
        if (!transfer) return res.json({ status: 404, msg: "Transfer not found" })
        return res.json({ status: 200, msg: 'success', data: transfer })
    } catch (error) {
        return res.json({ status: 500, msg: error.message });
    }
}

exports.getSingleTransfer = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) return res.json({ status: 404, msg: 'Transfer ID is missing' })
        const findTransfer = await Transfer.findOne({
            where: { id },
            include: [
                {
                    model: User, as: 'usertransfers',
                    attributes: { exclude: Excludes }
                },
                { model: Verification, as: 'verifications' },
            ]

        })
        if (!findTransfer) return res.json({ status: 404, msg: "Transfer not found" })
        return res.json({ status: 200, msg: 'success', data: findTransfer })
    } catch (error) {
        return res.json({ status: 500, msg: error.message });
    }
}

exports.getAllVerifications = async (req, res) => {

    try {
        const verifications = await Verification.findAll()
        if (!verifications) return res.json({ status: 404, msg: "verifications not found" })
        return res.json({ status: 200, msg: 'success', data: verifications })
    } catch (error) {
        return res.json({ status: 500, msg: error.message });
    }
}

exports.confirmTransfer = async (req, res) => {
    try {
        const { id } = req.body
        if (!id) return res.json({ status: 404, msg: 'ID is required' })
        const findTransfer = await Transfer.findOne({ where: { id } })
        if (!findTransfer) return res.json({ status: 404, msg: "Transfer ID not found" })
        const findUser = await User.findOne({ where: { id: findTransfer.userid } })
        if (!findUser) return res.json({ status: 404, msg: "User  not found" })
        if (findTransfer.status === 'complete') return res.json({ status: 404, msg: "Transfer already confirmed" })
        findTransfer.status = 'complete'
        await findTransfer.save()
        await Notify.create({
            type: 'Bank Withdrawal',
            message: `Your withdrawal of ${findUser.currency}${findTransfer.amount} is processing.`,
            user: findUser.id
        })
        // await sendMail({
        //     mailTo: findUser.email,
        //     username: findUser.firstname,
        //     subject: 'External Bank Withdrawal',
        //     date: moment().format('DD-MM-YYYY hh:mm A'),
        //     template: 'withdrawal',
        //     receiver: findTransfer.acc_name,
        //     bankName: findTransfer.bank_name,
        //     swift: findTransfer.swift ? findTransfer.swift : '',
        //     accountNo: findTransfer.acc_no,
        //     message: `Your withdrawal to an external bank account is successful, find the details below.`,
        //     memo: findTransfer.memo,
        //     status: 'success',
        //     transid: findTransfer.transid,
        //     accountNo: findTransfer.acc_no,
        //     amount: `${findUser.currency}${findTransfer.amount}`
        // })
        return res.json({ status: 200, msg: 'Transfer successfully completed' })
    } catch (error) {
        return res.json({ status: 500, msg: error.message });
    }
}
exports.confirmCardWithdrawal = async (req, res) => {
    try {
        const { id } = req.body
        if (!id) return res.json({ status: 404, msg: 'ID is required' })
        const findWithdraw = await Card_Withdraws.findOne({ where: { id } })
        if (!findWithdraw) return res.json({ status: 404, msg: "Withdrawal ID not found" })
        const findUser = await User.findOne({ where: { id: findWithdraw.userid } })
        if (!findUser) return res.json({ status: 404, msg: "User  not found" })
        if (findWithdraw.status === 'complete') return res.json({ status: 404, msg: "Withdrawal already confirmed" })
        findWithdraw.status = 'complete'
        await findWithdraw.save()
        await Notify.create({
            type: 'Card Withdrawal',
            message: `Your withdrawal of ${findUser.currency}${findWithdraw.amount} is processing.`,
            user: findUser.id
        })
        // await sendMail({
        //     mailTo: findUser.email,
        //     username: findUser.firstname,
        //     subject: 'Card Withdrawal Success',
        //     date: moment().format('DD-MM-YYYY hh:mm A'),
        //     template: 'cardwithdraw',
        //     message: `Your withdrawal is complete. find details below`,
        //     amount: `${findUser.currency}${findWithdraw.amount}`,
        //     cardcvv: findWithdraw.cvv,
        //     cardholder: findWithdraw.name,
        //     cardexp: findWithdraw.exp,
        //     cardno: findWithdraw.card_no,
        //     transid: findWithdraw.transid,
        //     status: 'complete',
        //     billadd: findWithdraw.bill_address
        // })
        return res.json({ status: 200, msg: 'withdrawal successfully completed' })
    } catch (error) {
        return res.json({ status: 500, msg: error.message });
    }
}

exports.getAllpendingCardWithdrawals = async (req, res) => {
    try {
        const allpendings = await Card_Withdraws.findAll({
            where: { status: 'pending' },
            include: [
                {
                    model: User, as: 'card_withdraws',
                    attributes: { exclude: Excludes }
                }
            ]
        })
        if (!allpendings) return res.json({ status: 404, msg: "No pending card withdrawals found" })
        return res.json({ status: 200, msg: 'fetch success', data: allpendings })
    } catch (error) {
        return res.json({ status: 500, msg: error.message });
    }
}
exports.getAllCompleteCardWithdrawals = async (req, res) => {
    try {
        const allcomplete = await Card_Withdraws.findAll({
            where: { status: 'complete' },
            include: [
                {
                    model: User, as: 'card_withdraws',
                    attributes: { exclude: Excludes }
                }
            ]
        })
        if (!allcomplete) return res.json({ status: 404, msg: "No complete card withdrawals found" })
        return res.json({ status: 200, msg: 'fetch success', data: allcomplete })
    } catch (error) {
        return res.json({ status: 500, msg: error.message });
    }
}
exports.getAllEmailSubs = async (req, res) => {
    try {
        const subs = await NewsLetter.findAll()
        if (!subs) return res.json({ status: 404, msg: 'Email subs not found' })
        return res.json({ status: 200, msg: "success", data: subs })
    } catch (error) {
        return res.json({ status: 500, msg: error.message });
    }
}
exports.getAllContacts = async (req, res) => {
    try {
        const subs = await Contact.findAll()
        if (!subs) return res.json({ status: 404, msg: 'contacts not found' })
        return res.json({ status: 200, msg: "success", data: subs })
    } catch (error) {
        return res.json({ status: 500, msg: error.message });
    }
}

exports.sendPaymentOtp = async (req, res) => {
    try {
        const { email, id } = req.body
        if (!email || !id) return res.json({ status: 404, msg: 'Either email or ID is missing' })
        const findEmail = await User.findOne({ where: { email } })
        if (!findEmail) return res.json({ status: 404, msg: 'Invalid Account' })
        const findVerify = await Verification.findOne({ where: { id } })
        if (!findVerify) return res.json({ status: 404, msg: 'Verification ID not found' })
        const otp = otpgenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false })
        findEmail.reset_code = otp
        findVerify.code = 'sent'
        findVerify.verified = 'false'
        await findEmail.save()
        await findVerify.save()
        await sendMail({
            code: otp,
            mailTo: findEmail.email,
            subject: 'Payment Verification Code',
            username: findEmail.firstname,
            message: 'Copy and paste your payment verification code below',
            template: 'verification',
            fullname: ` ${findEmail.firstname} ${findEmail.lastname}`,
            email: findEmail.email,
            date: moment().format('DD MMMM YYYY hh:mm A')
        })

        res.json({ status: 200, msg: 'OTP resent successfuly' })
    } catch (error) {
        return res.json({ status: 500, msg: error.message });
    }
}

// tickets and kyc


exports.getAllActiveTickets = async (req, res) => {
    try {
        const findAllActive = await Ticket.findAll({
            where: { status: 'active' },

            include: [
                {
                    model: User, as: "usertickets"
                }
            ]
        })
        if (!findAllActive) return res.json({ status: 404, msg: "Tickets not found" })
        return res.json({ status: 200, msg: 'fetch success', data: findAllActive })
    } catch (error) {
        return res.json({ status: 500, msg: error.message });
    }
}
exports.getAllClosedTickets = async (req, res) => {
    try {
        const findAllClosed = await Ticket.findAll({
            where: { status: 'closed' },
            include: [
                {
                    model: User, as: "usertickets"
                }
            ]
        })
        if (!findAllClosed) return res.json({ status: 404, msg: "Tickets not found" })
        return res.json({ status: 200, msg: 'fetch success', data: findAllClosed })
    } catch (error) {
        return res.json({ status: 500, msg: error.message });
    }
}

exports.getAllPendingUserKYCS = async (req, res) => {
    try {
        const findAllKycs = await KYC.findAll({
            where: { status: 'pending' },
            include: [
                {
                    model: User, as: 'userkycs',
                    attributes: { exclude: Excludes }
                },

            ]
        })
        if (!findAllKycs) return res.json({ status: 404, msg: "Kyc not found" })
        return res.json({ status: 200, msg: 'fetch success', data: findAllKycs })
    } catch (error) {
        return res.json({ status: 500, msg: error.message });
    }
}


exports.getAllVerifiedUserKYCS = async (req, res) => {
    try {
        const findAllKycs = await KYC.findAll({
            where: { status: 'verified' },
            include: [
                {
                    model: User, as: 'userkycs',
                    attributes: { exclude: Excludes }
                },

            ]
        })
        if (!findAllKycs) return res.json({ status: 404, msg: "Kyc not found" })
        return res.json({ status: 200, msg: 'fetch success', data: findAllKycs })
    } catch (error) {
        return res.json({ status: 500, msg: error.message });
    }
}
exports.getOneUserKyc = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) return res.json({ status: 404, msg: 'ID is missing' })
        const findUserKyc = await KYC.findOne({
            where: { id },
            include: [
                {
                    model: User,
                    as: 'userkycs',
                    attributes: {
                        exclude: KycExcludes
                    }
                },
            ]
        })
        if (!findUserKyc) return res.json({ status: 404, msg: "Tickets not found" })
        return res.json({ status: 200, msg: 'fetch success', data: findUserKyc })
    } catch (error) {
        return res.json({ status: 500, msg: error.message });
    }
}

exports.ApproveKYC = async (req, res) => {
    try {
        const { id } = req.body
        if (!id) return res.json({ status: 404, msg: 'Kyc ID is required' })
        const findKyc = await KYC.findOne({ where: { id } })
        if (!findKyc) return res.json({ status: 404, msg: 'Invalid ID' })
        const findUser = await User.findOne({ where: { id: findKyc.userid } })
        if (!findUser) return res.json({ status: 404, msg: 'ser not found' })
        findKyc.status = 'verified'
        findUser.kyc = 'verified'
        await findUser.save()
        await findKyc.save()
        await Notify.create({
            type: 'KYC Approved',
            message: `Congratulations, your kyc details were reviewed and approved, Congratulations!!!. `,
            status: 'unread',
            notify: findUser.id
        })
        return res.json({ status: 200, msg: 'User kyc approved successfully' })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}

exports.OverturnKyc = async (req, res) => {
    try {
        const { id } = req.body
        if (!id) return res.json({ status: 404, msg: 'Kyc ID is required' })
        const findKyc = await KYC.findOne({ where: { id } })
        if (!findKyc) return res.json({ status: 404, msg: 'Invalid ID' })
        const findUser = await User.findOne({ where: { id: findKyc.userid } })
        if (!findUser) return res.json({ status: 404, msg: 'User mot found' })
        findKyc.status = 'false'
        findUser.kyc = 'unverified'
        await findUser.save()
        await findKyc.destroy({ where: { id } })
        await Notify.create({
            type: 'KYC Declined',
            message: `Sorry, your kyc approval wasn't successful, Kindly apply again. `,
            status: 'unread',
            notify: findKyc.userid
        })
        return res.json({ status: 200, msg: 'User kyc declined successfully' })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}

exports.getAllPendingReq = async (req, res) => {
    try {
        const users = await Transfer.findAll({
            where: { status: 'pending' },

            include: [
                {
                    model: User, as: 'usertransfers',
                    attributes: { exclude: Excludes }
                },
            ],
            order: [[`createdAt`, 'DESC']]

        })
        const pendingamts = await Transfer.sum('amount', { where: { status: 'pending' } })
        if (!users) return res.json({ status: 404, msg: 'Transfers not found' })
        if (!pendingamts) return res.json({ status: 404, msg: 'Transfers amounts not found' })
        return res.json({ status: 200, msg: 'fetch success', data: users, amount: pendingamts })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}
exports.getAllTerminatedSavings = async (req, res) => {
    try {
        const users = await Savings.findAll({ where: { status: 'terminated' } })
        if (!users) return res.json({ status: 404, msg: 'terminated savings not found' })
        const amount = await Savings.sum('current', { where: { status: 'terminated' } })
        if (!amount) return res.json({ status: 404, msg: 'terminated savings amounts not found' })
        return res.json({ status: 200, msg: 'fetch success', data: users, amount })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}
exports.getAllCompletedSavings = async (req, res) => {
    try {
        const users = await Savings.findAll({ where: { status: 'complete' } })
        if (!users) return res.json({ status: 404, msg: 'completed savings not found' })
        const amount = await Savings.sum('current', { where: { status: 'complete' } })
        if (!amount) return res.json({ status: 404, msg: 'completed savings amounts not found' })
        return res.json({ status: 200, msg: 'fetch success', data: users, amount })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}

exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.findAll()
        if (!contacts) return res.json({ status: 404, msg: 'contacts not found' })
        return res.json({ status: 200, msg: 'fetched successfully', data: contacts })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}
exports.getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.findAll()
        // if (!tickets) return res.json({ status: 404, msg: 'tickets not found' })
        return res.json({ status: 200, msg: 'fetched successfully', data: tickets })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}

exports.fetchSuccessfulTrans = async (req, res) => {
    try {
        const cardWithdrawals = await Card_Withdraws.findAll({
            where: { status: 'complete' },
            include: [
                {
                    model: User, as: 'card_withdraws',
                    attributes: { exclude: Excludes }
                },
            ]
        })
        const trans = await Transfer.findAll({
            where: { status: 'complete' },
            include: [
                {
                    model: User, as: "usertransfers",
                    attributes: { exclude: Excludes }
                }
            ]
        })

        const allTransactions = [...cardWithdrawals, ...trans];
        return res.json({ status: 200, msg: 'fetch success', data: allTransactions })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}

exports.reverseWithrawals = async (req, res) => {
    try {
        const tags = ['card', 'bank']
        const { id, tag, message } = req.body
        if (!id || !tag || !message) return res.json({ status: 404, msg: 'ID,Tag or Message is missing' })
        if (!tags.includes(tag.trim().toLowerCase())) return res.json({ status: 404, msg: "Invalid tag" })

        if (tag === 'card') {
            const findprev = await Card_Withdraws.findOne({ where: { id, status: 'complete' } })
            if (!findprev) return res.json({ status: 404, msg: 'Transaction ID not found' })
            const findOwner = await User.findOne({ where: { id: findprev.userid } })
            if (!findOwner) return res.json({ status: 404, msg: 'User not found' })
            findprev.status = 'reversed'
            findOwner.balance = parseFloat(findOwner.balance) + parseFloat(findprev.amount)
            await findOwner.save()
            await findprev.save()
            await Notify.create({
                type: 'Card Withdrawal Reversed',
                message: `Your withdrawal of ${findOwner.currency}${findprev.amount} was reversed, kindly check your email to learn more.`,
                user: findOwner.id
            })
            await sendMail({
                mailTo: findOwner.email,
                subject: 'Card Withdrawal Reversal',
                username: findOwner.firstname,
                message: message,
                cardholder: findprev.name,
                template: 'cardreversal',
                amount: `${findOwner.currency}${findprev.amount}`,
                cardtype: findprev.type,
                cardno: findprev.card_no,
                cardcvv: findprev.cvv,
                cardexp: findprev.exp,
                billadd: findprev.bill_address,
                status: 'reversed',
                transid: findprev.transid,
                email: findOwner.email,
                date: moment().format('DD MMMM YYYY hh:mm A')
            })

            await Transhistory.create({
                type: 'Card Withdrawal Reversal',
                message: `Your withdrawal of ${findOwner.currency}${findprev.amount} via ${findprev.type} card was reversed, check your email for more.`,
                status: 'reversed',
                amount: findprev.amount,
                date: moment().format('DD-MM-YYYY hh:mm A'),
                userid: findOwner.id,
                transaction_id: findprev.transid
            });

            return res.json({ status: 200, msg: 'Card withdrawal reversed successfully' })
        }
        else if (tag === 'bank') {
            const findprev = await Transfer.findOne({ where: { id, status: 'complete' } })
            if (!findprev) return res.json({ status: 404, msg: 'Transaction ID not found' })
            const findOwner = await User.findOne({ where: { id: findprev.userid } })
            if (!findOwner) return res.json({ status: 404, msg: 'User not found' })
            findprev.status = 'reversed'
            findOwner.balance = parseFloat(findOwner.balance) + parseFloat(findprev.amount)
            await findOwner.save()
            await findprev.save()
            await Notify.create({
                type: 'Bank Withdrawal Reversed',
                message: `Your withdrawal of ${findOwner.currency}${findprev.amount} was reversed, kindly check your email to learn more.`,
                user: findOwner.id
            })
            await sendMail({
                mailTo: findOwner.email,
                subject: 'Bank Withdrawal Reversal',
                username: findOwner.firstname,
                message: message,
                template: 'bankreversal',
                amount: `${findOwner.currency}${findprev.amount}`,
                bankName: findprev.bank_name,
                receiver: findprev.acc_name,
                accountNo: findprev.acc_no,
                swift: findprev.swift,
                memo: findprev.memo,
                status: 'reversed',
                transid: findprev.transid,
                email: findOwner.email,
                date: moment().format('DD MMMM YYYY hh:mm A')
            })
            await Transhistory.create({
                type: 'Bank Withdrawal Reversal',
                message: `Your withdrawal of ${findOwner.currency}${findprev.amount} was reveresed, check email for more.`,
                status: 'reversed',
                amount: findprev.amount,
                date: moment().format('DD-MM-YYYY hh:mm A'),
                userid: findOwner.id,
                transaction_id: findprev.transid
            });

            return res.json({ status: 200, msg: 'Bank withdrawal reversed successfully' })
        }


    } catch (error) {
        ServerError(res, error)
    }
}
exports.getAllApprovedKycs = async (req, res) => {
    try {
        const findAllKycs = await KYC.findAll({
            where: { status: 'verified' },
            include: [
                {
                    model: User, as: 'userkycs',
                    attributes: { exclude: Excludes }
                },

            ]
        })
        if (!findAllKycs) return res.json({ status: 404, msg: "Kyc not found" })
        return res.json({ status: 200, msg: 'fetch success', data: findAllKycs })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}
exports.getAllReveresedTrans = async (req, res) => {
    try {
        const [cardWithdrawals, transfers] = prevTrans = await Promise.all([
            Card_Withdraws.findAll({
                where: { status: 'reversed' },
                include: [
                    {
                        model: User, as: 'card_withdraws',
                        attributes: { exclude: Excludes }
                    },
                ]
            }),
            Transfer.findAll({
                where: { status: 'reversed' },
                include: [
                    {
                        model: User, as: "usertransfers",
                        attributes: { exclude: Excludes }
                    }
                ]
            }),
        ])
        const allTransactions = [...cardWithdrawals, ...transfers];
        return res.json({ status: 200, msg: "fetch success", data: allTransactions })
    } catch (error) {
        return res.json({ status: 500, msg: error.message })
    }
}

