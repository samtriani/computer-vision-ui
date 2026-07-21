import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  enviando = signal(false);
  error = signal<string | null>(null);

  entrar(username: string, password: string) {
    this.form.setValue({ username, password });
    this.submit();
  }

  submit() {
    if (this.form.invalid || this.enviando()) {
      return;
    }
    this.enviando.set(true);
    this.error.set(null);
    const { username, password } = this.form.getRawValue();

    this.authService.login(username, password).subscribe({
      next: () => {
        this.enviando.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.enviando.set(false);
        this.error.set('Usuario o contraseña incorrectos.');
      },
    });
  }
}
