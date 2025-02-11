import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./comps/header/header.component";
import { FooterComponent } from "./comps/footer/footer.component";
import { HomeComponent } from "./comps/home/home.component";
import { AuthComponent } from "./comps/auth/auth.component";
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, HomeComponent, AuthComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'penabrancadelivery-frontend';

  user:any=null;

  constructor (public authService:AuthService){}
  ngOnInit(): void {    
    if (typeof window !== 'undefined') {
      this.authService.getUserProfile().subscribe(
        (auth)=>{
          this.user = auth.email
        }
      );
    }
    console.log("AppComponent - ngOnInit() - this.user: "+ this.user)
    
  }


}
