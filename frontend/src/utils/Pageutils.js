import { PiUserBold } from 'react-icons/pi'
import { GiReceiveMoney } from 'react-icons/gi'
import { BsPiggyBank } from 'react-icons/bs'
import img from 'assets/img.jpg'
import img1 from 'assets/img1.jpg'
import img2 from 'assets/img2.jpg'
import img3 from 'assets/img3.jpg'
import img4 from 'assets/img4.jpg'
import { TbTransactionDollar } from "react-icons/tb";
import { BiTransferAlt } from "react-icons/bi";
import { BsPersonArmsUp } from "react-icons/bs";
import { MdSavings } from "react-icons/md";
import { MdOutlineSecurity } from "react-icons/md";
import { FcManager } from "react-icons/fc";
import { MdSupportAgent } from "react-icons/md";
import { MdOutlineManageAccounts } from "react-icons/md";
import { GiPodiumWinner } from "react-icons/gi";
import { SiteName } from './functions'
import heroimg from 'assets/hero-slide-1.png'
import heroimg1 from 'assets/hero-slide-2.png'
import heroimg2 from 'assets/hero-slide-3.png'




export const HomeServices = [
    {
        title: 'Open an account',
        content: 'Open an account with us and gain access to global money transfer',
        Icon: PiUserBold,
    },
    {
        title: 'Money transfer',
        content: 'Reliable, safe and secure ways to send and recieve money globally',
        Icon: GiReceiveMoney,
    },
    {
        title: 'Saving goals',
        content: 'Reduce exessive spendings and shortage of finance by increasing your savings effortlessly',
        Icon: BsPiggyBank,
    },
]

export const HomeAnalyses = [
    { title: 'total users', total: 46, type: 'K  ' },
    { title: 'active users', total: 32, type: 'K' },
    { title: 'daily transactions', total: 350, type: 'K' },
    { title: 'weekly transactions', total: 2.65, type: 'M' },
]

export const HomeTestimonials = [

    { img: img1, content: `"I’ve been with ${SiteName} for over a decade, and they have consistently exceeded my expectations. Their support during the early stages of my business was invaluable, offering customized loan solutions that helped us grow. The personalized service I receive makes me feel like a valued client, not just another account number."`, user: 'John M., Small Business Owner' },
    { img: img, content: `"When we were looking to buy our first home, ${SiteName} made the process smooth and stress-free. Their mortgage specialists took the time to understand our needs and walked us through every step. We couldn’t be happier with the rates and the service. They turned our dream of homeownership into a reality."`, user: 'Sarah L., Homeowner' },
    { img: img2, content: `"As a freelancer, managing finances can be challenging, but ${SiteName} has made it easier with their flexible and user-friendly online banking tools. Their customer service is top-notch, always ready to help whenever I have a question. I recommend them to anyone looking for a reliable banking partner."`, user: 'David R., Freelance Consultant' },
    { img: img3, content: `"After retiring, I was concerned about managing my savings and ensuring financial security. ${SiteName} offered me a tailored plan that aligns with my retirement goals. Their financial advisors are knowledgeable and approachable, making me feel confident in my financial future. I couldn’t ask for a better bank."`, user: 'Emily S., Retiree' },
    { img: img4, content: `"As a student, budgeting and saving can be tough, but ${SiteName} has made it much easier. Their student account has no hidden fees, and the mobile app is super convenient for managing my money on the go. Plus, their customer service is always helpful when I have questions. I highly recommend them to all students!"`, user: 'Michael B., College Student' },
]

