import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddClientComponent } from './add-client/add-client.component';
import { ViewClientComponent } from './view-client/view-client.component';
import { EditClientComponent } from './edit-client/edit-client.component';
import { AddMeetingComponent } from './add-meeting/add-meeting.component';
import { ViewMeetingComponent } from './view-meeting/view-meeting.component';
import { EditMeetingComponent } from './edit-meeting/edit-meeting.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';  // Import ReactiveFormsModule
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';


//Path to the respective component page
const routes: Routes = [
  //{path:'', redirectTo:'/viewClient',pathMatch:'full'},
  { path: '', component: AddClientComponent }, //This make the registration page to home page
  { path: 'viewClient', component: ViewClientComponent },
  { path: 'addClient', component: AddClientComponent },
  { path: 'editClient/:id', component: EditClientComponent },

  { path: 'viewMeeting', component: ViewMeetingComponent },
  { path: 'addMeetings', component: AddMeetingComponent },
  { path: 'editMeetings/:id', component: EditMeetingComponent },

];

@NgModule({
  declarations: [
    AppComponent,
    AddClientComponent,
    ViewClientComponent,
    EditClientComponent,
    AddMeetingComponent,
    ViewMeetingComponent,
    EditMeetingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()) // Configure fetch API here
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
