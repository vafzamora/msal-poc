import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_ENDPOINT = "http://localhost:5224/open"

type ApiReturn = {
  data?:string
}


@Component({
  selector: 'app-open',
  templateUrl: './open.component.html',
  styleUrl: './open.component.css'
})
export class OpenComponent implements OnInit{
  result: ApiReturn

  constructor (
    private http: HttpClient
  ){}

  ngOnInit(): void {
    this.callApi();
  }

  callApi(){
    this.http.get(API_ENDPOINT)
      .subscribe(result => {
        this.result = result; 
      });
  }
}
