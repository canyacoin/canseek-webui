export let Store = {
    currency: {
      AUD: {
        symbol: 'A$',
        name: 'AUD',
        string: 'A$ AUD',
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
    },
    exchangeRate: {},
    curUser: '',
    postForm: [{
      label: 'Job Information Preview',
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
          field: 'job_range'
        }, {
          label: 'Attachments',
          field: 'job_attachments'
        }, {
          label: 'Experience Level',
          field: 'job_level'
        }, {
          label: 'Screening Questions',
          field: 'screening_questions'
        }]
      },{
        label: 'Company Information Preview',
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
        label: 'Reward Information Preview',
        value: [{
          label: 'Admission Fee',
          field: 'reward'
        }, {
          label: 'Application Fee',
          field: 'cost'
        }]
      },{
        label: 'Your Information Preview',
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
    ]
};