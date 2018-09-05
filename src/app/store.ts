import { Authstate } from '@class/authstate';

export let Store = {
    authState: new Authstate,
    profile: {},
    salary_cycles: ['/ Annum', '/ Month', '/ Week', '/ Day', '/ Hour'],
    currencyArr: ['$ AUD', '$ USD', '€ EUR', 'CAN'],
    currency: {
      AUD: {
        symbol: '$',
        name: 'AUD',
        string: '$ AUD',
        value: 0
      },
      USD: {
        symbol: '$',
        name: 'USD',
        string: '$ USD',
        value: 0
      },
      EUR: {
        symbol: '€',
        name: 'EUR',
        string: '€ EUR',
        value: 0
      },
      CAN: {
        symbol: '',
        name: 'CAN',
        string: 'CAN',
        value: 0
      },
    },
    selectedCurrency: {},

    curUser: '',
    curNet: '',
    balance: 0,
    postForm: [{
      label: 'Job Information',
      value: [{
          label: 'Job Title',
          field: 'job_title'
        }, {
          label: 'Job Description',
          field: 'job_desc'
        }, {
          label: 'Job Location',
          field: 'job_location'
        }, {
          label: 'Position Type',
          field: 'job_type'
        }, {
          label: 'Allow Remote Working',
          field: 'job_remote'
        }, {
          label: 'Salary Range',
          field: 'salary_range'
        }, {
          label: 'Attachments',
          field: 'job_attachments'
        }, {
          label: 'Experience Level',
          field: 'job_level'
        }, {
          label: 'Screening Questions',
          field: 'screening_questions'
        }, {
          label: 'Screening Questions',
          field: 'screening_questions2'
        }, {
          label: 'Screening Questions',
          field: 'screening_questions3'
        }]
      },{
        label: 'Company Information',
        value:  [{
          label: 'Company Logo',
          field: 'company_logo'
        }, {
          label: 'Company Name',
          field: 'company_name'
        }, {
          label: 'Company Website',
          field: 'company_website'
        }, {
          label: 'Company Description',
          field: 'company_desc'
        }]
      },{
        label: 'Reward Information',
        value: [{
          label: 'Initial Reward',
          field: 'reward_string'
        }, {
          label: 'Talent Application Fee',
          field: 'cost_string'
        }]
      },{
        label: 'Your Information',
        value: [{
          label: 'Your Name',
          field: 'your_name'
        }, {
          label: 'Your Company Email',
          field: 'your_email'
        }, {
          label: 'Your MetaMask Address',
          field: 'owner_addr'
        }]
      }
    ],
    referForm: [{
      label: 'Your contact details',
      value: [{
        label: 'Name',
        field: 'your_name'
      }, {
        label: 'Email',
        field: 'your_email'
      }, {
        label: 'Your relationship to the Talent',
        field: 'relation'
      }, {
        label: 'Your MetaMask Address',
        field: 'owner_addr'
      }]
    }, {
      label: 'Talent Contact Details',
      value: [{
        label: 'Contact Name',
        field: 'candidate_name'
      // }, {
      //   label: 'Talent’s Phone',
      //   field: 'candidate_phone'
      }, {
        label: 'Contact Phone or Email',
        field: 'candidate_email'
      }, {
        label: 'Website',
        field: 'candidate_website'
      }, {
        label: 'LinkedIn Profile',
        field: 'candidate_linkedin'
      }]
    }, {
      label: 'Application',
      value: [{
        label: 'CV/Resume',
        field: 'resume'
      }, {
        label: 'Referring Reasons',
        field: 'reason'
      }, {
        label: 'Screening Question 1',
        field: 'answers'
      }, {
        label: 'Screening Question 2',
        field: 'answers2'
      }, {
        label: 'Screening Question 3',
        field: 'answers3'
      }, {
        label: 'Cover Letter',
        field: 'cover_letter'
      },]
    }]
};