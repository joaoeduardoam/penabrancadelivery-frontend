import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { UpdateProductModalComponent } from '../update-product-modal/update-product-modal.component';
import { Product } from '../../model/Product';
import { ProductService } from '../../services/product/product.service';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart/cart.service';
import { interval } from 'rxjs/internal/observable/interval';
import { take } from 'rxjs/internal/operators/take';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {

  @Input() product:Product

  userRole: string;

  labelAddToCart = 'Adicionar'
  iconAddToCart = 'add_shopping_cart'

  constructor (public dialog: MatDialog, private productService:ProductService, private authService:AuthService, private cartService:CartService, private router:Router){}

  ngOnInit(): void {    
    if (typeof window !== 'undefined') {
      this.authService.getUserProfile().subscribe(
        (auth)=>{
          this.userRole = auth.role
          console.log("userRole: ", this.userRole)
        }
      );
    }
    
  }

  
  openUpdateProductModal(){
    this.dialog.open(UpdateProductModalComponent, {
      data: this.product // Passando o produto para o modal
    });
  }

  handleDeleteProduct(){
    this.productService.deleteProduct(this.product.id).subscribe()

  }

  addToCart(productId: string) : void { 
    this.cartService.addToCart(productId, 'add');
    this.labelAddToCart = 'Adicionado ao carrinho';
    this.iconAddToCart = 'check';
    
    interval(500).pipe(take(1)).subscribe(() : void => {
    this. labelAddToCart = 'Adicionar';
    this.iconAddToCart = 'add_shopping_cart';
    })
  }

  


}
