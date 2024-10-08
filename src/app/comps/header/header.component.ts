import { Component } from '@angular/core';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { AuthService } from '../../services/auth/auth.service';
import {MatMenuModule} from '@angular/material/menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatSlideToggleModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  userName:any=null;

  constructor (public authService:AuthService, private router:Router){}
  ngOnInit(): void {    
    if (typeof window !== 'undefined') {
      this.authService.getUserProfile().subscribe(
        (auth)=>{
          this.userName = auth.name
        }
      );
    }
    
  }


  handleLogOut(){
    this.authService.logout()
    this.router.navigate(['/'])
  }

}
