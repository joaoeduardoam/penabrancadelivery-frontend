import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { Router } from '@angular/router';
import { Product } from '../../model/Product';
import { error } from 'console';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit{

  product: Product;

  userRole: string;
 


  constructor(private productService:ProductService, private router:Router){}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  productDetail(productId:number){
    this.productService.productSubject.subscribe(
      (state)=>{
        console.log("Product Detail: ", state)
        this.product = state.product
      },
      error=>{
        console.log("Product Detail: ", error)
      }

    )
  }

}
