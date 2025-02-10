import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Cart, CartItemAdd } from '../../model/Cart';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class CartService {

  platformId = inject(PLATFORM_ID);
  http = inject(HttpClient);

  private ordersUrl = environment.apiUrl + '/orders';
  private keyCartStorage = 'cart';
  private keySessionId = 'stripe-session-id';


  private addedToCart$ = new BehaviorSubject<Array<CartItemAdd>>([]);
  addedToCart = this.addedToCart$.asObservable();

  constructor() {
    const cartFromLocalStorage = this.getCartFromLocalStorage();
    this.addedToCart$.next(cartFromLocalStorage);


    // Listens to the 'storage' event and updates the state when localStorage changes outside the current tab scope, i.e. updates the other tabs.
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('storage', () => {
        const updatedCart = this.getCartFromLocalStorage();
        this.addedToCart$.next(updatedCart);
      });
    }
  }

  private getHeaders():HttpHeaders{
    const token=localStorage.getItem("jwt");
    console.log("localStorage.getItem(jwt): "+token);
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    })
  }

  private updateCartInLocalStorage(cart: Array<CartItemAdd>): void {
    localStorage.setItem(this.keyCartStorage, JSON.stringify(cart));
    this.addedToCart$.next(cart); 
  }


  private getCartFromLocalStorage(): Array<CartItemAdd> {
    if (isPlatformBrowser(this.platformId)) {
      const cartProducts = localStorage.getItem(this.keyCartStorage);
      if (cartProducts) {
        return JSON.parse(cartProducts) as CartItemAdd[];
      } else {
        return [];
      }
    } else {
      return [];
    }
  }



  addToCart(id: string, command: 'add' | 'remove'): void {
    if (isPlatformBrowser(this.platformId)) {
      const itemToAdd: CartItemAdd = { id, quantity: 1 };
      const cartFromLocalStorage = this.getCartFromLocalStorage();

      if (cartFromLocalStorage.length !== 0) {
        const productExist = cartFromLocalStorage.find(
          (item) => item.id === id
        );
        if (productExist) {
          if (command === 'add') {
            productExist.quantity++;
          } else if (command === 'remove') {
            productExist.quantity--;
          }
        } else {
          cartFromLocalStorage.push(itemToAdd);
        }
      } else {
        cartFromLocalStorage.push(itemToAdd);
      }

      // localStorage.setItem(
      //   this.keyCartStorage,
      //   JSON.stringify(cartFromLocalStorage)
      // );
      // this.addedToCart$.next(cartFromLocalStorage);
      
      
      this.updateCartInLocalStorage(cartFromLocalStorage);
      console.log("getCartFromLocalStorage(): ", this.getCartFromLocalStorage());
    }
  }

  removeFromCart(id: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const cartFromLocalStorage = this.getCartFromLocalStorage();
      const productExist = cartFromLocalStorage.find(
        (item) => item.id === id
      );
      if (productExist) {
        cartFromLocalStorage.splice(
          cartFromLocalStorage.indexOf(productExist),
          1
        );

        // localStorage.setItem(
        //   this.keyCartStorage,
        //   JSON.stringify(cartFromLocalStorage)
        // );
        // this.addedToCart$.next(cartFromLocalStorage);

        this.updateCartInLocalStorage(cartFromLocalStorage);
      }
    }
  }

  getCartDetail(): Observable<Cart> {
    console.log("getCartDetail()");
    const headers=this.getHeaders();
    const cartFromLocalStorage = this.getCartFromLocalStorage();
    const productsIdsList = cartFromLocalStorage.map(item => item.id);

    // const productsIdsList = cartFromLocalStorage.reduce(
      // (acc, item) => `${acc}${acc.length > 0 ? ',' : ''}${item.id}`,
    //   ''
    // );    

    // console.log("getCartDetail() - cartFromLocalStorage"+cartFromLocalStorage);
    // console.log("getCartDetail() - productsIdsList"+productsIdsList);

    // console.log("post<Cart>(`${this.ordersUrl}/get-cart-details`: "+this.http
    //   .post<Cart>(`${this.ordersUrl}/get-cart-details`, productsIdsList, {headers})
    //   .pipe(map((cart) => this.mapQuantity(cart, cartFromLocalStorage))));

    const cartObservable = this.http
      .post<Cart>(`${this.ordersUrl}/get-cart-details`, productsIdsList, { headers })
      .pipe(
        map((cart) => {
          console.log("Cart received from API:", cart);
          return this.mapQuantity(cart, cartFromLocalStorage);
        })
      );
    console.log("cartObservable: "+cartObservable);
    return cartObservable;
  }

  private mapQuantity(
    cart: Cart,
    cartFromLocalStorage: Array<CartItemAdd>
  ): Cart {
    for (const cartItem of cartFromLocalStorage) {
      const foundProduct = cart.products.find(
        (item) => item.id === cartItem.id
      );
      if (foundProduct) {
        foundProduct.quantity = cartItem.quantity;
      }
    }
    return cart;
  }

}

