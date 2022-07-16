import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loggedUserData:any={}
  validAuth:any;
  constructor(private auth:AuthService,private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    localStorage.clear()
  }

  async loginUser(loginForm:NgForm){

    this.auth.setSpinnerValue(true)
    this.loggedUserData=loginForm.value;
    this.loggedUserData["VendorID"]= this.loggedUserData["VendorID"].toString().padStart(10,'0')

    console.log("hey this is from login user function",this.loggedUserData);


    this.spinner.show(undefined,{
      type: "ball-climbing-dot",
      color:'#0f1aec',
      size:'large',
      fullScreen:false,

      bdColor:'rgba(100,149,237,0.1)',

    });

    this.validAuth = this.auth.loginUser(this.loggedUserData);
  }


}
