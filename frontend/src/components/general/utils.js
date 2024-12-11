import piggy from '../../assets/santander/piggy-bank.svg'
import loan from '../../assets/santander/hand-holding-money.svg'
import check from '../../assets/santander/check.svg'
import card from '../../assets/santander/card.svg'

export const headers = [
    {
      title: 'Personal',
      types:[
        {
            type:'Checkings',
            subs:[`Checking Overview`, ' Santander Select Checking', 'Simply Right Checking', 'Essential Checking']
        },
        {
            type:'Savings and CDs',
            subs:[`Savings Overview`, ' Santander Select Money Market Savings', 'Santander Money Market Savings', 'Santander Savings','Certificates of Deposits (CDs)']
        },
        {
            type:'Credit Cards',
            subs:[]
        },
        {
            type:'Personal Loans',
            subs:[]
        },
        {
            type:'Investing',
            subs:['Investing Overview', 'Financial Planning']
        },
        {
            type:'Resources',
            subs:[]
        },
        {
            type:'Prosper and Thrive',
            subs:[]
        },
      ]
    },
    {
      title: 'Small Business',
    },
    {
      title: 'Commercial',
    },
    {
      title: 'About Us',
    },
    {
      title: 'Private Client',
    },
  ]



  export const helpers = [
    {
      image:piggy,
      name:'Saving & CDs',
      desc:'that make it convenient to earn more as you save'
    },
    {
      image:check,
      name:'Checking',
      desc:'options for even easier everyday banking'
    },
    {
      image:loan,
      name:'Personal Loans',
      desc:'to help you reach your goals'
    },
    {
      image:card,
      name:'Credit Cards',
      desc:'with a range of benefits and rewards'
    }
  ]