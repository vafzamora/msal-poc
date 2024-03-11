import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';

const API_ENDPOINT = "http://localhost:5224/protected"

type ApiReturn = {
  data?:string
}

@Component({
  selector: 'app-protected',
  templateUrl: './protected.component.html',
  styleUrl: './protected.component.css'
})

export class ProtectedComponent implements OnInit{
  result: ApiReturn
  isAuthorized: boolean = true

  constructor (
    private http: HttpClient
  ){}

  ngOnInit(): void {
    this.callApi();
  }

  callApi(){
    this.http.get(API_ENDPOINT)
      .subscribe({ 
        next: (result ) => {
          this.result = result; 
        },
        error: (err:HttpErrorResponse) => {
          console.log(err.status);
          this.isAuthorized = false;
        }
    })
  }
}