export const HeroSlides = [
    {
        tip:'instant money transfer',
        title:'Digital banking made for digital users',
        content:'Pinerock credit union is an all-in one mobile banking app chock full of all the tools, tips, and tricks you need to take contol of your financies.',
        img:heroimg,
    },
    {
        tip:'online payment system',
        title:'secured & easy online payment solution',
        content:"Feel reassured when you bank with us - we're certified by the government programme Cyber Essentials. This means we're able to defend against common cyber threats.",
        img:heroimg1,
    },
    {
        tip:'Global money transfer',
        title:'Move your money in easy secured steps',
        content:"Feel safe when you bank online on our mobile. As long as  you manage your account properly, our guarantee protects you and your money from fraud.",
        img:heroimg2,
    }
]
export const services = [
    {
        title: 'Seamless International Transfers',
        desc: "Effortlessly send and receive money across borders with our intuitive platform. We support multiple currencies, ensuring your funds are transferred quickly and securely, all while offering some of the most competitive rates in the market.",
        icon: <BiTransferAlt />
    },
    {
        title: 'Low Transaction Fees',
        desc: "Keep more of your money where it belongs—with you. We charge minimal fees on every transaction, whether local or international, so you can save more and spend less on unnecessary costs.",
        icon: <TbTransactionDollar />
    },
    {
        title: 'Personalized Savings Goals',
        desc: "Achieve your financial dreams with our tailored savings goals feature. Set specific targets, track your progress, and enjoy the satisfaction of reaching your goals with our easy-to-use tools.",
        icon: <BsPersonArmsUp />
    },
    {
        title: 'Automated Savings',
        desc: "Make saving effortless by setting up automated contributions to your savings goals. Whether you want to save weekly, bi-weekly, or monthly, we’ve got you covered. Sit back and watch your savings grow without lifting a finger.",
        icon: <MdSavings />
    },
    {
        title: 'Comprehensive Account Management',
        desc: "Manage your account with ease. From tracking transactions to setting budgets, our user-friendly dashboard puts all your financial tools in one place, giving you complete control over your finances.",
        icon: <FcManager />
    },
    {
        title: 'Robust Security',
        desc: "Your security is our top priority. We use advanced encryption and multi-factor authentication to protect your personal and financial information, ensuring your peace of mind with every transaction.",
        icon: <MdOutlineSecurity />
    },
    {
        title: '24/7 Customer Support',
        desc: "Our dedicated customer support team is available around the clock to assist you with any questions or concerns. Whether you need help with a transaction or have a query about our services, we’re just a call or click away.",
        icon: <MdSupportAgent />
    },
    {
        title: 'Flexible Fund Management',
        desc: "Easily move funds between your accounts or send money to others with just a few clicks. Our platform makes fund management flexible and straightforward, so you can handle your finances with confidence.",
        icon: <MdOutlineManageAccounts />
    },
    {
        title: 'Rewards and Incentives',
        desc: "Enjoy exclusive rewards for being a loyal user. From cashback on transactions to bonuses on savings, we believe in giving back to our customers. Stay tuned for exciting offers and promotions designed just for you.",
        icon: <GiPodiumWinner />
    },

]

export const privacyPolicy = [
    {
        title: "Introduction",
        number: '1',
        desc: [
            {
                info: 'Welcome to Pinerock Credit Union. We are committed to protecting your personal data and ensuring your privacy. This policy outlines how we collect, use, and safeguard your information when you use our services.'
            }
        ]
    },
    {
        title: "Information We Collect",
        number: '2',
        desc: [

            {
                info: `<span style="font-weight:bold;">Personal Information:</span> We collect personal information such as your name, email address, phone number, and financial details when you create an account, use our services, or communicate with us.`
            },
            {
                info: `<span style="font-weight:bold;">Tranactional Data:</span> Information related to your transactions, such as deposits, withdrawals, and transfers.`
            },
            {
                info: `<span style="font-weight:bold;">Technical Data:</span> We may collect information about your device, IP address, browser type, and other technical details through cookies and similar technologies.`
            },
        ]
    },
    {
        title: "How We Use Your Information",
        number: '3',
        desc: [

            {
                info: `<span style="font-weight:bold;">To Provide Services:</span> We use your personal information to manage your account, process transactions, and provide customer support.`
            },
            {

                info: `<span style="font-weight:bold;">For Communication:</span>  To send you updates, notifications, and important information about your account or our services.`
            },
            {
                info: `<span style="font-weight:bold;">To Improve Our Services:</span> We may analyze your data to improve our platform, develop new features, and enhance user experience.`
            },
            {

                info: `<span style="font-weight:bold;">For Legal Compliance:</span> To comply with legal obligations, including fraud prevention, identity verification, and reporting requirements.`
            },
        ]
    },
    {
        title: "How We Share Your Information",
        number: '4',
        desc: [

            {
                info: ` <span style="font-weight:bold;">With Third-Party Service Providers:</span> We may share your information with trusted third-party service providers who assist us in operating our platform, processing payments, or conducting business activities.`
            },
            {
                info: `<span style="font-weight:bold;">For Legal Purposes</span> We may disclose your information if required by law, regulation, or legal process.`
            },
            {
                title: 'With Your Consent: ',
                info: `<span style="font-weight:bold;">With Your Consent:</span>  We may share your information with third parties when we have your explicit consent to do so.`
            },
        ]
    },
    {
        title: "Data Security",
        number: '5',
        desc: [

            {
                info: "We use industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no data transmission over the internet is completely secure, and we cannot guarantee absolute security."
            },

        ]
    },
    {
        title: "Your Rights",
        number: '6',
        desc: [

            {

                info: `<span style="font-weight:bold;">Access and Correction:</span> You have the right to access, correct, or update your personal information.`
            },
            {

                info: `<span style="font-weight:bold;">Data Deletion:</span> You can request the deletion of your personal data, subject to legal and contractual restrictions.`
            },
            {
                info: `<span style="font-weight:bold;">Opt-Out:</span> You can opt out of receiving marketing communications from us at any time.`
            },

        ]
    },
    {
        title: "Cookies and Tracking Technologies",
        number: '7',
        desc: [

            {
                info: "We use cookies and similar technologies to enhance your experience on our platform, analyze usage patterns, and deliver personalized content. You can manage your cookie preferences through your browser settings."
            },

        ]
    },
    {
        title: "Changes to This Policy",
        number: '8',
        desc: [

            {
                info: 'We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the updated policy on our website and updating the "Last Updated" date.'
            },

        ]
    },
    {
        title: "Contact Us",
        number: '9',
        desc: [

            {
                info: 'If you have any questions or concerns about this Privacy Policy, please contact us via our contact handles or on our live support.'
            },

        ]
    },
]

