import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { PostComponent } from './pages/post/post.component';
import { PostDetailComponent } from './pages/post-detail/post-detail.component';
import { StatusComponent } from './pages/status/status.component';
import { ReferComponent } from './pages/refer/refer.component';
import { ReferDetailComponent } from './pages/refer-detail/refer-detail.component';
import { ApplicantsComponent } from './pages/applicants/applicants.component';
import { FaqComponent } from './pages/faq/faq.component';
import { BuycanComponent } from './pages/buycan/buycan.component';
import { PagenotfoundComponent } from './pages/pagenotfound/pagenotfound.component';
import { NoauthComponent } from './pages/noauth/noauth.component';
import { CmpNotifyComponent } from './components/cmp-notify/cmp-notify.component';
import { CmpExchangeComponent } from './components/cmp-exchange/cmp-exchange.component';
import { CmpNotifyDetailComponent } from './components/cmp-notify-detail/cmp-notify-detail.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'buycan', component: BuycanComponent },
  // params: {type: ['new', 'edit'], id}
  { path: 'post', component: PostComponent },
  { path: 'post/detail/:id', component: PostDetailComponent },
  { path: 'status', component: StatusComponent },
  { path: 'refer/new/:id', component: ReferComponent },
  { path: 'refer/detail/:pid/:cid', component: ReferDetailComponent },
  { path: 'applicants/:id', component: ApplicantsComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'exchange', component: CmpExchangeComponent },
  { path: 'noauth', component: NoauthComponent },
  { path: 'notifications', component: CmpNotifyComponent },
  { path: 'notifications/:id', component: CmpNotifyDetailComponent },
  { path: 'index.html', component: HomeComponent },
  { path: '**', component: PagenotfoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: false })
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
