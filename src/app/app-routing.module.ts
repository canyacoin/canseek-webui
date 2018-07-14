import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { PostComponent } from './pages/post/post.component';
import { PostDetailComponent } from './pages/post-detail/post-detail.component';
import { StatusComponent } from './pages/status/status.component';
import { ReferComponent } from './pages/refer/refer.component';
import { ApplicationComponent } from './pages/application/application.component';
import { ApplicantsComponent } from './pages/applicants/applicants.component';
import { FaqComponent } from './pages/faq/faq.component';
import { PagenotfoundComponent } from './pages/pagenotfound/pagenotfound.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'post/new', component: PostComponent },
  { path: 'post/detail/:id', component: PostDetailComponent },
  { path: 'post/edit/:id', component: PostComponent },
  { path: 'status/:type/:id', component: StatusComponent },
  { path: 'refer/new/:id', component: ReferComponent },
  { path: 'application/:id', component: ApplicationComponent },
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
