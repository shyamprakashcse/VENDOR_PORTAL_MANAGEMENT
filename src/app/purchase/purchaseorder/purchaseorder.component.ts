import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-purchaseorder',
  templateUrl: './purchaseorder.component.html',
  styleUrls: ['./purchaseorder.component.css']
})
export class PurchaseorderComponent implements OnInit {

  private _PODataURL = "http://localhost:3000/api/polist"
  PODisplayStatus:boolean = true
  POBillDisplayStatus:boolean = false
  PONavButtonStatus:boolean = false
  GoodsReceiptDisplayStatus:boolean = false
  POHistoryDisplayStatus:boolean = false
  InvoiceDisplayStatus:boolean = false

  page:number=1;
  orderField:string='';
  doc:any;
  reverseSort:boolean=false;
  print : any ;
  UserId:any;
  POBody={}
  searchInput:any= {
    "PURCHASE_ORDER_NO": "",
    "COMPANY_CODE": "",
    "PURCHASE_DOC_CATAGORY": "",
    "PURCHASE_DOC_TYPE": "",
    "STATUS": "",
    "PURCHASE_ORDER_CREATED_DATE": "",
    "VENDOR_NO": "",
    "CUSTOMER_NO": "",
    "PURCHASE_ORGANISATION": "",
    "PURCHASE_GROUP": "",
    "PURCHASE_DOC_DATE": "",
    "BID_LAST_DATE": ""
}
  POData:any=[]
  POID:string="";

  constructor(private http:HttpClient,private route:Router,private loader:NgxSpinnerService) { }

  ngOnInit(): void {
    this.loader.show(undefined,{
      type: "ball-climbing-dot",
      color:'#0f1aec',
      size:'large',
      fullScreen:false,

      bdColor:'rgba(100,149,237,0.1)',

    });

    this.UserId=localStorage.getItem('id');
    this.POBody={
      "VendorID" : this.UserId
    }
    this.http.post<any>(this._PODataURL,this.POBody).subscribe((res)=>{
      console.log(res);
      this.loader.hide();
      this.POData = res
      Swal.fire({
        icon: 'success',
        title: 'Data found',
        text: 'Purchase Order Data is Found!...',
        timer : 2000

      })

    },(err)=>{
      console.log(err);
      this.loader.hide();
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No Data is Found!...',
        timer : 2000

      })


    });
  }


  ExportPDF(){


    this.print = document.getElementById('print');
    //var width = document.getElementById('print').offsetWidth;
    html2canvas(this.print).then(canvas => {
      var imgWidth = 208;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf.jsPDF('p', 'mm', 'a4');
      var position = 5;
      pdf.addImage(contentDataURL, 'PNG', 5, position, imgWidth-7, imgHeight)
      pdf.save('RequestQuotation.pdf');
     })




  }


  POBill(){
    this.PODisplayStatus = false
    this.POBillDisplayStatus = true
    this.GoodsReceiptDisplayStatus = false
    this.POHistoryDisplayStatus = false
    this.InvoiceDisplayStatus = false

  }

  GoodsReceipt(){
    this.PODisplayStatus = false
    this.POBillDisplayStatus = false
    this.GoodsReceiptDisplayStatus = true
    this.POHistoryDisplayStatus = false
    this.InvoiceDisplayStatus = false

  }

  Invoice(){
    this.PODisplayStatus = false
    this.POBillDisplayStatus = false
    this.GoodsReceiptDisplayStatus = false
    this.POHistoryDisplayStatus = false
    this.InvoiceDisplayStatus = true

  }

  POHistory(){
    this.PODisplayStatus = false
    this.POBillDisplayStatus = false
    this.GoodsReceiptDisplayStatus = false
    this.POHistoryDisplayStatus = true
    this.InvoiceDisplayStatus = false

  }

  PO(){
    this.POID="";
    this.PODisplayStatus = true
    this.PONavButtonStatus=false;
    this.POBillDisplayStatus = false
    this.GoodsReceiptDisplayStatus = false
    this.POHistoryDisplayStatus = false
    this.InvoiceDisplayStatus = false

  }

  sortHeader(sortField:string){
    this.orderField=sortField;
    if(this.reverseSort==true)
    {
      this.reverseSort=false;
    }
    else{
      this.reverseSort=true;
    }
  }


  backToHome(){
    this.route.navigate(['home'])
  }

  setPOID(val:any){

     this.POID = val["PURCHASE_ORDER_NO"]
     this.POBillDisplayStatus = true
     this.PONavButtonStatus = true ;
     this.PODisplayStatus = false
  }

}
