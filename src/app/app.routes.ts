import { Routes } from '@angular/router';

export const routes: Routes = [
    {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full'
    },
    {
      path: 'home',
      loadComponent: () => import('./comps/home/home.component').then(m => m.HomeComponent)
    },
    {
      path: 'shop-cart',
      loadComponent: () => import('./comps/shop-cart/shop-cart.component').then(m => m.ShopCartComponent)
    },
  ];