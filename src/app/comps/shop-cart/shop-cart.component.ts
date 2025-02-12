import { Component, effect, EffectRef, inject, Injector, OnInit, PLATFORM_ID, runInInjectionContext } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';
import { AuthService } from '../../services/auth/auth.service';
import { ProductService } from '../../services/product/product.service';
import { CartItem, CartItemAdd } from '../../model/Cart';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  injectQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { catchError, EMPTY, lastValueFrom, Subject, takeUntil, tap } from 'rxjs';
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
    console.log("constructor() - shop-cart");
  }

  private queryClient = inject(QueryClient);
  platformId = inject(PLATFORM_ID);
  user:any=null;
  cart: Array<CartItem> = []
  labelCheckout = 'Faça login para pagamento';  
  action: 'login' | 'checkout' = 'login';
  private cartEffect: EffectRef;
  private userEffect: EffectRef;
  private destroy$ = new Subject<void>();
  private injector = inject(Injector);

  
  cartQuery = injectQuery(() => ({
    queryKey: ['cart'],
    queryFn: () => lastValueFrom(this.cartService.getCartDetail())
  })  );



  ngOnInit(): void {
    console.log("inicio ngOnInit() - shop-cart");
  
    if (typeof window !== 'undefined') {
      this.initializeUserProfile();
      this.initializeCart();
    }
    
    this.cartService.addedToCart.subscribe((cart) => this.updateQuantity(cart));
    console.log("fim ngOnInit() - shop-cart");

  }


  
  private initializeUserProfile(): void {
    // Primeiro carregamos o perfil do usuário
    this.authService.getUserProfile().pipe(
      takeUntil(this.destroy$),
      tap(auth => {
        console.log('Recebido perfil do usuário:', auth);
        this.user = auth.email;
        console.log('User profile updated:', this.user);
        
        // Só configuramos os effects após ter o usuário
        this.setupEffects();
      }),
      catchError(error => {
        console.error('Error fetching user profile:', error);
        return EMPTY;
      })
    ).subscribe();
  }


  
  private initializeCart(): void {
    // Se inscreve nas atualizações do carrinho
    this.cartService.addedToCart.pipe(
      takeUntil(this.destroy$)
    ).subscribe((cart) => this.updateQuantity(cart));
  }


  private setupEffects(): void {
    // Use runInInjectionContext do rxjs-interop
    // O Injector NÃO está naturalmente disponível aqui por isso usa-se o runInInjectionContext()
    // Quando usamos estas funções fora dos locais onde o contexto de injeção existe naturalmente,
    //  precisamos criar artificialmente este contexto.

    // constructor(private authService: AuthService) {
    // O Injector está disponível aqui}

    // ngOnInit() {
    //   effect(() => {  // ❌ Erro: Sem contexto de injeção}
    runInInjectionContext(this.injector, () => {
      this.cartEffect = effect(() => {
        try {
          if (this.cartQuery.isSuccess()) {
            const newProducts = this.cartQuery.data().products;
            
            if (!Array.isArray(newProducts)) {
              console.error('Invalid cart data received');
              return;
            }

            if (JSON.stringify(this.cart) !== JSON.stringify(newProducts)) {
              this.cart = newProducts;
              console.log('Cart updated with new products:', this.cart);
            }
          }
        } catch (error) {
          console.error('Error in cart effect:', error);
        }
      });

      this.userEffect = effect(() => {
        this.labelCheckout = this.user ? 'Pagamento' : 'Faça login para pagamento';
        this.action = this.user ? 'checkout' : 'login';
        console.log('User state updated:', {
          user: this.user,
          action: this.action,
          labelCheckout: this.labelCheckout
        });
      });
    });
  }


  
  ngOnDestroy(): void {
    // Limpa os effects
    if (this.cartEffect) {
      this.cartEffect.destroy();
    }
    if (this.userEffect) {
      this.userEffect.destroy();
    }
  
    // Limpa as subscrições
    this.destroy$.next();
    this.destroy$.complete();
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
