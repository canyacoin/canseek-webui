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
    'padding'      : '8px 8px 0 8px',
    'border'       : '0px',
  };
  searchText: string = null;
  panels = [{
      active     : true,
      name       : 'What is CanSeek?',
      content    : `CANSeek is a recruitment tool that incentivises the best candidates be put forward for a advertised position.
      Our platform allows a company to post a job vacancy and set a reward in $CAN to attract quality applications. Recruiters,
      talent hunters (or anyone for that matter) can refer an applicant to be considered by paying a small fee (a stake)
      which contributes to the size of the total reward paid out to the successful candidate.`,
    }, {
      name       : 'How do I post a job?',
      content    : `Simply connect your MetaMask and select \'Post a Job\' at CanSeek.io .
      After verifying your email address,
      The next few screens will allow you to describe the position and candidate you\'re looking for,
      set the reward and application fees, post the job and pay your company\'s contribution to the reward pool.`,
    }, {
      name       : 'How do I refer talent?',
      content    : `Select \'refer talent\' on the job you\'d like to refer a candidate for.
      The next few screens will allow you to share the talent\'s contact details,
      describe why you think they\'d be a great candidate for the advertised position,
      and pay the talent application fee.`
    }, {
      name       : 'Why do I have to use CAN?',
      content    : `CAN token is the native token of the CanYa Ecosystem.
      All transactions on CanSeek and the CanYa ecosystem are done in CAN tokens power our payment system,
      and allows us to keep our fees low.
      We are focused on providing utility to the token which will in turn help the health of our token
      and provides incentive for users to hold CAN tokens as our platform continues to develop.`,
    }, {
      name       : 'Can I use Bitcoin (BTC)?',
      content    : 'Not yet. We will be working to handle BTC payments in the future.',
    }, {
      name       : 'Why do I have to verify my email?',
      content    : `To ensure the validity of the advertised position,
      we require that you verify a company email domain.
      This means the domain of the email you use to sign in must match the company website domain of the job being posted.
      If you want to add another company or domain, you can verify additional company email addresses in your account.`,
    }, {
      name       : 'Why do I have to use a MetaMask address?',
      content    : 'We’ve got lots of a great things to say here. Watch this space and we’ll let you now what you need to know…', // TODO
    }, {
      name       : 'What if I forget my MetaMask address or login in on a different device?',
      content    : 'We’ve got lots of a great things to say here. Watch this space and we’ll let you now what you need to know…', // TODO
    }, {
      name       : 'Why does my job post say “pending”?',
      content    : 'Check your MetaMask notifications to review',
    }, {
      name       : 'How do I cancel a post?',
      content    : `To cancel a post,
      select \'My Posts\' on the homepage menu and select \'Cancel\' from the drop down
      on the bottom right of the job post that you\'d like to cancel.
      Use the CanPay module to confirm the cancellation,
      releasing your company\'s contribution to the reward back to the MetaMask address it was sent from.
      CanSeek retains a 1% fee on the initial reward paid by the job poster in this transaction.`,
    }, {
      name       : 'How do I review candidates that have been referred to my job post?',
      content    : `To review the list of candidates,
      select \'My Posts\' on the homepage menu and \'Review Candidates\' from the drop down
      on the bottom right of the job post that you\'d like to review.
      From this screen, you can view the candidates full application, and shortlist or reject them for easier candidate management.`,
    }, {
      name       : 'How do I mark a job post complete to confirm the position has been filled?',
      content    : `On the \'Review Candidates\' screen, select the successful candidate from your shortlist and click \'Hire\'.
      Use the CanPay module to confirm the hire and release the total reward to the successful candidate\'s MetaMask address.
      CanSeek retains a 1% fee on the initial reward paid by the job poster in this transaction.`,
    }, {
      name       : 'Who pays the Reward and Application Fees?',
      content    : `The job poster pays the reward fee.
      When you post a job on CanSeek you set the minimum reward that the successful talent hunter will receive.
      This amount is called the Initial Reward. This is your Company’s contribution to the reward pool,
      paid to the successful talent, and acts as an incentive for talent hunters to refer high quality candidates to your job.
      <br>
      The talent hunters pay the application fee.
      When you refer talent to an advertised position, you contribute an Application fee. This amount that has been set by the job poster.
  Each Application fee is added to the total reward pool, incentivising quality referrals and reducing spam applications.
      <br>
      If your referred talent is the successful candidate,
      you will be paid out the total reward, which includes the Company's initial reward
      and all talent application fees made by referrers, including your own.
      <br>
      If the job post is cancelled, both the initial reward and application fees will be refunded to the relevant parties.
      <br>
      If your candidate is not successful, your application fee will be paid to the successful candidate or talent hunter.`,
    }, {
      name       : 'Can I refer myself for a job?',
      content    : `Yes! Select \'Refer Talent,
      enter your contact details and make sure to select \'I am the talent\' to let the job poster know.`,
    }, {
      name       : 'What does it cost to use CanSeek?',
      content    : `CanSeek retains a 1% fee on the initial reward paid by the job poster.
      This fee is sent when the job post is completed (a successful candidate is hired) or cancelled.`,
    }
  ];
  constructor() { }

  ngOnInit() {
  }

  onSearch() {
    const v = this.searchText;
    this.panels = this.panels.filter(p => p.name.indexOf(v) !== -1);
  }
}
