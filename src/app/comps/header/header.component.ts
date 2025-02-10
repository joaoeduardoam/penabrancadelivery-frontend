import { Component } from '@angular/core';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { AuthService } from '../../services/auth/auth.service';
import {MatMenuModule} from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart/cart.service';

import {MatBadgeModule} from '@angular/material/badge';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatSlideToggleModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatBadgeModule, RouterModule ], 
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor (public authService:AuthService, private router:Router, private cartService:CartService){}

  userName:any=null;

  numberItemsInCart = 0;

  private subscription: Subscription;


  ngOnInit(): void {    
    if (typeof window !== 'undefined') {

      this.authService.getUserProfile().subscribe(
        (auth)=>{
          this.userName = auth.name
        }
      );

      this.listenToCart();

    }
    
  }

  // goToShopCart() {
  //   console.log("goToShopCart()");
  //   this.router.navigate(['/shop-cart']);
  // }


  ngOnDestroy() {
    if (this.subscription) {
        this.subscription.unsubscribe();
    }
  }

  listenToCart() {
    this.subscription = this.cartService.addedToCart.subscribe({
        next: (productsInCart) => {
            // Check if it is an array
            if (!Array.isArray(productsInCart)) {
                console.error('Invalid data received');
                return;
            }

            // Uses the optional chaining operator (?) and nullish coalescing (||)
            this.numberItemsInCart = productsInCart.reduce((acc, product) => {
                return acc + (product?.quantity || 0);
            }, 0);
        },
        error: (error) => {
          console.error('Error updating cart:', error);
      }
    });
}


  handleLogOut(){
    this.authService.logout()
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }

}
