import { Component, OnInit,Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  print:any;
  @Input() selectedData:any;

  private _InvoiceURL = 'http://localhost:3000/api/vendinvoice'
  private _InvoiceBody = {
    "PurchaseOrderNo" : ""
  }
  private _PayLoadURL = "http://localhost:3000/api/payload"
  private _PayLoadBody = {
 "token":localStorage.getItem('token')
           }
  InvoiceItem:any=[]

  OrgData:any={

}

  TotalStockValue:number=0
  TotalStockQuantityValue:number=0
  TotalAmtDocCurrency:number=0
  TotalPaidAmt:number=0
  TotalBalAmt:number=0

  DisplayStatus:boolean = true

  constructor(private http:HttpClient,private loader:NgxSpinnerService) { }

  ngOnInit(): void {

    this.loader.show(undefined,{
      type: "ball-climbing-dot",
      color:'#0f1aec',
      size:'large',
      fullScreen:false,

      bdColor:'rgba(100,149,237,0.1)',

    });

    this._InvoiceBody['PurchaseOrderNo']=this.selectedData
    this.http.post<any>(this._InvoiceURL,this._InvoiceBody).subscribe((res)=>{
      this.loader.hide();
      this.InvoiceItem=res;
      if(res.length>0){
        this.DisplayStatus=true
      }
      else{
        this.DisplayStatus=false
      }
      this.calculateTotal();
      Swal.fire({
        icon: 'success',
        title: 'Invoice Receipt found',
        text: 'Invoice Data is Found!...',
        timer : 2000

      })

    },(err)=>{
      this.loader.hide();
      this.DisplayStatus=false
      console.log(err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No Data is Found!...',
        timer : 2000

      })
    });


    this.http.post<any>(this._PayLoadURL,this._PayLoadBody).subscribe((res)=>{

      this.OrgData = res
   },(err)=>{
     console.log(err)
   });


  }

ExportPDF(){
  this.print = document.getElementById('print');
  //var width = document.getElementById('print').offsetWidth;
  html2canvas(this.print).then(canvas => {
    var imgWidth = 208;
    var imgHeight = canvas.height * imgWidth / canvas.width;
    const contentDataURL = canvas.toDataURL('image/png')
    let pdf = new jspdf.jsPDF('p', 'mm', 'a3');
    var position = 5;
    pdf.addImage(contentDataURL, 'PNG', 5, position, imgWidth-7, imgHeight)
    pdf.save('GoodsReceipt.pdf');
   })
}

 calculateTotal(){
    this.InvoiceItem.forEach((value:any) => {
      this.TotalStockValue+=parseFloat(value['TOTAL_VALUE_STOCK'])
      this.TotalStockQuantityValue+=parseFloat(value['TOTAL_VALUE_STOCK_QUAN'])
      this.TotalAmtDocCurrency+=parseFloat(value['AMT_DOC_CURR']);

      if(value['CRDBIND']=='S'){
        this.TotalPaidAmt+=parseFloat(value['AMT_DOC_CURR']);
      }
      else if(value['CRDBIND']=='H'){
        this.TotalBalAmt+=parseFloat(value['AMT_DOC_CURR'])
      }
    });


 }

}