export const termsOfUse = [
    {
        title: ' Acceptance of Terms',
        number: '1',
        desc: [
            {
                info: "By accessing or using Pinerock Credit Union's website and services, you agree to comply with and be bound by these Terms of Use. If you do not agree to these terms, please do not use our services."
            }
        ]
    },
    {
        title: ' Account Creation and Use',
        number: '2',
        desc: [
            {
                info: `<span style="font-weight:bold;">Eligibility:</span>  By accessing or using Pinerock Credit Union's website and services, you agree to comply with and be bound by these Terms of Use. If you do not agree to these terms, please do not use our services.`
            },
            {
                info: `<span style="font-weight:bold;">Account Security:</span>  You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.`
            },
            {
                info: `<span style="font-weight:bold;">Accurate Information: </span>  You agree to provide accurate and up-to-date information when creating your account and using our services.`
            }
        ]
    },
    {
        title: ' Services Provided',
        number: '3',
        desc: [
            {
                info: "Pinerock Credit Union offers a range of financial services, including savings accounts, money transfers, transaction processing, and goal-based savings features. The specific services available to you may vary based on your location and account type."
            }
        ]
    },
    {
        title: ' Fees and Charges',
        number: '4',
        desc: [
            {
                info: "Pinerock Credit Union offers a range of financial services, including savings accounts, money transfers, transaction processing, and goal-based savings features. The specific services available to you may vary based on your location and account type."
            }
        ]
    },
    {
        title: ' User Conduct',
        number: '5',
        desc: [
            {
                info: 'Do not use our services for illegal or fraudulent purposes.'

            },
            {
                info: "Do not Attempt to gain unauthorized access to our systems or another user's account.",
            },
            {
                info: "Do not Violate any applicable laws, regulations, or third-party rights.",
            },
            {
                info: "Do not Engage in any activity that could harm, disrupt, or interfere with our services or the experience of other users."
            }
        ]
    },
    {
        title: 'Termination and Suspension',
        number: '6',
        desc: [
            {
                info: "We reserve the right to suspend or terminate your account if you violate these Terms of Use, engage in fraudulent or illegal activities, or fail to comply with our policies. You may also close your account at any time by contacting our customer support team."
            }
        ]
    },
    {
        title: 'Limitation of Liability',
        number: '7',
        desc: [
            {
                info: "Greenfiord Bank shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of our services, including but not limited to financial losses, unauthorized access, or system failures."
            }
        ]
    },
    {
        title: 'Dispute Resolution',
        number: '8',
        desc: [
            {
                info: "Any disputes arising from or related to these Terms of Use or your use of our services shall be resolved through binding arbitration in accordance with the rules of the court of Arbitration."
            }
        ]
    },
    {
        title: 'Intellectual Property',
        number: '9',
        desc: [
            {
                info: "All content, trademarks, and intellectual property on our website and within our services are the property of Pinerock Credit Union or its licensors. You may not use, copy, or distribute any of our intellectual property without our prior written consent."
            }
        ]
    },
    {
        title: 'Changes to These Terms',
        number: '10',
        desc: [
            {
                info: `We may update these Terms of Use from time to time. We will notify you of any significant changes by posting the updated terms on our website and updating the "Last Updated" date.`
            }
        ]
    },
    {
        title: 'Governing Law',
        number: '11',
        desc: [
            {
                info: `These Terms of Use shall be governed by and construed in accordance with the laws of Jurisdiction, without regard to its conflict of law principles.`
            }
        ]
    },
    {
        title: 'Contact Information',
        number: '12',
        desc: [
            {
                info: `If you have any questions or concerns about this Privacy Policy, please contact us via our contact handles or on our live support.`
            }
        ]
    },
]