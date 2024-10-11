import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { UpdateProductModalComponent } from '../update-product-modal/update-product-modal.component';
import { Product } from '../../model/Product';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {

  @Input() product:Product

  constructor (public dialog: MatDialog){}

  openUpdateProductModal(){
    this.dialog.open(UpdateProductModalComponent)
  }

}
