import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EventItem {
  id: number;
  name: string;
  date: string;
  location: string;
  category: string;
  emoji: string;
  description: string;
}

export interface Registration {
  id: number;
  eventId: number;
  name: string;
  email: string;
  phone: string;
}

@Injectable({ providedIn: 'root' })
export class EventService {
  private http = inject(HttpClient);
  private api = 'http://localhost:3000/api';

  getEvents(): Observable<EventItem[]> {
    return this.http.get<EventItem[]>(`${this.api}/events`);
  }

  getEvent(id: number): Observable<EventItem> {
    return this.http.get<EventItem>(`${this.api}/events/${id}`);
  }

  addEvent(event: Partial<EventItem>): Observable<EventItem> {
    return this.http.post<EventItem>(`${this.api}/events`, event);
  }

  deleteEvent(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/events/${id}`);
  }

  getRegistrations(eventId?: number): Observable<Registration[]> {
    const query = eventId ? `?eventId=${eventId}` : '';
    return this.http.get<Registration[]>(`${this.api}/registrations${query}`);
  }

  register(data: Omit<Registration, 'id'>): Observable<Registration> {
    return this.http.post<Registration>(`${this.api}/registrations`, data);
  }

  // Turns any HTTP error into a readable message
  errMsg(err: any): string {
    return err?.error?.message || 'Cannot reach the server. Is the backend running on port 3000?';
  }
}
