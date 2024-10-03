import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormGroupDirective, NgForm, ValidationErrors} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, CommonModule, MatIconModule, MatButtonModule, MatRadioModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {

  isRegister=true;

  constructor (public authService: AuthService){}

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
    console.log("register: ", this.formRegistration.value)
    this.authService.register(this.formRegistration.value).subscribe({
      next:(response)=>{
        localStorage.setItem("jwt", response.token);
        this.authService.getUserProfile().subscribe();
        console.log("register user success", response)

      }
    })
  }

  handleLogin(){
    console.log("login: ", this.formLogin.value)
    this.authService.login(this.formLogin.value).subscribe({
      next:(response)=>{
        console.log("response: ", response)
        localStorage.setItem("jwt", response.token);
        this.authService.getUserProfile().subscribe();
        console.log("login success", response)

      }
    })
  }

  togglePanel(){
    this.isRegister=!this.isRegister
  }


}
