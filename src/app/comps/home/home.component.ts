import { Component } from '@angular/core';
import { ProductCardComponent } from "../product-card/product-card.component";
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
}from '@angular/material/dialog'
import { CreateProductModalComponent } from '../create-product-modal/create-product-modal.component';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../model/Product';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductCardComponent, CommonModule, MatIcon, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  products: Product[] = [];

  userRole: string;
 

  constructor (public dialog: MatDialog, private productService:ProductService, private authService:AuthService){}


  openCreateProductModal(){
    this.dialog.open(CreateProductModalComponent)
  }


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
    this.productService.getProducts().subscribe()

    this.productService.productSubject.subscribe(
      (state)=>{
        console.log("Prodcts state: ", state)
        this.products = state.products
      }
    )

    this.authService.getUserProfile().subscribe(
      (auth)=>{
        this.userRole = auth.role
        console.log("userRole: ", this.userRole)
      }
    );

  }

}
