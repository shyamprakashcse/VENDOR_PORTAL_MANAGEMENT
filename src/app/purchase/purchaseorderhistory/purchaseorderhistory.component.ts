import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-purchaseorderhistory',
  templateUrl: './purchaseorderhistory.component.html',
  styleUrls: ['./purchaseorderhistory.component.css']
})
export class PurchaseorderhistoryComponent implements OnInit {
  print:any;
  @Input() selectedData:any;

  private _POHistoryURL = 'http://localhost:3000/api/pohistory'
  private _PayLoadURL = "http://localhost:3000/api/payload"
  private _POHistoryBody = {
    "PurchaseOrderNo" : ""
  }
  private _PayLoadBody = {
    "token":localStorage.getItem('token')
   }
  TotalAmtLocCurr=0
  TotalAmtDocCurr=0
  TotalQuant=0
  TotalPaidAmt=0
  TotalBalAmt=0

  OrderHistory:any=[]

  DisplayStatus:boolean=true




OrgData:any={
  "ORGNAME" : "Birla Sun Shine Contructions",
  "STREET" : "28 EzhilNagar",
  "POSTALCODE" : "600118"
}


  constructor(private http:HttpClient,private loader : NgxSpinnerService) {

   }

  ngOnInit(): void {

    this.loader.show(undefined,{
      type: "ball-climbing-dot",
      color:'#0f1aec',
      size:'large',
      fullScreen:false,

      bdColor:'rgba(100,149,237,0.1)',

    });

    this._POHistoryBody['PurchaseOrderNo']=this.selectedData ;

    this.http.post<any>(this._POHistoryURL,this._POHistoryBody ).subscribe((res)=>{
      this.OrderHistory = res;
      this.loader.hide();
      if(res.length>0){
        this.DisplayStatus=true
      }
      else{
        this.DisplayStatus = false
      }

      Swal.fire({
        icon: 'success',
        title: 'Order History found',
        text: 'Order History Data is Found!...',
        timer : 2000

      })

      console.log(this.OrderHistory);
      this.calculateQuantity();
    },(err)=>{
       console.log(err);
       this.DisplayStatus=false
       this.loader.hide()
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
    pdf.save('PurchaseOrderHistory.pdf');
   })
}

 calculateQuantity(){
      this.OrderHistory.forEach((element:any) => {
        if(parseFloat(element['QUANTITY'])>0){
          this.TotalQuant+=parseFloat(element['QUANTITY'])
          this.TotalAmtLocCurr+=parseFloat(element['AMT_LOC_CURR'])
          this.TotalAmtDocCurr+=parseFloat(element['AMT_DOC_CURR'])

          if(element['DEBCREDIND']=='S'){
            this.TotalPaidAmt+=parseFloat(element['AMT_LOC_CURR'])
          }
          else if(element['DEBCREDIND']=='H'){
            this.TotalBalAmt+=parseFloat(element['AMT_LOC_CURR']);
          }
        }
      });
 }

}
