import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormGroupDirective, NgForm, ValidationErrors} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, CommonModule, MatIconModule, MatButtonModule, MatRadioModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {

  isRegister=false;

  roleValidator(control: FormControl): ValidationErrors | null {
    const validRoles = ['ADMIN', 'CUSTOMER'];
    if (!validRoles.includes(control.value)) {
      return { invalidRole: true };
    }
    return null;
  }

  
  formLogin = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  })

  formRegistration = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(5)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    role: new FormControl('CUSTOMER', [Validators.required, this.roleValidator]),
  })

  handleRegister(){
    console.log("register", this.formRegistration.value)
  }

  handleLogin(){
    console.log("register", this.formLogin.value)
  }




}
