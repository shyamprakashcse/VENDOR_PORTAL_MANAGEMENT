import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  constructor(private route : Router){}
  ngOnInit(): void {

    localStorage.clear()

  }

  login(){

    this.route.navigate(['/login'])

  }

}
