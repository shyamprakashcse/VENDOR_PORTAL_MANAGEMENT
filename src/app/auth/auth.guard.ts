import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private _barrerTokenCheckURL="http://localhost:3000/api/barrer";
  private value:any=false;
  constructor(private _auth:AuthService,private _route:Router,private http:HttpClient){}

   canActivate():boolean{



    if(this._auth.checkBarrerToken())
    {
      return true;
    }
    else{
      this._route.navigate(['/login']);
      return false;
    }

  }


}
