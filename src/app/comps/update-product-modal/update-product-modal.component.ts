import { Component } from '@angular/core';
import {FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormGroupDirective, NgForm} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ErrorStateMatcher } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyMaskModule } from 'ng2-currency-mask';

@Component({
  selector: 'app-update-product-modal',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, CommonModule, MatIconModule, MatButtonModule, CurrencyMaskModule ],
  templateUrl: './update-product-modal.component.html',
  styleUrl: './update-product-modal.component.css'
})
export class UpdateProductModalComponent {

  
  urlPattern = '(https?://)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)';

  formProduct = new FormGroup({
    title: new FormControl("Atualiza Título", [Validators.required, Validators.minLength(3)]),
    description: new FormControl("Atualiza Desc", [Validators.required, Validators.minLength(5)]),
    price: new FormControl(35.90, [Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    image: new FormControl("Atualiza imagem", [Validators.required, Validators.pattern(this.urlPattern)])
  })

  onSubmit(){
    console.log("values", this.formProduct)
  }

}
