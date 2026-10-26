import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="nav">
      <a routerLink="/" class="brand">🎉 EventHub</a>
      <div class="links">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
        <a routerLink="/add" routerLinkActive="active">Add Event</a>
      </div>
    </nav>
    <router-outlet />
    <footer class="footer">© 2026 EventHub · College Event Management System</footer>
  `
})
export class AppComponent {}
