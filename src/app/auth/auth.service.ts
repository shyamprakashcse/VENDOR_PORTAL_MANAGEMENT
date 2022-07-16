import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _VendorLoginURL = "http://localhost:3000/api/vendlogin";
  private spinner:boolean=false;
  private validAuth:any;
  private token:any="";
  private UserID:string="";
  public LoginUserObject:any;
  private _barrerTokenCheckURL="http://localhost:3000/api/barrer";


  constructor(private http:HttpClient,private route:Router,private loader:NgxSpinnerService) { }

  async loginUser(loginUserFormData:any){
    this.http.post<any>(this._VendorLoginURL,loginUserFormData).subscribe((res)=>{
       this.validAuth = true
       this.UserID = res["LIFNR"]
       this.token = res["TOKEN"]
       localStorage.setItem('id',this.UserID);
       localStorage.setItem('token',this.token);
       this.loader.hide();
       this.route.navigate(['/home']);
    },(err)=>{
      this.loader.hide();
      this.validAuth=false
       console.log(err)
       if(err.status === 404)
       this.ErrorMessage("UnAuthorized User . Please Enter a valid Credentials")
       else
       this.ErrorMessage("Internal Server Error")

       this.route.navigate(['/login']);
       return false;

    })
  }



  ErrorMessage(Text:any){
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: Text,

    })

  }

  SuccessMessage(Text:any){
    Swal.fire({
      icon: 'success',
      title: 'Successful',
      text: Text,

    })

  }


  getSpinnerValue()
  {
    return this.spinner;
  }
  setSpinnerValue(value:boolean)
  {
    this.spinner=value;

    console.log(this.spinner)
  }

  async checkBarrerToken()
  {
    this.http.get<any>(this._barrerTokenCheckURL).subscribe((res)=>{
     return true;
   },(err)=>{
     this.route.navigate(['/login']);
     return false;
   })
  }

  getTokenFromLocalStorage()
  {
    return localStorage.getItem('token');
  }

  deleteLocalStorage()
  {
    localStorage.removeItem('token');
  }

  isLoggedIn(){
    return !!localStorage.getItem('token')
  }
  logout()
  {
    localStorage.removeItem('token');
    this.route.navigate(['/login']);
  }



}
