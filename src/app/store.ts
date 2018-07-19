export let Store = {
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
    },
    selectedCurrency: {},

    curUser: '',
    balance: 0,
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
    ],
    referForm: [{
      label: 'Your Information',
      value: [{
        label: 'Your Name',
        field: 'your_name'
      }, {
        label: 'Your E-mail',
        field: 'your_email'
      }, {
        label: 'Your relationship to the Talent',
        field: 'relation'
      }, {
        label: 'Your MetaMask Address',
        field: 'owner_addr'
      }]
    }, {
      label: 'Talent’s Information',
      value: [{
        label: 'Talent’s Name',
        field: 'candidate_name'
      }, {
        label: 'Talent’s Phone',
        field: 'candidate_phone'
      }, {
        label: 'Talent’s Email',
        field: 'candidate_email'
      }, {
        label: 'Talent’s Website',
        field: 'candidate_website'
      }, {
        label: 'Talent’s LinkedIn',
        field: 'candidate_linkedin'
      }]
    }, {
      label: 'Application Information',
      value: [{
        label: 'CV/Resume',
        field: 'resume'
      }, {
        label: 'Referring Reasons',
        field: 'reason'
      }, {
        label: 'Screening Questions',
        field: 'answers'
      }, {
        label: 'Cover Letter',
        field: 'cover_letter'
      },]
    }]
};