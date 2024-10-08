import { Component } from '@angular/core';
import { ProductCardComponent } from "../product-card/product-card.component";
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
}from '@angular/material/dialog'
import { CreateProductModalComponent } from '../create-product-modal/create-product-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductCardComponent, CommonModule, MatIcon, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  vector= [1,1,1,1]

 

  constructor (public dialog: MatDialog){}

  openCreateProductModal(){
    this.dialog.open(CreateProductModalComponent)
  }



}
