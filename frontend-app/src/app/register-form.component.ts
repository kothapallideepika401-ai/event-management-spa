import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventService } from './event.service';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
      <div class="field">
        <label>Full Name</label>
        <input formControlName="name" placeholder="Your name" />
        @if (f.name.touched && f.name.invalid) { <small class="err">Name is required (min 2 characters)</small> }
      </div>
      <div class="field">
        <label>Email</label>
        <input formControlName="email" type="email" placeholder="you@example.com" />
        @if (f.email.touched && f.email.invalid) { <small class="err">Enter a valid email address</small> }
      </div>
      <div class="field">
        <label>Phone Number</label>
        <input formControlName="phone" placeholder="10-digit number" />
        @if (f.phone.touched && f.phone.invalid) { <small class="err">Phone must be exactly 10 digits</small> }
      </div>
      <button class="btn" type="submit" [disabled]="loading()">{{ loading() ? 'Registering...' : 'Register Now' }}</button>
    </form>
    @if (success()) { <div class="alert success">✅ {{ success() }}</div> }
    @if (error()) { <div class="alert error">⚠️ {{ error() }}</div> }
  `
})
export class RegisterFormComponent {
  @Input({ required: true }) eventId!: number;
  @Output() registered = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private svc = inject(EventService);

  loading = signal(false);
  success = signal('');
  error = signal('');

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
  });

  get f() { return this.form.controls; }

  submit() {
    this.success.set('');
    this.error.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.svc.register({ eventId: this.eventId, ...this.form.getRawValue() }).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set('Registration successful! See you at the event.');
        this.form.reset();
        this.registered.emit();
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(this.svc.errMsg(err));
      }
    });
  }
}
