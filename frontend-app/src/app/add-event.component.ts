import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EventService } from './event.service';

@Component({
  selector: 'app-add-event',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="container">
      <div class="form-box">
        <h2>➕ Add a New Event</h2>
        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <div class="field">
            <label>Event Name</label>
            <input formControlName="name" placeholder="e.g. Tech Quiz" />
            @if (f.name.touched && f.name.invalid) { <small class="err">Name is required (min 3 characters)</small> }
          </div>
          <div class="field">
            <label>Date</label>
            <input formControlName="date" type="date" />
            @if (f.date.touched && f.date.invalid) { <small class="err">Date is required</small> }
          </div>
          <div class="field">
            <label>Location</label>
            <input formControlName="location" placeholder="e.g. Seminar Hall" />
            @if (f.location.touched && f.location.invalid) { <small class="err">Location is required</small> }
          </div>
          <div class="field">
            <label>Category</label>
            <select formControlName="category">
              <option value="">-- Select category --</option>
              <option>Technical</option>
              <option>Cultural</option>
              <option>Workshop</option>
              <option>Sports</option>
            </select>
            @if (f.category.touched && f.category.invalid) { <small class="err">Please choose a category</small> }
          </div>
          <div class="field">
            <label>Emoji (optional)</label>
            <input formControlName="emoji" placeholder="e.g. 🎯" maxlength="4" />
          </div>
          <div class="field">
            <label>Description</label>
            <textarea formControlName="description" rows="4" placeholder="Describe the event..."></textarea>
            @if (f.description.touched && f.description.invalid) { <small class="err">Description is required (min 10 characters)</small> }
          </div>
          <button class="btn" type="submit" [disabled]="loading()">{{ loading() ? 'Saving...' : 'Add Event' }}</button>
        </form>
        @if (success()) {
          <div class="alert success">✅ Event added successfully! <a routerLink="/"><b>View all events</b></a></div>
        }
        @if (error()) { <div class="alert error">⚠️ {{ error() }}</div> }
      </div>
    </div>
  `
})
export class AddEventComponent {
  private fb = inject(FormBuilder);
  private svc = inject(EventService);

  loading = signal(false);
  success = signal(false);
  error = signal('');

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    date: ['', Validators.required],
    location: ['', Validators.required],
    category: ['', Validators.required],
    emoji: [''],
    description: ['', [Validators.required, Validators.minLength(10)]]
  });

  get f() { return this.form.controls; }

  submit() {
    this.success.set(false);
    this.error.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.svc.addEvent(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
        this.form.reset();
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(this.svc.errMsg(err));
      }
    });
  }
}
