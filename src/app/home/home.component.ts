import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  year:any;
  userObj:any;

  private _PayloadURL = "http://localhost:3000/api/payload"
  private _PayloadBody = {
    "token" : localStorage.getItem('token')
  }
  constructor(private auth:AuthService,private http:HttpClient,private route:Router) { }

  ngOnInit(): void {

    this.http.post<any>(this._PayloadURL,this._PayloadBody).subscribe((res)=>{
     this.userObj = res
     console.log(this.userObj)
    },(err)=>{
      console.log(err)
    })


  }

  RFQ(){
     this.route.navigate(['purchase/rfq'])
  }

  purchaseOrder(){
    this.route.navigate(['purchase/purchaseorder'])
  }

  logout(){
    this.route.navigate(['login'])
  }

  brand(){
    this.route.navigate(['port'])
  }







}
