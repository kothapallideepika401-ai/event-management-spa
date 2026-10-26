import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { AddEventComponent } from './add-event.component';
import { EventDetailComponent } from './event-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'add', component: AddEventComponent },
  { path: 'event/:id', component: EventDetailComponent },
  { path: '**', redirectTo: '' }
];
