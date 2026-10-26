import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EventService, EventItem } from './event.service';
import { RegisterFormComponent } from './register-form.component';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [DatePipe, RouterLink, RegisterFormComponent],
  template: `
    <div class="container">
      <a routerLink="/" class="back">← Back to events</a>

      @if (loading()) {
        <p class="center">Loading event...</p>
      } @else if (error()) {
        <div class="alert error">⚠️ {{ error() }}</div>
      } @else if (event(); as e) {
        <div class="detail">
          <div class="detail-top">{{ e.emoji }}</div>
          <div class="detail-body">
            <span class="tag">{{ e.category }}</span>
            <h1>{{ e.name }}</h1>
            <p class="meta">📅 {{ e.date | date: 'fullDate' }}</p>
            <p class="meta">📍 {{ e.location }}</p>
            <p class="meta">👥 {{ count() }} people registered</p>
            <p class="desc">{{ e.description }}</p>
            <hr />
            <h3>Register for this event</h3>
            <app-register-form [eventId]="e.id" (registered)="loadCount(e.id)" />
          </div>
        </div>
      }
    </div>
  `
})
export class EventDetailComponent implements OnInit {
  private svc = inject(EventService);
  private route = inject(ActivatedRoute);

  event = signal<EventItem | null>(null);
  count = signal(0);
  loading = signal(true);
  error = signal('');

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.svc.getEvent(id).subscribe({
      next: (e) => { this.event.set(e); this.loading.set(false); },
      error: (err) => { this.error.set(this.svc.errMsg(err)); this.loading.set(false); }
    });
    this.loadCount(id);
  }

  loadCount(id: number) {
    this.svc.getRegistrations(id).subscribe({ next: (r) => this.count.set(r.length), error: () => {} });
  }
}
