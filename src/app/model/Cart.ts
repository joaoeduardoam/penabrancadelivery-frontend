export interface CartItemAdd {
    id: string;
    quantity: number;
  }
  
  export interface Cart {
    products: CartItem[];
  }
  
  export interface CartItem {
    title: string;
    price: number;
    image: string;
    quantity: number;
    id: string;
  }
  
  export interface StripeSession {
    id: string;
  }