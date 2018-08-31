import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.less']
})

export class FaqComponent implements OnInit {

  customStyle = {
    'background'   : '#f7f7f7',
    'border-radius': '4px',
    'margin-bottom': '24px',
    'border'       : '0px'
  };
  searchText: string = null;

  constructor() { }

  ngOnInit() {
  }

  panels = [{
      active     : true,
      disabled   : false,
      name       : 'Why do I have to use a MetaMask address?',
      content    : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ',
    }, {
      active     : false,
      disabled   : true,
      name       : 'What if I forget my MetaMask address or login in on a different device?',
      content    : 'We’ve got lots of a great things to say here. Watch this space and we’ll let you now what you need to know…',
    }, {
      active     : false,
      disabled   : false,
      name       : 'Why does my job post say “pending”?',
      content: 'We’ve got lots of a great things to say here. Watch this space and we’ll let you now what you need to know…',
    }, {
      active     : false,
      disabled   : false,
      name       : 'How do I cancel a post?',
      content: 'We’ve got lots of a great things to say here. Watch this space and we’ll let you now what you need to know…',
    }, {
      active     : false,
      disabled   : false,
      name       : 'How do I mark a job post complete to confirm the position has been filled?',
      content: 'We’ve got lots of a great things to say here. Watch this space and we’ll let you now what you need to know…',
    }, {
      active     : false,
      disabled   : false,
      name       : 'Where is my contribution fees paid to?',
      content: 'We’ve got lots of a great things to say here. Watch this space and we’ll let you now what you need to know…',
    }, {
      active     : false,
      disabled   : false,
      name       : 'Who pays the Application and Admission fees?',
      content: `To post a job on CanSeek you set the minimum reward that the successful talent hunter will recieve. 
      This contribution is called the Admission Fee. 
      This reward acts as an incentive for talent hunters to refer potential talent for your job. 
      To refer talent to your Job, the talent hunters contribute the Application fee. 
      This buy-in stops spam and ensures that you get only high quality applicants. 
      These contributions raise the overall value of the reward to the successful talent hunter.
      The talent hunter who has referred the winning applicant, receives the entire reward.`,
    }
  ];

  onSearch() {
    this.panels = this.panels.filter(p => p.name.indexOf(this.searchText) != -1)
  }
}
