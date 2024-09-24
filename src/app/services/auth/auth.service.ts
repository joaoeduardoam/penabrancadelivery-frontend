
import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Product } from '../../model/Product';

import { BehaviorSubject, Observable, map, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080'

  // url:string = 'http://localhost:8080/products';

  constructor(private http:HttpClient) { }

  authSubject = new BehaviorSubject<any>({
    user: null
  })

  login(userData:any):Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/login`, userData)
  }

  register(userData:any):Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/users`, userData)
  }

  getUserProfile():Observable<any>{
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem("jwt")}`
    })
    return this.http.post<any>(`${this.baseUrl}/users`, {headers}).pipe(
      tap((user)=>{
        const currentState=this.authSubject.value;
        this.authSubject.next({...currentState,user})
      })
    )
  }

  logout(){
    localStorage.clear()
    this.authSubject.next({})
  }







}
