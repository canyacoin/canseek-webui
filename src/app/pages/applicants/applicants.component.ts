import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-applicants',
  templateUrl: './applicants.component.html',
  styleUrls: ['./applicants.component.less']
})
export class ApplicantsComponent implements OnInit {
  radioValue='A';

  panels = [
    {
      active     : true,
      disabled   : false,
      name       : 'This is panel header 1',
      customStyle: {
        'background'   : '#f7f7f7',
        'border-radius': '4px',
        'margin-bottom': '24px',
        'border'       : '0px'
      }
    },
    {
      active     : false,
      disabled   : true,
      name       : 'This is panel header 2',
      customStyle: {
        'background'   : '#f7f7f7',
        'border-radius': '4px',
        'margin-bottom': '24px',
        'border'       : '0px'
      }
    },
    {
      active     : false,
      disabled   : false,
      name       : 'This is panel header 3',
      customStyle: {
        'background'   : '#f7f7f7',
        'border-radius': '4px',
        'margin-bottom': '24px',
        'border'       : '0px'
      }
    }
  ];
  
  constructor() { }

  ngOnInit() {
  }

}
