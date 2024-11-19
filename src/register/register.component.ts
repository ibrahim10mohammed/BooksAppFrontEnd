import { Component } from '@angular/core';
import { BooksService } from '../services/books.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private bookService: BooksService,private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Email field with validation
      role: ['', Validators.required], // Role field with validation
      password: ['', [Validators.required, Validators.minLength(6)]], // Password field
      confirmPassword: ['', Validators.required], // Confirm Password field
    });
  }

  onSubmit() {

    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      console.log('Register Data:', formData);
      const userData = { email: formData.email,role:formData.role, password: formData.password };
      // Simulate API call
      this.bookService.register(userData).subscribe(res=>{
        debugger
        if(res){
          this.router.navigate(['/login']); // Redirect to login page
        }
      },err=>{
        console.log(err);
      })
    } else {
      alert('Please fill out all required fields!');
    }
  }
  login(){
    this.router.navigate(['/login']);
  }
}
