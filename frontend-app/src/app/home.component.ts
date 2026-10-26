import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventService, EventItem, Registration } from './event.service';
import { RegisterFormComponent } from './register-form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DatePipe, RouterLink, RegisterFormComponent],
  template: `
    <section class="hero">
      <h1>Discover Amazing Events</h1>
      <p>Welcome to EventHub! Find, join and organise technical, cultural, workshop and sports events happening in your college.</p>
      <button class="btn light" (click)="scrollToEvents()">Explore Events</button>
    </section>

    <div class="stats">
      <div class="stat"><b>{{ events().length }}</b>Available Events</div>
      <div class="stat"><b>{{ registrations().length }}</b>Total Registrations</div>
    </div>

    <div class="container" id="events">
      <h2>Upcoming Events</h2>

      <div class="toolbar">
        <input class="search" type="text" placeholder="🔍 Search events by name..."
               [value]="search()" (input)="search.set($any($event.target).value)" />
      </div>
      <div class="chips">
        @for (c of categories; track c) {
          <button class="chip" [class.on]="category() === c" (click)="category.set(c)">{{ c }}</button>
        }
      </div>

      @if (message()) { <div class="alert success">✅ {{ message() }}</div> }
      @if (error()) { <div class="alert error">⚠️ {{ error() }}</div> }

      @if (loading()) {
        <p class="center">Loading events...</p>
      } @else if (filtered().length === 0 && !error()) {
        <p class="center">😕 No events found. Try another search or category.</p>
      } @else {
        <div class="grid">
          @for (e of filtered(); track e.id) {
            <div class="card">
              <div class="card-top">{{ e.emoji }}</div>
              <div class="card-body">
                <span class="tag">{{ e.category }}</span>
                <h3>{{ e.name }}</h3>
                <p class="meta">📅 {{ e.date | date: 'mediumDate' }}</p>
                <p class="meta">📍 {{ e.location }}</p>
                <p class="desc">{{ e.description }}</p>
                <p class="meta">👥 {{ regCount(e.id) }} registered</p>
              </div>
              <div class="card-actions">
                <a class="btn small" [routerLink]="['/event', e.id]">Details</a>
                <button class="btn small" (click)="selected.set(e)">Register</button>
                <button class="btn small danger" (click)="remove(e)">Delete</button>
              </div>
            </div>
          }
        </div>
      }
    </div>

    @if (selected(); as ev) {
      <div class="overlay" (click)="selected.set(null)">
        <div class="modal" (click)="$event.stopPropagation()">
          <button class="close" (click)="selected.set(null)">✖</button>
          <h2>{{ ev.emoji }} Register: {{ ev.name }}</h2>
          <app-register-form [eventId]="ev.id" (registered)="refreshRegistrations()" />
        </div>
      </div>
    }
  `
})
export class HomeComponent implements OnInit {
  private svc = inject(EventService);

  categories = ['All', 'Technical', 'Cultural', 'Workshop', 'Sports'];
  events = signal<EventItem[]>([]);
  registrations = signal<Registration[]>([]);
  search = signal('');
  category = signal('All');
  loading = signal(true);
  error = signal('');
  message = signal('');
  selected = signal<EventItem | null>(null);

  filtered = computed(() => {
    const q = this.search().toLowerCase().trim();
    return this.events().filter(
      (e) => (this.category() === 'All' || e.category === this.category()) && e.name.toLowerCase().includes(q)
    );
  });

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.error.set('');
    this.svc.getEvents().subscribe({
      next: (d) => { this.events.set(d); this.loading.set(false); },
      error: (err) => { this.error.set(this.svc.errMsg(err)); this.loading.set(false); }
    });
    this.refreshRegistrations();
  }

  refreshRegistrations() {
    this.svc.getRegistrations().subscribe({ next: (r) => this.registrations.set(r), error: () => {} });
  }

  regCount(id: number) { return this.registrations().filter((r) => r.eventId === id).length; }

  remove(e: EventItem) {
    if (!confirm('Delete "' + e.name + '"?')) return;
    this.svc.deleteEvent(e.id).subscribe({
      next: () => { this.message.set('Event deleted successfully.'); this.load(); },
      error: (err) => this.error.set(this.svc.errMsg(err))
    });
  }

  scrollToEvents() {
    document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
  }
}
