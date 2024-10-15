import { Component, Inject, inject } from '@angular/core';
import {FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormGroupDirective, NgForm} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ErrorStateMatcher } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ProductService } from '../../services/product/product.service';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { Product } from '../../model/Product';

@Component({
  selector: 'app-update-product-modal',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, CommonModule, MatIconModule, MatButtonModule, CurrencyMaskModule,
                        MatDialogTitle, MatDialogContent
   ],
  templateUrl: './update-product-modal.component.html',
  styleUrl: './update-product-modal.component.css'
})
export class UpdateProductModalComponent {

  constructor (private productService:ProductService, @Inject(MAT_DIALOG_DATA) public product: Product, public dialogRef: MatDialogRef<UpdateProductModalComponent>){}

  
  urlPattern = '(https?://)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)';

  formProduct = new FormGroup({
    id: new FormControl(this.product.id),
    title: new FormControl(this.product.title, [Validators.required, Validators.minLength(3)]),
    description: new FormControl(this.product.description, [Validators.required, Validators.minLength(5)]),
    price: new FormControl(this.product.price, [Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    image: new FormControl(this.product.image, [Validators.required, Validators.pattern(this.urlPattern)])
  })

  onSubmit(){
    this.productService.updateProduct(this.formProduct.value as Product).subscribe({
      next:data=>console.log("PRODUCT UPDATE: ", data),
      error:error=>console.log("PRODUCT UPDATE ERROR: ", error)

    });
    console.log('UPDATE: values', this.formProduct.value)
    this.dialogRef.close();
  }

}
