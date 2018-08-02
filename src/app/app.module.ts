import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { AppRoutingModule } from './/app-routing.module';
import { PagenotfoundComponent } from './pages/pagenotfound/pagenotfound.component';
import { HomeComponent } from './pages/home/home.component';
import { CmpHeaderComponent } from './pages/home/components/cmp-header/cmp-header.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { CmpFooterComponent } from './components/cmp-footer/cmp-footer.component';
import { CmpBancorComponent } from './components/cmp-bancor/cmp-bancor.component';
import { PostComponent } from './pages/post/post.component';
import { CmpPoststep1Component } from './pages/post/components/cmp-poststep1/cmp-poststep1.component';
import { PostDetailComponent } from './pages/post-detail/post-detail.component';
import { FaqComponent } from './pages/faq/faq.component';
import { StatusComponent } from './pages/status/status.component';
import { ReferComponent } from './pages/refer/refer.component';
import { CmpReferstep2Component } from './pages/refer/components/cmp-referstep2/cmp-referstep2.component';
import { ApplicantsComponent } from './pages/applicants/applicants.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { environment } from '../environments/environment';

import { ContractsService } from './services/contracts.service';
import { GlobalService } from './services/global.service';
import { ReferDetailComponent } from './pages/refer-detail/refer-detail.component';
import { CmpPostComponent } from './pages/home/components/cmp-post/cmp-post.component';
import { CmpCandidateComponent } from './pages/refer-detail/components/cmp-candidate/cmp-candidate.component';

import { ClipboardModule } from 'ngx-clipboard';
import { CmpBuycanComponent } from './components/cmp-buycan/cmp-buycan.component';
import { NoauthComponent } from './pages/noauth/noauth.component';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    PagenotfoundComponent,
    HomeComponent,
    CmpHeaderComponent,
    HeaderComponent,
    FooterComponent,
    CmpFooterComponent,
    CmpBancorComponent,
    PostComponent,
    CmpPoststep1Component,
    PostDetailComponent,
    FaqComponent,
    StatusComponent,
    ReferComponent,
    CmpReferstep2Component,
    ApplicantsComponent,
    ReferDetailComponent,
    CmpPostComponent,
    CmpCandidateComponent,
    CmpBuycanComponent,
    NoauthComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,

    AngularFireModule.initializeApp(environment.firebase), // imports firebase/app needed for everything
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    AngularFirestoreModule.enablePersistence(), // imports firebase/firestore, only needed for database features
    AngularFireStorageModule,

    ClipboardModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }, ContractsService, GlobalService, GlobalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
