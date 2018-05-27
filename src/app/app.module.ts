import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgClass } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './auth.guard';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
// import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { environment } from '../environments/environment';

import { TopComponent } from './top/top.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';
import { PostcardComponent } from './postcard/postcard.component';
import { RecommendComponent } from './recommend/recommend.component';
import { AddPostComponent } from './add-post/add-post.component';

import {ContractsService} from './services/contracts/contracts.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CardsComponent } from './components/cards/cards.component';
import { CandidatesComponent } from './components/candidates/candidates.component';
import { CardService } from './components/service/card.service';
import { CardModalComponent } from './components/card-modal/card-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    TopComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    PageNotFoundComponent,
    PostcardComponent,
    RecommendComponent,
    AddPostComponent,
    CardsComponent,
    CandidatesComponent,
    CardModalComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase), // imports firebase/app needed for everything
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    // AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    AngularFirestoreModule.enablePersistence(), // imports firebase/firestore, only needed for database features
    NgbModule.forRoot()
  ],
  providers: [AuthGuard, DatePipe, ContractsService, CardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
