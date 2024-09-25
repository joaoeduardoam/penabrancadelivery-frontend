import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080'

  // url:string = 'http://localhost:8080/products';

  constructor(private http:HttpClient) { }

  productSubject = new BehaviorSubject<any>({
    products:[],
    loading:false,
    newProduct:null
  })

  private getHeaders():HttpHeaders{
    const token=localStorage.getItem("jwt")
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    })
  }

  getProducts():Observable<any>{
    const headers=this.getHeaders();
    return this.http.get(`${this.baseUrl}/products`,{headers}).pipe(
      tap((products)=>{
        const currentState=this.productSubject.value;
        this.productSubject.next({...currentState,products});
      })
    )
  }

  createProduct(product:any):Observable<any>{
    const headers=this.getHeaders();
    return this.http.post(`${this.baseUrl}/products`, product, {headers}).pipe(
      tap((newProduct)=>{
        const currentState=this.productSubject.value;
        this.productSubject.next({...currentState, 
          products:
            [newProduct, ...currentState.products]});
      })
    )
  }

  updateProduct(product:any):Observable<any>{
    const headers=this.getHeaders();
    return this.http.put(`${this.baseUrl}/products/${product.id}`, product, {headers}).pipe(
      tap((updatedProduct:any)=>{
        const currentState=this.productSubject.value;
        const updatedProducts=currentState.products.map
          ((item:any)=>
            item.id===updatedProduct.id ? updatedProduct : item );
        this.productSubject.next({...currentState, 
          products: updatedProducts});
      })
    )
  }

  deleteProduct(productId:any):Observable<any>{
    const headers=this.getHeaders();
    return this.http.delete(`${this.baseUrl}/products/${productId}`, {headers}).pipe(
      tap((deletedProduct:any)=>{
        const currentState=this.productSubject.value;
        const updatedProducts=currentState.products.filter
          ((item:any)=>
            item.id !== productId );
        this.productSubject.next({...currentState, 
          products: updatedProducts});
      })
    )
  }






}
