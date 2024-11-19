import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggingService } from '../services/logging.service';
import { BooksService } from '../services/books.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
   
  loginForm: FormGroup;

  constructor(private fb: FormBuilder,private router: Router, private route: ActivatedRoute, private logger: LoggingService,private bookService:BooksService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  onSubmit() {
    debugger
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.bookService.login(email, password).subscribe({
        next: (response) => {
          localStorage.setItem('authToken', response.accessToken); // Save the token
          this.router.navigate(['/books']); // Redirect to dashboard
        },
        error: (err) => {
          alert('Invalid email or password');
          console.error(err);
        },
      });
    }
    
  }
  register(){
    this.router.navigate(['/register']);
  }
}
