import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { TokenInterceptorService } from './token-interceptor.service';
import { AuthGuard } from './auth.guard';
import { HttpClientModule,HTTP_INTERCEPTORS} from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
const route:Routes=[
  {path:'',component:LoginComponent}
]

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    RouterModule.forChild(route)
  ],
  providers:[AuthService,AuthGuard,{
    provide:HTTP_INTERCEPTORS,
    useClass:TokenInterceptorService,
    multi:true
  }
  ]

})
export class AuthModule {
  constructor(){
    console.log("auth module.ts")
  }
}
