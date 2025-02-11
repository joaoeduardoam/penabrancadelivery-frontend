import { Component, effect, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';
import { AuthService } from '../../services/auth/auth.service';
import { ProductService } from '../../services/product/product.service';
import { CartItem, CartItemAdd } from '../../model/Cart';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  injectMutation,
  injectQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { lastValueFrom, tap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-shop-cart',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './shop-cart.component.html',
  styleUrl: './shop-cart.component.css'
})
export class ShopCartComponent implements OnInit {


  constructor (private productService:ProductService, private authService:AuthService, private cartService:CartService){
    console.log("inicio constructor() - shop-cart");
    this.extractListToUpdate();
    this.checkUserLoggedIn();
    console.log("fim do constructor() - shop-cart");
  }

  private queryClient = inject(QueryClient);
  platformId = inject(PLATFORM_ID);
  user:any=null;
  cart: Array<CartItem> = []
  labelCheckout = 'Faça login para pagamento';  
  action: 'login' | 'checkout' = 'login';


  ngOnInit(): void {
    console.log("inicio ngOnInit() - shop-cart");
    if (typeof window !== 'undefined') {
      this.authService.getUserProfile().pipe(
        tap(auth => this.user = auth.email)
      ).subscribe();
    }
    console.log("ngOnInit() - this.user: "+this.user);
     this.cartService.addedToCart.subscribe((cart) => this.updateQuantity(cart));
     console.log("fim ngOnInit() - shop-cart");
  }

  

  cartQuery = injectQuery(() => ({
    queryKey: ['cart'],
    queryFn: () => lastValueFrom(this.cartService.getCartDetail())
  })  );

  
  private extractListToUpdate() {
    console.log("begin of extractListToUpdate(): ", this.cartQuery.isSuccess());
  
  // Criar o effect e armazenar a referência
  const effectRef = effect(() => {
    try {
      if (this.cartQuery.isSuccess()) {
        const newProducts = this.cartQuery.data().products;
        
        // Validação de dados
        if (!Array.isArray(newProducts)) {
          console.error('Invalid data received');
          return;
        }

        // Comparação antes de atualizar
        if (JSON.stringify(this.cart) !== JSON.stringify(newProducts)) {
          this.cart = newProducts;
          console.log('Cart updated with new products');
        }
      }
    } catch (error) {
      console.error('Error in the effect:', error);
    }
  });

  console.log("end of extractListToUpdate(): ", this.cart);
  
  // Retornar a função de limpeza
  return () => effectRef.destroy();
  }

  private checkUserLoggedIn() {
    effect(() => {
      // const connectedUserQuery = this.oauth2Service.connectedUserQuery;
      // if (connectedUserQuery?.isError()) {
      //   this.labelCheckout = 'Login to checkout';
      //   this.action = 'login';
      // } else if (connectedUserQuery?.isSuccess()) {
      //   this.labelCheckout = 'Checkout';
      //   this.action = 'checkout';
      // }
      if (!this.user) {
        this.labelCheckout = 'Faça login para pagamento';
        this.action = 'login';
      } else {
        this.labelCheckout = 'Pagamento';
        this.action = 'checkout';
      }
    });
    console.log("checkUserLoggedIn(): this.action"+this.action);
  }


  private updateQuantity(cartUpdated: Array<CartItemAdd>) {
    for (const cartItemToUpdate of this.cart) {
      const itemToUpdate = cartUpdated.find(
        (item) => item.id === cartItemToUpdate.id
      );
      if (itemToUpdate) {
        cartItemToUpdate.quantity = itemToUpdate.quantity;
      } else {
        this.cart.splice(this.cart.indexOf(cartItemToUpdate), 1);
      }
    }
  }


  addQuantityToCart(publicId: string) {
    this.cartService.addToCart(publicId, 'add');
  }

  removeQuantityToCart(publicId: string, quantity: number) {
    if (quantity > 1) {
      this.cartService.addToCart(publicId, 'remove');
    }
  }

  removeItem(id: string) {
    const itemToRemoveIndex = this.cart.findIndex(
      (item) => item.id === id
    );
    if (itemToRemoveIndex) {
      this.cart.splice(itemToRemoveIndex, 1);
    }
    this.cartService.removeFromCart(id);
  }

  computeTotal() {
    return this.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  checkIfEmptyCart(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return (
        this.cartQuery.isSuccess() &&
        this.cartQuery.data().products.length === 0
      );
    } else {
      return false;
    }
  }

  checkout() {
    throw new Error('Method not implemented.');
    }

}
