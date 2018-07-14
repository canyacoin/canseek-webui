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
import { PagenotfoundComponent } from './pages/pagenotfound/pagenotfound.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  // type = new
  { path: 'post/:type', component: PostComponent },
  { path: 'post/detail/:id', component: PostDetailComponent },
  // type = edit
  { path: 'post/:type/:id', component: PostComponent },
  { path: 'status/:type/:id', component: StatusComponent },
  { path: 'refer/new/:id', component: ReferComponent },
  { path: 'refer/detail/:pid/:cid', component: ReferDetailComponent },
  { path: 'applicants/:id', component: ApplicantsComponent },
  { path: 'faq', component: FaqComponent },
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
